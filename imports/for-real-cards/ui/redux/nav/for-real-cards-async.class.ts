/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Injectable } from '@angular/core';
import * as log from 'loglevel';

import { IForRealCardsState, IForRealCardsActionPayload} from "./for-real-cards.types";
import { ForRealCardsActions } from "./for-real-cards-actions.class";
import { GamePlayActions } from "../game-play/game-play-actions.class";
import { HandInterface } from "../../../api/";
import {IPayloadAction} from "../../../../common-app/src/ui/redux/action.interface";

@Injectable()
export class ForRealCardsAsync {
  constructor(private forRealCardActions: ForRealCardsActions, private gamePlayAction:GamePlayActions) {
  }

  gameNavigationMiddleware = (state: IForRealCardsState) => next => (action: IPayloadAction) => {
    let payload: IForRealCardsActionPayload = action.payload;
    switch (action.type) {
      case ForRealCardsActions.START_NEW_GAME_REQUEST:
        Meteor.call('ForRealCardsNewGame', payload.password, (error, gameId)=> {
          if (error) {
            log.error(error);
            this.forRealCardActions.error(error);
          } else {
            this.gamePlayAction.initialize(gameId);
            this.forRealCardActions.joinGameSuccess(gameId);
          }
        });
        break;
      case ForRealCardsActions.JOIN_GAME_REQUEST:
        Meteor.call('ForRealCardsJoinGame', payload.gameId, payload.password, (error, result:HandInterface)=> {
          if (error) {
            log.error('ForRealCardsJoinGame returned error');
            log.error(error);
            if (error.error==="gameId-not-found") {
              this.forRealCardActions.error(new Meteor.Error('gameId-not-found', "That game ID does not exist. Game Id=" + payload.gameId));
            } else {
              this.forRealCardActions.error(error);
            }
          } else {
            log.debug('ForRealCardsJoinGame returned OK');
            log.debug(result);
            this.gamePlayAction.initialize(payload.gameId);
            this.forRealCardActions.joinGameSuccess(payload.gameId);
          }
        });
        break;
      case ForRealCardsActions.VIEW_GAME_REQUEST: // Fallthrough
      case ForRealCardsActions.LOAD_GAME_REQUEST:
        Meteor.call('ForRealCardsViewGameCheck', payload.gameId, payload.password, (error, result:boolean)=> {
          if (error) {
            log.error('ForRealCardsViewGameCheck returned error');
            log.error(error);
            this.forRealCardActions.error(error);
          } else {
            this.gamePlayAction.initialize(payload.gameId);
            if (action.type===ForRealCardsActions.VIEW_GAME_REQUEST)
              this.forRealCardActions.viewGameSuccess(payload.gameId);
            else
              this.forRealCardActions.loadGameSuccess(payload.gameId);
          }
        });
        break;
    }
    return next(action);
  };
}
