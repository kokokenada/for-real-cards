/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import {NgRedux} from "ng2-redux";

import {ForRealCardsModule, ForRealCardsActions, GamePlayModule, IForRealCardsActionPayload} from "../ui";
import {ReduxModuleCombiner} from "../../common-app/src/ui/redux/redux-module-combiner";
import {LoginModule} from "../../common-app/src/ui/redux/login/login.module";
import {ConnectModule} from "../../common-app/src/ui/redux/connect/connect.module";
import {UsersModule} from "../../common-app/src/ui/redux/users/users.module";
import {IAppState} from "../../common-app/src/ui/redux/state.interface";
import {UploaderModule} from "../../common-app/src/ui/redux/uploader/uploader.module";
import {LoginActions} from "../../common-app/src/ui/redux/login/login-actions.class";
import {IPayloadAction} from "../../common-app/src/ui/redux/action.interface";
import {ModalModule} from "../../common-app/src/ui/redux/modal/modal.module";

export abstract class TopFrame {
  topFrameConfigure(
    connectModule:ConnectModule,
    loginModule:LoginModule,
    modalModule:ModalModule,
    forRealCardsModule:ForRealCardsModule,
    gamePlayModule:GamePlayModule,
    usersModule:UsersModule,
    uploaderModule:UploaderModule,
    ngRedux: NgRedux<IAppState>,
    reduxModuleCombiner:ReduxModuleCombiner
  ) {
    if (Meteor.isDevelopment)
      reduxModuleCombiner.turnOnConsoleLogging();

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
    reduxModuleCombiner.configure([connectModule, loginModule, modalModule, forRealCardsModule, gamePlayModule, uploaderModule, usersModule], ngRedux);
    loginModule.actions.watchUser(); // for auto login
  }

  abstract navigateToStart():void;
  abstract navigateToEnter():void;
  abstract navigateToGameTable(gameId:string):void;
  abstract navigateToGamePlayer(gameId:string):void;

}