
import { makeTypedFactory } from 'typed-immutable-record';

import {IGamePlayActionPayload, IGamePlayRecord, IGamePlayState } from "./game-play.types";
import {IPayloadAction} from "../../../../common-app";
import {GamePlayActions} from "./game-play-actions.class";

export const GamePlayFactory = makeTypedFactory<IGamePlayState, IGamePlayRecord>({
  topFrame: null
});

export const INITIAL_STATE = GamePlayFactory();

export function gamePlayReducer(
  state: IGamePlayRecord = INITIAL_STATE,
  action: IPayloadAction) {

  let payload:IPayloadAction = action.payload;
  switch (action.type) {
/*    case ForRealCardsActions.SET_TOPFRAME:
      return state.merge({
        topFrame: payload.topFrame
      });*/
    default:
      return state;
  }
}

