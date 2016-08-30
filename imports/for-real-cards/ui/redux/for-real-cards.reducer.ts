
import { makeTypedFactory } from 'typed-immutable-record';

import {IForRealCardsState, IForRealCardsRecord, IForRealCardsAction} from "./for-real-cards.types";
import {IPayloadAction} from "../../../common-app";
import {ForRealCardsActions} from "./for-real-cards-actions.class";

export const ForRealCardsFactory = makeTypedFactory<IForRealCardsState, IForRealCardsRecord>({
  topFrame: null
});

export const INITIAL_STATE = ForRealCardsFactory();

export function forRealCardsReducer(
  state: IForRealCardsRecord = INITIAL_STATE,
  action: IPayloadAction) {

  let payload:IForRealCardsAction = action.payload;
  switch (action.type) {
/*    case ForRealCardsActions.SET_TOPFRAME:
      return state.merge({
        topFrame: payload.topFrame
      });*/
    default:
      return state;
  }
}

