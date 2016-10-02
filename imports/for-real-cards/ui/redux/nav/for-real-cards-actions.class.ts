import {ReduxModuleUtil} from "../../../../common-app/src/ui/redux/redux-module-util";
import {ReduxModuleCombiner} from "../../../../common-app/src/ui/redux/redux-module-combiner";

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
    ReduxModuleCombiner.ngRedux.dispatch({type:ForRealCardsActions.START_NEW_GAME_REQUEST, payload: {password:password}});
  }

  static joinGameRequest(gameId:string, password:string) : void {
    ReduxModuleCombiner.ngRedux.dispatch({type:ForRealCardsActions.JOIN_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  static joinGameSuccess(gameId:string) {
    ReduxModuleCombiner.ngRedux.dispatch({type:ForRealCardsActions.JOIN_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  static loadGameRequest(gameId:string, password:string) {
    ReduxModuleCombiner.ngRedux.dispatch({type:ForRealCardsActions.LOAD_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  static loadGameSuccess(gameId:string) {
    ReduxModuleCombiner.ngRedux.dispatch({type:ForRealCardsActions.LOAD_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  static viewGameRequest(gameId:string, password:string) {
    ReduxModuleCombiner.ngRedux.dispatch({type:ForRealCardsActions.VIEW_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  static viewGameSuccess(gameId:string) {
    ReduxModuleCombiner.ngRedux.dispatch({type:ForRealCardsActions.VIEW_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  static error(error) {
    ReduxModuleCombiner.ngRedux.dispatch( ReduxModuleUtil.errorFactory(ForRealCardsActions.ENTER_GAME_FAIL, error) );
  }
}
