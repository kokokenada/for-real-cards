import {Injectable} from "@angular/core";

import {forRealCardsReducer} from "./for-real-cards.reducer";
import {ForRealCardsActions} from "./for-real-cards-actions.class";
import { ReduxPackage, IAppState, IPayloadAction} from 'redux-package';
import { NgReduxRouter, routerReducer } from '@angular-redux/router';

@Injectable()
export class ForRealCardsModule extends ReduxPackage<IAppState, IPayloadAction>  {
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