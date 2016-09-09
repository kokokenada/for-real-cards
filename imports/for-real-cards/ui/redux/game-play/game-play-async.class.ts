/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import {Injectable} from '@angular/core';
import * as log from 'loglevel';

import { Observable} from 'rxjs/Observable';

import {
  BatchAndWatch,
  IDocumentChange,
  IPayloadAction,
  EDocumentChangeType,
  MeteorCursorObservers
} from "../../../../common-app";

import {
  GameSubscriptionOptions,
  GAME_SUBSCRPTION_NAME,
  GamePlayActionCollection,
  GamePlayAction,
  HandCollection,
  HandInterface
} from "../../../api";

import {GamePlayActions} from "./game-play-actions.class";
import { IGamePlayState, IGamePlayActionPayload } from "./game-play.types";

@Injectable()
export class GamePlayAsync {

  constructor(private gamePlayActions: GamePlayActions) {
  }

  gamePlayMiddleware = (gameState: IGamePlayState) => next => (action: IPayloadAction) => {
    let payload: IGamePlayActionPayload = action.payload;
    switch (action.type) {
      case GamePlayActions.GAME_PLAY_ACTION_PUSH:
        Meteor.call('fastcards.NewAction', payload.gamePlayAction, (error)=> {
          if (error) {
            this.gamePlayActions.error(error);
          }
        });
        break;
      case GamePlayActions.GAME_PLAY_ACTIONSSS_PUSH:
        Meteor.call('fastcards.NewActions', payload.gamePlayActions, (error)=> {
          if (error) {
            this.gamePlayActions.error(error);
          }
        });
        break;
      case GamePlayActions.GAME_PLAY_INITIALIZE:
        let gameId:string = payload.gameId;
        this.gamePlayActions.setGameId(gameId);
        watchGamePlayActionsAndHand(this.gamePlayActions, gameId);
        break;
    }
    return next(action);
  };
}

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

function watchGamePlayActionsAndHand(gamePlayActions: GamePlayActions, gameId:string) {
  Tracker.autorun(()=> {
    let options: GameSubscriptionOptions = {gameId: gameId};
    let subscriptionHandle = Meteor.subscribe(GAME_SUBSCRPTION_NAME, options, {
      onStop: (error) => {
        if (error) {
          log.error("Error returned from Meteor.subscribe");
          log.error(error);
          gamePlayActions.error(error);
        }
      },
      onReady: ()=> {

      }
    });

    let isReady = subscriptionHandle.ready();
    if (isReady) {
      log.debug('in watchGamePlayActionsAndHand and isReady');
      let knownHands:HandInterface[] = [];
      let buffer:GamePlayAction[] = [];
      let handsCursor: Mongo.Cursor<any> = HandCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});
      let hands$:Observable<IDocumentChange<HandInterface>> = MeteorCursorObservers.createCursorObserver<HandInterface>(handsCursor);
      hands$.subscribe(
        (handChange:IDocumentChange<HandInterface>) => {
          switch (handChange.changeType) {
            case EDocumentChangeType.NEW: {
              gamePlayActions.newHand(gameId, handChange.newDocument);
              knownHands.push(handChange.newDocument);
              if (isBufferReady(knownHands, buffer)) {
                gamePlayActions.receiveActions(buffer);
                buffer = [];
              }
              break;
            }
            default: // TODO: handle user leaving
              console.log('handChange - not sure if it matters');
              console.log(handChange);
          }
        }
      );
      log.debug('execute action query. gameId:' + gameId);
      let actionCursor: Mongo.Cursor<any> = GamePlayActionCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});

      let gameActions$:Observable<IDocumentChange<GamePlayAction>> = MeteorCursorObservers.createCursorObserver<GamePlayAction>(actionCursor);
      let batchAndWatch:BatchAndWatch<IDocumentChange<GamePlayAction>> = MeteorCursorObservers.batchAndWatch(gameActions$);
      batchAndWatch.batchObservable.subscribe( (gamePlayActionChanges:IDocumentChange<GamePlayAction>[]) => {
        gamePlayActionChanges.forEach( (gamePlayActionChange:IDocumentChange<GamePlayAction>)=>{
          switch (gamePlayActionChange.changeType) {
            case EDocumentChangeType.NEW: {
              buffer.push(gamePlayActionChange.newDocument);
              break;
            }
            default:
              gamePlayActions.error('only expecting new game state records')
          }

        });
        if (isBufferReady(knownHands, buffer)) {
          gamePlayActions.receiveActions(buffer);
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
                gamePlayActions.receiveAction(action);
                console.log('done receiveAction');
              } else {
                buffer.push(action);
              }
              break;
            }
            default:
              gamePlayActions.error('only expecting new game state records')
          }
        }
        );
    }
  })
}

