/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import {Injectable} from "@angular/core";

import {forRealCardsReducer} from "./for-real-cards.reducer";
import {ForRealCardsActions} from "./for-real-cards-actions.class";
import {ForRealCardsAsync} from "./for-real-cards-async.class";
import {ReduxModule} from "../../../../common-app/src/ui/redux/redux-module.class";
import { NgReduxRouter, UPDATE_LOCATION, routerReducer } from 'ng2-redux-router';
import {IAppState} from "../../../../common-app/src/ui/redux/state.interface";
import {IPayloadAction} from "../../../../common-app/src/ui/redux/action.interface";
import { createMiddleware } from "redux-gtm";
import { LoginActions } from "../../../../common-app/src/ui/redux/login/login-actions.class";
import {GamePlayActions} from "../game-play/game-play-actions.class";
import {IGamePlayActionPayload} from "../game-play/game-play.types";
import {GamePlayActionType} from "../../../api/models/action.model";

@Injectable()
export class ForRealCardsModule extends ReduxModule<IAppState, IPayloadAction>  {
  reducers=[
    {name:'forRealCardsReducer', reducer:forRealCardsReducer},
    {name:'pageViewWatcher', reducer:routerReducer},
  ];
  action = ForRealCardsActions;
  constructor(
    private async:ForRealCardsAsync,
    private ngReduxRouter: NgReduxRouter
  ) {
    super();

    const eventDefinitions = {};
    eventDefinitions[LoginActions.LOGGED_IN] = {
      eventName: 'REDUX_EVENT',
      eventFields: (prevState, action:IGamePlayActionPayload)=> ({
        REDUX_hitType: 'event',
        REDUX_eventCategory: 'LOGIN',
        REDUX_eventAction: 'login',
      })
    };
    eventDefinitions[UPDATE_LOCATION] = {
      eventName: 'REDUX_EVENT',
      eventFields: (prevState, action)=> ({
        REDUX_hitType: 'pageview',
        REDUX_page: action.payload + "!!!"
      })};
    eventDefinitions[GamePlayActions.GAME_PLAY_ACTION_PUSH ] = {
      eventName: 'REDUX_EVENT',
      eventFields: (prevState, action:IGamePlayActionPayload)=> ({
        REDUX_hitType: 'event',
        REDUX_eventCategory: 'GAME_PLAY',
        REDUX_eventAction: action.gamePlayAction ? GamePlayActionType[action.gamePlayAction.actionType] : "multiple"
      })
    };

    const analyticsMiddleware = createMiddleware(eventDefinitions);

    this.middlewares.push(
      this.async.gameNavigationMiddleware,
      analyticsMiddleware
    );

  }

  initialize():void {
    this.ngReduxRouter.initialize()
  }
}