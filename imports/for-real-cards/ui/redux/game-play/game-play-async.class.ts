import {Injectable} from '@angular/core';
import * as log from 'loglevel';

import { Observable} from 'rxjs/Observable';

import {
  GameSubscriptionOptions,
  GAME_SUBSCRIPTION_NAME,
  GamePlayActionCollection,
  GamePlayAction,
  HandCollection,
  HandInterface
} from "../../../api";

import {GamePlayActions} from "./game-play-actions.class";
import { IGamePlayState, IGamePlayActionPayload } from "./game-play.types";
import {IPayloadAction} from 'redux-package';
import {
  IDocumentChange,
  EDocumentChangeType
} from "../../../../common-app/src/ui/reactive-data/document-change.interface";
import {
  MeteorCursorObservers,
  BatchAndWatch
} from "../../../../common-app/src/ui/reactive-data/meteor-cursor-observers";

@Injectable()
export class GamePlayAsync {

  gamePlayMiddleware = (gameState: IGamePlayState) => next => (action: IPayloadAction) => {
    let payload: IGamePlayActionPayload = action.payload;
    switch (action.type) {
      case GamePlayActions.GAME_PLAY_ACTION_PUSH:
        Meteor.call('fastcards.NewAction', payload.gamePlayAction, (error)=> {
          if (error) {
            GamePlayActions.error(error);
          }
        });
        break;
      case GamePlayActions.GAME_PLAY_ACTIONSSS_PUSH:
        Meteor.call('fastcards.NewActions', payload.gamePlayActions, (error)=> {
          if (error) {
            GamePlayActions.error(error);
          }
        });
        break;
      case GamePlayActions.GAME_PLAY_INITIALIZE:
        watchGamePlayActionsAndHand(payload.gameId);
        break;
    }
    return next(action);
  };
}
/**
 * Check to see if action is ready, where ready means the hands it references are present
 * @param hands
 * @param action
 * @returns {boolean}
 */
function isHandReady(hands:HandInterface[], action:GamePlayAction):boolean {
  if (action.toPlayerId && hands.findIndex( hand => hand.userId===action.toPlayerId ) === -1)
    return false;
  if (action.fromPlayerId && hands.findIndex( hand => hand.userId===action.fromPlayerId ) === -1 )
    return false;
  return true;
}

function isBufferReady(knownHands:HandInterface[], buffer:GamePlayAction[]):boolean {
  let wholeBufferReady = true;
  for (let i = 0; i<buffer.length; i++) { // Flush the whole buffer only, to avoid order of processing glitches
    let bufferedAction = buffer[i];
    if (!isHandReady(knownHands, bufferedAction)) {
      wholeBufferReady = false;
      break;
    }
  }
  return wholeBufferReady;
}

function runSubscription(gameId:string) {
  let options: GameSubscriptionOptions = {gameId: gameId};
  return Meteor.subscribe(GAME_SUBSCRIPTION_NAME, options, {
    onStop: (error) => {
      if (error) {
        log.error("Error returned from Meteor.subscribe");
        log.error(error);
        GamePlayActions.error(error);
      }
    },
    onReady: ()=> {

    }
  });
}

function watchGamePlayActionsAndHand(gameId:string) {
  Tracker.autorun(()=> {
    let subscriptionHandle = runSubscription(gameId);

    let isReady = subscriptionHandle.ready();
    if (isReady) {
      let knownHands:HandInterface[] = [];
      let buffer:GamePlayAction[] = [];
      let handsCursor: Mongo.Cursor<any> = HandCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});
      let hands$:Observable<IDocumentChange<HandInterface>> = MeteorCursorObservers.fromMeteorCursor<HandInterface>(handsCursor);
      hands$.subscribe(
        (handChange:IDocumentChange<HandInterface>) => {
          switch (handChange.changeType) {
            case EDocumentChangeType.NEW: {
              GamePlayActions.newHand(gameId, handChange.newDocument);
              knownHands.push(handChange.newDocument);
              if (isBufferReady(knownHands, buffer)) {
                GamePlayActions.receiveActions(buffer);
                buffer = [];
              }
              subscriptionHandle = runSubscription(gameId); // Rerun subscription so users gets refreshed (reactive join issue)
              break;
            }
            default: // TODO: handle user leaving
//              console.log('handChange - not sure if it matters');
//              console.log(handChange);
          }
        }
      );
//      log.debug('execute action query. gameId:' + gameId);
      let actionCursor: Mongo.Cursor<any> = GamePlayActionCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});

      let gameActions$:Observable<IDocumentChange<GamePlayAction>> = MeteorCursorObservers.fromMeteorCursor<GamePlayAction>(actionCursor);
      let batchAndWatch:BatchAndWatch<IDocumentChange<GamePlayAction>> = MeteorCursorObservers.batchAndWatch(gameActions$);
      batchAndWatch.batchObservable.subscribe( (gamePlayActionChanges:IDocumentChange<GamePlayAction>[]) => {
        gamePlayActionChanges.forEach( (gamePlayActionChange:IDocumentChange<GamePlayAction>)=>{
          switch (gamePlayActionChange.changeType) {
            case EDocumentChangeType.NEW: {
              buffer.push(gamePlayActionChange.newDocument);
              break;
            }
            default:
              GamePlayActions.error('only expecting new game state records')
          }

        });
        if (isBufferReady(knownHands, buffer)) {
          GamePlayActions.receiveActions(buffer);
          buffer = [];
        }
      });
      batchAndWatch.watchedObservable.subscribe(
        (gamePlayActionChange:IDocumentChange<GamePlayAction>) => {
          switch (gamePlayActionChange.changeType) {
            case EDocumentChangeType.NEW: {
              let action:GamePlayAction = gamePlayActionChange.newDocument;

              // If the hand is not read yet, defer.  There is probably a more streamy way (Observable.bufferWhen???)
              if ( isHandReady(knownHands, action) ){
                GamePlayActions.receiveAction(action);
              } else {
                buffer.push(action);
              }
              break;
            }
            default:
              GamePlayActions.error('only expecting new game state records')
          }
        }
        );
    }
  })
}

