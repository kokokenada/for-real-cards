
import {IPayloadAction} from 'redux-package';
import {LoginActions, LoginPackage} from 'common-app';
import { GameStartActions, IGameStartActionPayload} from "../../for-real-cards-lib";
import {GamePlayActions} from '../../for-real-cards-lib';


export abstract class TopFrame {

    // Middleware put here so it can have access to 'this.'.  This is a temporary work around until navigation with redux is done
    navigatorMiddleware = store => next => (action:IPayloadAction) => {
      switch (action.type)  {
        case LoginActions.LOGGED_IN:
        case LoginActions.CURRENT_USER_UPDATED:
          GamePlayActions.setCurrentUserID(action.payload.user._id);
          if (!action.payload.autoLogin && !(LoginPackage.lastLoginState.loggedIn))
            this.navigateToEnter();
          break;
        case LoginActions.LOGGED_OUT:
          this.navigateToStart();
          break;
        case GameStartActions.ENTER_GAME_FAIL:
          this.navigateToEnter();
          break;
        case GameStartActions.JOIN_GAME_SUCCESS: {
          let forRealCardsPayload: IGameStartActionPayload = action.payload;
          this.navigateToGamePlayer(forRealCardsPayload.gameId);
          break;
        }
        case GameStartActions.VIEW_GAME_SUCCESS: {
          let forRealCardsPayload: IGameStartActionPayload = action.payload;
          this.navigateToGameTable(forRealCardsPayload.gameId);
          break;
        }
      }
      return next(action);
    };

  abstract navigateToStart():void;
  abstract navigateToEnter():void;
  abstract navigateToGameTable(gameId:string):void;
  abstract navigateToGamePlayer(gameId:string):void;

}