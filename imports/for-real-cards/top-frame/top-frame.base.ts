import {ForRealCardsModule} from "../ui/redux/nav/for-real-cards.module";
import {IPayloadAction} from "../../common-app/src/ui/redux/action.interface";
import {LoginActions} from "../../common-app/src/ui/redux/login/login-actions.class";
import {ForRealCardsActions} from "../ui/redux/nav/for-real-cards-actions.class";
import {IForRealCardsActionPayload} from "../ui/redux/nav/for-real-cards.types";

export abstract class TopFrame {

  addMiddlware(forRealCardsModule:ForRealCardsModule) {
    // Middleware put here so it can have access to 'this.'.  This is a temporary work around until navigation with redux is done
    const navigatorMiddleware = store => next => (action:IPayloadAction) => {
      switch (action.type)  {
        case LoginActions.LOGGED_IN:
          if (!action.payload.autoLogin)
            this.navigateToEnter();
          break;
        case LoginActions.LOGGED_OUT:
          this.navigateToStart();
          break;
        case ForRealCardsActions.ENTER_GAME_FAIL:
          this.navigateToEnter();
          break;
        case ForRealCardsActions.JOIN_GAME_SUCCESS: {
          let forRealCardsPayload: IForRealCardsActionPayload = action.payload;
          this.navigateToGamePlayer(forRealCardsPayload.gameId);
          break;
        }
        case ForRealCardsActions.VIEW_GAME_SUCCESS: {
          let forRealCardsPayload: IForRealCardsActionPayload = action.payload;
          this.navigateToGameTable(forRealCardsPayload.gameId);
          break;
        }
      }
      return next(action);
    };


    forRealCardsModule.middlewares.push(navigatorMiddleware);

  }
  abstract navigateToStart():void;
  abstract navigateToEnter():void;
  abstract navigateToGameTable(gameId:string):void;
  abstract navigateToGamePlayer(gameId:string):void;

}