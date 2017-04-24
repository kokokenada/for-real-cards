import { Injectable } from '@angular/core';
import { NgRedux } from "@angular-redux/store";
import { createMiddleware, EventDefinitionsMap, Extensions } from "redux-beacon";
import { logger } from 'redux-beacon/extensions/logger';
import { offlineWeb } from 'redux-beacon/extensions/offline-web';
import { GoogleTagManager } from 'redux-beacon/targets/google-tag-manager';
import {
  PageView, Event, Exception
} from 'redux-beacon/targets/google-analytics';

import { UPDATE_LOCATION } from '@angular-redux/router';

import {
  ForRealCardsModule,
  ForRealCardsActions,
  GamePlayModule,
  IGamePlayActionPayload,
  GamePlayActions } from "../ui";
import {
  AccountsAdminModule,
  ConnectActions,
  ConnectModule,
  FeatureToggleModule,
  FeatureToggleActions,
  IAppState,
  LoginActions,
  LoginModule,
  ModalModule,
  ReduxModuleCombiner,
  ToggleRouter,
  UploaderActions,
  UploaderModule,
  UsersModule
} from '../../common-app/src/ui';
import {featureToggleConfigs} from "./feature-toggle.config";
import {GamePlayActionType, GamePlayActionInterface} from "../api/models/action.model";
import {ForRealCardsAsync} from "../ui/redux/nav/for-real-cards-async.class";
import {PlatformTools} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";

declare const cordova: any;

@Injectable()
export class ReduxModules {
  constructor(
    private connectModule: ConnectModule,
    private loginModule: LoginModule,
    private modalModule: ModalModule,
    private accountsAdminModule: AccountsAdminModule,
    private forRealCardsModule: ForRealCardsModule,
    private featureTogglesModule: FeatureToggleModule,
    private featureTogglesActions: FeatureToggleActions,
    private toggleRouter: ToggleRouter,
    private gamePlayModule: GamePlayModule,
    private usersModule: UsersModule,
    private uploaderModule: UploaderModule,
    private ngRedux: NgRedux<IAppState>,
    private async:ForRealCardsAsync,
    private reduxModuleCombiner: ReduxModuleCombiner
  ) {}
  configure() {

    if (featureToggleConfigs['redux-console-logging'].setting) {
      this.reduxModuleCombiner.turnOnConsoleLogging();
    }

    const eventDefinitions:EventDefinitionsMap = {};
    eventDefinitions[LoginActions.LOGGED_IN] = {
      eventFields: (action:IGamePlayActionPayload): Event => (
        {
          hitType:'event',
          eventCategory: 'LOGIN',
          eventAction: 'login',
        }
      )
    };
    eventDefinitions[UPDATE_LOCATION] = {
      eventFields: (action): PageView => (
        {
          hitType: 'pageview',
          page: action.payload
        }
      )
    };
    eventDefinitions[GamePlayActions.GAME_PLAY_ACTION_PUSH ] = {
      eventFields: (action): Event => {
        let payload:IGamePlayActionPayload = action.payload;
        return {
          hitType: 'event',
          eventCategory: 'GAME_PLAY',
          eventAction: GamePlayActionType[payload.gamePlayAction.actionType]
        }
      }
    };

    let eventGenerator = (gameActionString:string, gameActionType:number) =>{
      return (reduxAction): Event => {
        let payload:IGamePlayActionPayload = reduxAction.payload;
        if (payload.gamePlayActions.some( (event:GamePlayActionInterface)=>{ // Is this event the one that fired
            return event.actionType===gameActionType;
          } )) {
          return {
            hitType: 'event',
            eventCategory: 'GAME_PLAY',
            eventAction: gameActionString
          }
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
      eventFields: (action): Exception => {
        let payload:IGamePlayActionPayload = action.payload;
        return {
          hitType: 'exception',
          exDescription: ConnectActions.CONNECT_FAIL
        }
      }
    };

    eventDefinitions[LoginActions.LOGIN_ERROR] = {
      eventFields: (action): Exception => {
        let payload:IGamePlayActionPayload = action.payload;
        return {
          hitType: 'exception',
          exDescription: LoginActions.LOGIN_ERROR
        }
      }
    };

    eventDefinitions[UploaderActions.UPLOAD_FAIL] = {
      eventFields: (action): Exception => {
        let payload:IGamePlayActionPayload = action.payload;
        return {
          hitType: 'exception',
          exDescription: UploaderActions.UPLOAD_FAIL
        }
      }
    };

    eventDefinitions[ForRealCardsActions.ENTER_GAME_FAIL] = {
      eventFields: (action): Exception => {
        let payload:IGamePlayActionPayload = action.payload;
        return {
          hitType: 'exception',
          exDescription: ForRealCardsActions.ENTER_GAME_FAIL
        }
      }
    };

    eventDefinitions[GamePlayActions.GAME_PLAY_ERROR] = {
      eventFields: (action): Exception => {
        let payload:IGamePlayActionPayload = action.payload;
        return {
          hitType: 'exception',
          exDescription: GamePlayActions.GAME_PLAY_ERROR
        }
      }
    };


    let analyticsMiddleware;
    if (featureToggleConfigs['mobile-tracking'].setting && PlatformTools.isCordova()) { // Off line storage of analytics so we can detect connection issues

// Create the offline storage extension.
// It returns true when online, otherwise, returns false
      const isConnected = state => {
        console.log('in isConnected')
        console.log(state)
        console.log(state.connectReducer.get('connected'))
        return state.connectReducer.get('connected')
      };

      const tagManager = cordova.require('com.jareddickson.cordova.tag-manager.TagManager');
      const gtmId = 'GTM-W9LZN4';  // your Google Tag Manager ID for mobile container
      const intervalPeriod = 30;    // seconds

      // Initialize your GTM container
      tagManager.init(null, null, gtmId, intervalPeriod);

      // Create a custom data layer extension
      const customDataLayer = {
        push(event) {
          switch (event.hitType) {
            case 'event':
              tagManager.trackEvent(null, null, event.eventCategory, event.eventAction, event.eventLabel, event.eventValue);
              break;

            case 'pageview':
              tagManager.trackPage(null, null, event.page);
              break;

            default:
              break;
          }
        }
      };
//      extensions.customDataLayer = customDataLayer;
//      extensions.offlineStorage = offlineStorage;
      console.log('done cordova analytics init');
      const offlineStorage = offlineWeb(isConnected);

      if (featureToggleConfigs['analytics-logger'].setting) {
        analyticsMiddleware = createMiddleware(eventDefinitions, GoogleTagManager, {logger, offlineStorage});
      } else  {
        analyticsMiddleware = createMiddleware(eventDefinitions, GoogleTagManager, {offlineStorage});
      }
    } else {
      if (featureToggleConfigs['analytics-logger'].setting) {
        analyticsMiddleware = createMiddleware(eventDefinitions, GoogleTagManager, { logger });
      } else {
        analyticsMiddleware = createMiddleware(eventDefinitions, GoogleTagManager);
      }
    }


    this.forRealCardsModule.middlewares.push(
      this.async.gameNavigationMiddleware,
      analyticsMiddleware
    );

    this.reduxModuleCombiner.configure([
      this.connectModule,
      this.loginModule,
      this.modalModule,
      this.accountsAdminModule,
      this.featureTogglesModule,
      this.forRealCardsModule,
      this.gamePlayModule,
      this.uploaderModule,
      this.usersModule],
      this.ngRedux);
    LoginActions.watchUser(); // for auto login
    this.featureTogglesActions.initialize(featureToggleConfigs);
  }
}