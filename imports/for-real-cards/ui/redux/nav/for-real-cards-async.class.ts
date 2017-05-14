import { Injectable } from '@angular/core';
import * as log from 'loglevel';

import { IForRealCardsState, IForRealCardsActionPayload} from "./for-real-cards.types";
import { ForRealCardsActions } from "./for-real-cards-actions.class";
import { GamePlayActions } from "../game-play/game-play-actions.class";
import { HandInterface } from "../../../api/";
import { IPayloadAction } from 'redux-package';

export class ForRealCardsAsync {

  gameNavigationMiddleware = (state: IForRealCardsState) => next => (action: IPayloadAction) => {
    let payload: IForRealCardsActionPayload = action.payload;
    switch (action.type) {
      case ForRealCardsActions.START_NEW_GAME_REQUEST:
        Meteor.call('ForRealCardsNewGame', payload.password, (error, gameId)=> {
          if (error) {
            log.error(error);
            ForRealCardsActions.error(error);
          } else {
            GamePlayActions.initialize(gameId);
            ForRealCardsActions.joinGameSuccess(gameId);
          }
        });
        break;
      case ForRealCardsActions.JOIN_GAME_REQUEST:
        Meteor.call('ForRealCardsJoinGame', payload.gameId, payload.password, (error, result:HandInterface)=> {
          if (error) {
            log.error('ForRealCardsJoinGame returned error');
            log.error(error);
            if (error.error==="gameId-not-found") {
              ForRealCardsActions.error(new Meteor.Error('gameId-not-found', "That game ID does not exist. Game Id=" + payload.gameId));
            } else {
              ForRealCardsActions.error(error);
            }
          } else {
            GamePlayActions.initialize(payload.gameId);
            ForRealCardsActions.joinGameSuccess(payload.gameId);
          }
        });
        break;
      case ForRealCardsActions.VIEW_GAME_REQUEST: // Fallthrough
      case ForRealCardsActions.LOAD_GAME_REQUEST:
        Meteor.call('ForRealCardsViewGameCheck', payload.gameId, payload.password, (error, result:boolean)=> {
          if (error) {
            log.error('ForRealCardsViewGameCheck returned error');
            log.error(error);
            ForRealCardsActions.error(error);
          } else {
            GamePlayActions.initialize(payload.gameId);
            if (action.type===ForRealCardsActions.VIEW_GAME_REQUEST)
              ForRealCardsActions.viewGameSuccess(payload.gameId);
            else
              ForRealCardsActions.loadGameSuccess(payload.gameId);
          }
        });
        break;
    }
    return next(action);
  };
}
