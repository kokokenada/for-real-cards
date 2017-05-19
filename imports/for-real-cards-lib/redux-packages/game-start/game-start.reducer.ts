import { IGameStartState } from "./game-start-state-interface";
import { IGameStartActionPayload } from "./game-start-payload-interface";
import { GameStartActions } from "./game-start-actions";
import { IPayloadAction } from 'redux-package';

export const INITIAL_STATE_GAME_START = {
  gameDescription: "New Game",
  gameId: null,
  loading: false
};

export function gameStartReducer(
  state: IGameStartState = INITIAL_STATE_GAME_START,
  action: IPayloadAction) {

  let payload:IGameStartActionPayload = action.payload;
  switch (action.type) {
    case (GameStartActions.JOIN_GAME_REQUEST):
    case (GameStartActions.LOAD_GAME_REQUEST):
    case (GameStartActions.VIEW_GAME_REQUEST):
    {
      return Object.assign({}, state, {loading: true})
    }
    case (GameStartActions.JOIN_GAME_SUCCESS):
    case (GameStartActions.VIEW_GAME_SUCCESS):
    case (GameStartActions.LOAD_GAME_SUCCESS):
    {
      return Object.assign({}, state, {gameDescription: '(id '+ payload.gameId + ')', gameId:payload.gameId, loading:false});
    }
    default:
      return state;
  }
}

