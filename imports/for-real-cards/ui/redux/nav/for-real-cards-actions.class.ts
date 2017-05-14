import {ReduxModuleUtil} from 'common-app';
import {ReduxPackageCombiner} from "redux-package";

export class ForRealCardsActions {
  private static prefix = 'FRC_';
  static START_NEW_GAME_REQUEST = ForRealCardsActions.prefix + 'START_NEW_GAME_REQUEST';
  static JOIN_GAME_REQUEST = ForRealCardsActions.prefix + 'JOIN_GAME_REQUEST';
  static ENTER_GAME_FAIL = ForRealCardsActions.prefix + 'ENTER_GAME_FAIL';
  static JOIN_GAME_SUCCESS = ForRealCardsActions.prefix + 'JOIN_GAME_SUCCESS';
  static VIEW_GAME_REQUEST = ForRealCardsActions.prefix + 'VIEW_GAME_REQUEST';
  static VIEW_GAME_SUCCESS = ForRealCardsActions.prefix + 'VIEW_GAME_SUCCESS';
  static LOAD_GAME_REQUEST = ForRealCardsActions.prefix + 'LOAD_GAME_REQUEST';
  static LOAD_GAME_SUCCESS = ForRealCardsActions.prefix + 'LOAD_GAME_SUCCESS';

  static newGame(password:string) : void {
    ReduxPackageCombiner.dispatch({type:ForRealCardsActions.START_NEW_GAME_REQUEST, payload: {password:password}});
  }

  static joinGameRequest(gameId:string, password:string) : void {
    ReduxPackageCombiner.dispatch({type:ForRealCardsActions.JOIN_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  static joinGameSuccess(gameId:string) {
    ReduxPackageCombiner.dispatch({type:ForRealCardsActions.JOIN_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  static loadGameRequest(gameId:string, password:string) {
    ReduxPackageCombiner.dispatch({type:ForRealCardsActions.LOAD_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  static loadGameSuccess(gameId:string) {
    ReduxPackageCombiner.dispatch({type:ForRealCardsActions.LOAD_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  static viewGameRequest(gameId:string, password:string) {
    ReduxPackageCombiner.dispatch({type:ForRealCardsActions.VIEW_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  static viewGameSuccess(gameId:string) {
    ReduxPackageCombiner.dispatch({type:ForRealCardsActions.VIEW_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  static error(error) {
    ReduxPackageCombiner.dispatch( ReduxModuleUtil.errorFactory(ForRealCardsActions.ENTER_GAME_FAIL, error) );
  }
}
