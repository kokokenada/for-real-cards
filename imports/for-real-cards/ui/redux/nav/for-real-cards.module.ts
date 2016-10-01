/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import {Injectable} from "@angular/core";

import {forRealCardsReducer} from "./for-real-cards.reducer";
import {ForRealCardsActions} from "./for-real-cards-actions.class";
import {ForRealCardsAsync} from "./for-real-cards-async.class";
import {ReduxModule} from "../../../../common-app/src/ui/redux/redux-module.class";
import {IAppState} from "../../../../common-app/src/ui/redux/state.interface";
import {IPayloadAction} from "../../../../common-app/src/ui/redux/action.interface";

@Injectable()
export class ForRealCardsModule extends ReduxModule<IAppState, IPayloadAction>  {
  reducer={name:'forRealCardsReducer', reducer:forRealCardsReducer};

  constructor(
    public actions:ForRealCardsActions,
    private async:ForRealCardsAsync
  ) {
    super();
    this.middlewares.push(
      this.async.gameNavigationMiddleware
    );
  }

  initialize():void {}
}