import {Injectable} from "@angular/core";

import {forRealCardsReducer} from "./for-real-cards.reducer";
import {ForRealCardsActions} from "./for-real-cards-actions.class";
import {ReduxModule} from "../../../../common-app/src/ui/redux/redux-module.class";
import { NgReduxRouter, routerReducer } from '@angular-redux/router';
import {IAppState} from "../../../../common-app/src/ui/redux/state.interface";
import {IPayloadAction} from "../../../../common-app/src/ui/redux/action.interface";

@Injectable()
export class ForRealCardsModule extends ReduxModule<IAppState, IPayloadAction>  {
  reducers=[
    {name:'forRealCardsReducer', reducer:forRealCardsReducer},
    {name:'pageViewWatcher', reducer:routerReducer},
  ];
  action = ForRealCardsActions;
  constructor(
    private ngReduxRouter: NgReduxRouter
  ) {
    super();

  }

  initialize():void {
    this.ngReduxRouter.initialize()
  }
}