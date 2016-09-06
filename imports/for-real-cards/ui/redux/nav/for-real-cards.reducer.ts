/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { makeTypedFactory } from 'typed-immutable-record';

import {IForRealCardsState, IForRealCardsRecord, IForRealCardsActionPayload} from "./for-real-cards.types";
import {IPayloadAction} from "../../../../common-app";
import {ForRealCardsActions} from "./for-real-cards-actions.class";

export const ForRealCardsFactory = makeTypedFactory<IForRealCardsState, IForRealCardsRecord>({
  gameDescription: "New Game"
});

export const INITIAL_STATE = ForRealCardsFactory();

export function forRealCardsReducer(
  state: IForRealCardsRecord = INITIAL_STATE,
  action: IPayloadAction) {

  let payload:IForRealCardsActionPayload = action.payload;
  switch (action.type) {
    case (ForRealCardsActions.JOIN_GAME_SUCCESS):
    case (ForRealCardsActions.VIEW_GAME_SUCCESS):
    {
      return state.set('gameDescription', '(id '+ action.payload.gameId + ')');
    }
    default:
      return state;
  }
}

