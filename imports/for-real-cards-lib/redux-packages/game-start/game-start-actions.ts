import {ReduxModuleUtil} from 'common-app';
import {ReduxPackageCombiner} from "redux-package";

export class GameStartActions {
  private static prefix = 'FRC_';
  static START_NEW_GAME_REQUEST = GameStartActions.prefix + 'START_NEW_GAME_REQUEST';
  static JOIN_GAME_REQUEST = GameStartActions.prefix + 'JOIN_GAME_REQUEST';
  static ENTER_GAME_FAIL = GameStartActions.prefix + 'ENTER_GAME_FAIL';
  static JOIN_GAME_SUCCESS = GameStartActions.prefix + 'JOIN_GAME_SUCCESS';
  static VIEW_GAME_REQUEST = GameStartActions.prefix + 'VIEW_GAME_REQUEST';
  static VIEW_GAME_SUCCESS = GameStartActions.prefix + 'VIEW_GAME_SUCCESS';
  static LOAD_GAME_REQUEST = GameStartActions.prefix + 'LOAD_GAME_REQUEST';
  static LOAD_GAME_SUCCESS = GameStartActions.prefix + 'LOAD_GAME_SUCCESS';

  static newGame(password:string) : void {
    ReduxPackageCombiner.dispatch({type:GameStartActions.START_NEW_GAME_REQUEST, payload: {password:password}});
  }

  static joinGameRequest(gameId:string, password:string) : void {
    ReduxPackageCombiner.dispatch({type:GameStartActions.JOIN_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  static joinGameSuccess(gameId:string) {
    ReduxPackageCombiner.dispatch({type:GameStartActions.JOIN_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  static loadGameRequest(gameId:string, password:string) {
    ReduxPackageCombiner.dispatch({type:GameStartActions.LOAD_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  static loadGameSuccess(gameId:string) {
    ReduxPackageCombiner.dispatch({type:GameStartActions.LOAD_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  static viewGameRequest(gameId:string, password:string) {
    ReduxPackageCombiner.dispatch({type:GameStartActions.VIEW_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  static viewGameSuccess(gameId:string) {
    ReduxPackageCombiner.dispatch({type:GameStartActions.VIEW_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  static error(error) {
    ReduxPackageCombiner.dispatch( ReduxModuleUtil.errorFactory(GameStartActions.ENTER_GAME_FAIL, error) );
  }
}
