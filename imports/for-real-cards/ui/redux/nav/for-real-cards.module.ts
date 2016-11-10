import {Injectable} from "@angular/core";

import {forRealCardsReducer} from "./for-real-cards.reducer";
import {ForRealCardsActions} from "./for-real-cards-actions.class";
import {ForRealCardsAsync} from "./for-real-cards-async.class";
import {ReduxModule} from "../../../../common-app/src/ui/redux/redux-module.class";
import { NgReduxRouter, UPDATE_LOCATION, routerReducer } from 'ng2-redux-router';
import {IAppState} from "../../../../common-app/src/ui/redux/state.interface";
import {IPayloadAction} from "../../../../common-app/src/ui/redux/action.interface";
import { createMiddleware, EventDefinitionsMap, EventHelpers } from "redux-gtm";
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

    const eventDefinitions:EventDefinitionsMap = {};
    eventDefinitions[LoginActions.LOGGED_IN] = {
      eventFields: (prevState, action:IGamePlayActionPayload)=> (
        EventHelpers.createGAevent({
          eventCategory: 'LOGIN',
          eventAction: 'login',
        })
      )
    };
    eventDefinitions[UPDATE_LOCATION] = {
      eventFields: (prevState, action)=> (
        EventHelpers.createGApageview(action.payload)
      )
    };
    eventDefinitions[GamePlayActions.GAME_PLAY_ACTION_PUSH ] = {
      eventFields: (prevState, action)=> {
        let payload:IGamePlayActionPayload = action.payload;
        return EventHelpers.createGAevent({
          eventCategory: 'GAME_PLAY',
          eventAction: payload.gamePlayAction ? GamePlayActionType[payload.gamePlayAction.actionType] : "multiple"
        })
      }
    };
    eventDefinitions[GamePlayActions.GAME_PLAY_ACTIONSSS_PUSH ] = {
      eventFields: (prevState, action)=> {
        let payload:IGamePlayActionPayload = action.payload;
        return EventHelpers.createGAevent({
          eventCategory: 'GAME_PLAY',
          eventAction: payload.gamePlayAction ? GamePlayActionType[payload.gamePlayAction.actionType] : "multiple"
        })
      }
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