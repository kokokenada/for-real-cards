/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import {Injectable} from "@angular/core";

import { IAppState, ReduxModule} from '../../../../common-app';
import {forRealCardsReducer} from "./for-real-cards.reducer";
import {ForRealCardsActions} from "./for-real-cards-actions.class";
import {ForRealCardsAsync} from "./for-real-cards-async.class";

@Injectable()
export class ForRealCardsModule extends ReduxModule<IAppState>  {
  reducer=forRealCardsReducer;

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