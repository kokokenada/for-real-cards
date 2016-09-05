/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import {Injectable} from '@angular/core';
import * as log from 'loglevel';

import { Observable} from 'rxjs/Observable';

import {
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

      log.debug('execute action query. gameId:' + gameId);
      let actionCursor: Mongo.Cursor<any> = GamePlayActionCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});

      let gameActions$:Observable<IDocumentChange<GamePlayAction>> = MeteorCursorObservers.createCursorObserver<GamePlayAction>(actionCursor);
      gameActions$.subscribe(
        (gamePlayActionChange:IDocumentChange<GamePlayAction>) => {
          switch (gamePlayActionChange.changeType) {
            case EDocumentChangeType.NEW: {
              gamePlayActions.receiveActon(gamePlayActionChange.newDocument);
              break;
            }
            default:
              gamePlayActions.error('only expecting new game state records')
          }
        }
      );

      let handsCursor: Mongo.Cursor<any> = HandCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});
      let hands$:Observable<IDocumentChange<HandInterface>> = MeteorCursorObservers.createCursorObserver<HandInterface>(handsCursor);
      hands$.subscribe(
        (handChange:IDocumentChange<HandInterface>) => {
          switch (handChange.changeType) {
            case EDocumentChangeType.NEW: {
              gamePlayActions.newHand(gameId, handChange.newDocument);
              break;
            }
            default: // TODO: handle user leaving
              console.log('handChange - not sure if it matters');
              console.log(handChange);
          }
        }
      );

    }
  })
}

