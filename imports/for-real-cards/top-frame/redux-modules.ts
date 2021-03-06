import { Injectable } from '@angular/core';
import 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import { NgRedux } from "@angular-redux/store";
import { createMiddleware, EventDefinitionsMap, Extensions } from "redux-beacon";
import { logger } from 'redux-beacon/extensions/logger';
import { offlineWeb } from 'redux-beacon/extensions/offline-web';
import { GoogleTagManager } from 'redux-beacon/targets/google-tag-manager';
import { IAppState, ReduxPackageCombiner, ICombinerOptions } from 'redux-package';
import {
  PageView, Event, Exception
} from 'redux-beacon/targets/google-analytics';

import {NgReduxRouter, UPDATE_LOCATION} from '@angular-redux/router';
import {
  GameStartPackage,
  GameStartActions,
  GamePlayPackage,
  GamePlayActionType,
  GamePlayActionInterface,
  IGamePlayActionPayload,
  GamePlayActions
} from "../../for-real-cards-lib";
import {
  CONNECT_PACKAGE_NAME,
  ConnectActions,
  ConnectPackage,
  FeatureToggleActions,
  FeatureTogglePackage,
  IConnectService,
  ILoginService,
  IUploaderService,
  IUsersService,
  LoginActions,
  LoginPackage,
  UploaderActions,
  UploaderPackage,
  uploaderCollections,
  UsersPackage
} from 'common-app';

import {
  AccountsAdminModule,
  ModalModule
} from '../../common-app/src/ui';
import {featureToggleConfigs, FEATURE_TOGGLE_USE_FIREBASE} from "./feature-toggle.config";

import {PlatformTools} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";
import {ConnectServiceMeteor} from '../../common-app-meteor/connect-service-meteor';
import {LoginServiceMeteor} from '../../common-app-meteor/login-service-meteor';
import {GamePlayStartMeteor} from '../../for-real-cards-meteor/game-start-service';
import {GamePlayServiceMeteor} from '../../for-real-cards-meteor/game-play-service';

import { firebaseConfig } from '../../../env';

import * as firebase from 'firebase';
import {ConnectServiceFirebase} from '../../common-app-firebase/connect-service-firebase';
import {LoginServiceFirebase} from '../../common-app-firebase/login-service-firebase';
import {IGameStartService} from '../../for-real-cards-lib/redux-packages/game-start/game-start-service-interface';
import {GamePlayStartFirebase} from '../../for-real-cards-firebase/game-start-service';
import {GamePlayServiceFirebase} from '../../for-real-cards-firebase/game-play-service';
import {IGamePlayService} from '../../for-real-cards-lib/redux-packages/game-play/game-play-service-interface';
import {UsersServiceFirebase} from '../../common-app-firebase/users.service';
import {UsersServiceMeteor} from '../../common-app-meteor/users.service';
import {UploaderServiceMeteor} from '../../common-app-meteor/uploader-service';
import {AvatarOriginalStore} from '../../common-app-meteor/avatar.model';
import {UploaderServiceFirebase} from '../../common-app-firebase-web';
import {AvatarModel} from '../../common-app-firebase/avatar.model';
import {StaticResources} from '../../for-real-cards-lib';

declare const cordova: any;

@Injectable()
export class ReduxModules {
  constructor(
    private ngReduxRouter: NgReduxRouter,
    private accountsAdminModule: AccountsAdminModule,
    private ngRedux: NgRedux<IAppState>
  ) {}
  configure(middleware) {

    let connectService: IConnectService;
    let loginService: ILoginService;
    let usersService: IUsersService;
    let uploaderService: IUploaderService;
    let startGameService: IGameStartService;
    let gamePlayServiceMeteor: IGamePlayService;

    if (featureToggleConfigs[FEATURE_TOGGLE_USE_FIREBASE].setting) {
      const firebaseApp = firebase.initializeApp(firebaseConfig);
      connectService = new ConnectServiceFirebase(firebaseApp);
      loginService = new LoginServiceFirebase(firebaseApp);
      usersService = new UsersServiceFirebase(firebaseApp);
      startGameService = new GamePlayStartFirebase(firebaseApp);
      gamePlayServiceMeteor = new GamePlayServiceFirebase(firebaseApp);
      uploaderService = new UploaderServiceFirebase(firebaseApp);

      uploaderCollections['avatar'] = {name: 'avatar', reference: 'avatar'};
      let avatar = new AvatarModel(firebaseApp);
      middleware.push(avatar.watchForAvatarUploadMiddleWare);

      let staticResources = new StaticResources(Meteor.absoluteUrl); // until dev environment moves

    } else {
      connectService = new ConnectServiceMeteor();
      loginService = new LoginServiceMeteor();
      usersService = new UsersServiceMeteor();
      startGameService = new GamePlayStartMeteor();
      gamePlayServiceMeteor = new GamePlayServiceMeteor();
      uploaderService = new UploaderServiceMeteor();

      uploaderCollections['avatar'] = {name: 'avatar', reference: AvatarOriginalStore};

      let staticResources = new StaticResources(Meteor.absoluteUrl);
    }
    const gameStartPackage = new GameStartPackage(startGameService);
    const gamePlayPackage = new GamePlayPackage(gamePlayServiceMeteor);
    const connectModule = new ConnectPackage(connectService);
    const loginModule = new LoginPackage(loginService);
    const featureTogglePackage = new FeatureTogglePackage();
    const uploaderPackage = new UploaderPackage(uploaderService);

    middleware.push(getAnalyticsMiddleware());
    let options : ICombinerOptions = {
      consoleLogging: featureToggleConfigs['redux-console-logging'].setting,
      otherMiddlewares: middleware
    };

    ReduxPackageCombiner.configure([
      connectModule,
      loginModule,
      new ModalModule(),
      this.accountsAdminModule,
      featureTogglePackage,
      gameStartPackage,
      gamePlayPackage,
      uploaderPackage,
      new UsersPackage(usersService)],
      this.ngRedux,
      options
    );
    FeatureToggleActions.initialize(featureToggleConfigs);
  }
}

function getAnalyticsMiddleware() {
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

  eventDefinitions[GameStartActions.ENTER_GAME_FAIL] = {
    eventFields: (action): Exception => {
      let payload:IGamePlayActionPayload = action.payload;
      return {
        hitType: 'exception',
        exDescription: GameStartActions.ENTER_GAME_FAIL
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
      console.log(state[CONNECT_PACKAGE_NAME].get('connected'))
      return state[CONNECT_PACKAGE_NAME].get('connected')
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
  return analyticsMiddleware;
}