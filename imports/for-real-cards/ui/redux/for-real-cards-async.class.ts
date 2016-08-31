import { Injectable } from '@angular/core';

import { Action } from  'redux';

import { Observable } from 'rxjs/Observable';
import { Store } from "redux";
import { ActionsObservable } from 'redux-observable';
import { IAppState, IPayloadAction, LoginActions, NeverObservableAction } from '../../../common-app';
import {IForRealCardsState} from "./for-real-cards.types";

@Injectable()
export class ForRealCardsAsync {
  constructor(private loginActions: LoginActions) {
  }

  loginNavigation = (action$: Observable<IPayloadAction>, store: Store<IForRealCardsState>):Observable<Action> => {

    return action$
      .filter(
        ({type}) => type === LoginActions.LOGGED_IN
      )
      .flatMap(({payload}) => {
        let appState:IForRealCardsState = store.getState();
        debugger
        //appState.topFrame.navigateToEnter();  // TODO: figure out navigation with redux. This should probably emit a navigation action
        return new NeverObservableAction();
      });
  }
}
