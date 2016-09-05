/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { makeTypedFactory } from 'typed-immutable-record';

import {IForRealCardsState, IForRealCardsRecord, IForRealCardsActionPayload} from "./for-real-cards.types";
import {IPayloadAction} from "../../../../common-app";

export const ForRealCardsFactory = makeTypedFactory<IForRealCardsState, IForRealCardsRecord>({
  gameDescription: "New Game"
});

export const INITIAL_STATE = ForRealCardsFactory();

export function forRealCardsReducer(
  state: IForRealCardsRecord = INITIAL_STATE,
  action: IPayloadAction) {

  let payload:IForRealCardsActionPayload = action.payload;
  switch (action.type) {
/*


 if (action.actionType === GamePlayActionType.DEAL || action.actionType === GamePlayActionType.NEW_HAND) {
 this.description = RunGame.gameState.currentGameConfig.name + " (id " + action.gameId + ")"; // TODO: Change this to pull name from event instead of global state
 } else if (action.actionType === GamePlayActionType.RESET || action.actionType===GamePlayActionType.NEW_GAME) {
 this.description = "New Game (id " + action.gameId + ")";
 } else if (action.actionType === GamePlayActionType.LEAVE_GAME) {
 this.description = '';
 }


;*/
    default:
      return state;
  }
}

