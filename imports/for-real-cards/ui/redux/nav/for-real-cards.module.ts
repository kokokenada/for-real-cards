import {Injectable} from "@angular/core";

import { Extensions } from 'redux-gtm';
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
import {GamePlayActionType, GamePlayActionInterface} from "../../../api/models/action.model";
import {ConnectActions} from "../../../../common-app/src/ui/redux/connect/connect-actions.class";
import {UploaderActions} from "../../../../common-app/src/ui/redux/uploader/uploader-actions.class";

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
          eventAction: GamePlayActionType[payload.gamePlayAction.actionType]
        })
      }
    };

    let eventGenerator = (gameActionString:string, gameActionType:number) =>{
      return (prevState, reduxAction)=>{
        let payload:IGamePlayActionPayload = reduxAction.payload;
        if (payload.gamePlayActions.some( (event:GamePlayActionInterface)=>{
          return event.actionType===gameActionType;
        } )) {
          return EventHelpers.createGAevent({
            eventCategory: 'GAME_PLAY',
            eventAction: gameActionString
          })
        }
      }
    };
    // Build an array for every game action
    let gameActionEvents = [];
    for (let property in GamePlayActionType) {
      if (
        GamePlayActionType.hasOwnProperty(property) &&  // not in prototype
        /^\d+$/.test(property)                          // A number (TypeScript enums contain both number and name properties)
      ) {
        let i = Number(property);
        gameActionEvents.push(
          {
            eventFields: eventGenerator(GamePlayActionType[i], i),
            eventSchema: {eventCategory: value => value === 'GAME_PLAY' }
          }
        );
      }
    }
    eventDefinitions[GamePlayActions.GAME_PLAY_ACTIONSSS_PUSH ] = gameActionEvents;

    // Error Logging

    // Discuss.  Better to have an EventHelper error logger? Eliminate double ConnectActions.CONNECT_FAIL
    eventDefinitions[ConnectActions.CONNECT_FAIL] = {
      eventFields: (prevState, action)=> {
        let payload:IGamePlayActionPayload = action.payload;
        return EventHelpers.createGAevent({
          eventCategory: 'error',
          eventAction: ConnectActions.CONNECT_FAIL
        })
      }
    };

    eventDefinitions[LoginActions.LOGIN_ERROR] = {
      eventFields: (prevState, action)=> {
        let payload:IGamePlayActionPayload = action.payload;
        return EventHelpers.createGAevent({
          eventCategory: 'error',
          eventAction: LoginActions.LOGIN_ERROR
        })
      }
    };

    eventDefinitions[UploaderActions.UPLOAD_FAIL] = {
      eventFields: (prevState, action)=> {
        let payload:IGamePlayActionPayload = action.payload;
        return EventHelpers.createGAevent({
          eventCategory: 'error',
          eventAction: UploaderActions.UPLOAD_FAIL
        })
      }
    };

    eventDefinitions[ForRealCardsActions.ENTER_GAME_FAIL] = {
      eventFields: (prevState, action)=> {
        let payload:IGamePlayActionPayload = action.payload;
        return EventHelpers.createGAevent({
          eventCategory: 'error',
          eventAction: ForRealCardsActions.ENTER_GAME_FAIL
        })
      }
    };

    eventDefinitions[GamePlayActions.GAME_PLAY_ERROR] = {
      eventFields: (prevState, action)=> {
        let payload:IGamePlayActionPayload = action.payload;
        return EventHelpers.createGAevent({
          eventCategory: 'error',
          eventAction: GamePlayActions.GAME_PLAY_ERROR
        })
      }
    };



    const logger = Extensions.logger();
    const analyticsMiddleware = createMiddleware(eventDefinitions, { logger });

    this.middlewares.push(
      this.async.gameNavigationMiddleware,
      analyticsMiddleware
    );

  }

  initialize():void {
    this.ngReduxRouter.initialize()
  }
}