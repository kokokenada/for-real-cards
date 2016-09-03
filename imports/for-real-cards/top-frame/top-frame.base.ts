/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Meteor } from 'meteor/meteor';
import { Subscription } from 'rxjs'
import { IAppState, IPayloadAction, BaseApp, ConnectModule, LoginActions, LoginModule, UploaderModule, UsersModule} from "../../common-app";
import {RunGame} from "../run-game/run-game";
import {GamePlayAction as OLDAction, GamePlayActionType} from "../api/models/action.model";
import {NgRedux} from "ng2-redux";
import {ForRealCardsModule, ForRealCardsActions} from "../ui";

export abstract class TopFrame extends BaseApp<IAppState> {
  private loginModule:LoginModule;
  topFrameConfigure(
    connectModule:ConnectModule,
    loginModule:LoginModule,
    forRealCardsModule:ForRealCardsModule,
    usersModule:UsersModule,
    uploaderModule:UploaderModule,
    ngRedux: NgRedux<IAppState>
  ) {
    this.turnOnConsoleLogging();

    const navigatorMiddleware = store => next => (action:IPayloadAction) => {
      switch (action.type)  {
        case LoginActions.LOGGED_IN:
          this.navigateToEnter();
          break;
        case LoginActions.LOGGED_OUT:
          this.navigateToStart();
          break;
        case ForRealCardsActions.NAV_TO_ENTER:
          this.navigateToEnter();
          break;
        case ForRealCardsActions.NAV_TO_START:
          this.navigateToStart();
          break;
        case ForRealCardsActions.NAV_TO_HAND:
          this.navigateToGamePlayer(action.payload.gameId);
          break;
        case ForRealCardsActions.NAV_TO_TABLE:
          this.navigateToGameTable(action.payload.gameId);
          break;
      }
      return next(action);
    };

    forRealCardsModule.middlewares.push(navigatorMiddleware);
    this.configure([connectModule, loginModule, forRealCardsModule, uploaderModule, usersModule], ngRedux);
    this.loginModule = loginModule;

  }

  protected subscriptions:Subscription[] = [];
  
  protected cleanSubScriptions():void {
    if (this.subscriptions) {
      this.subscriptions.forEach((subscription:Subscription)=>{
        subscription.unsubscribe();
      })
    }
  }

  ngOnInit() {
    console.log('ngOnInit of TopFrame ' + new Date())
    this.loginModule.actions.watchUser();
/*    Meteor.setTimeout(()=>{
     console.log("ngOnInitTimer " + + new Date())
      this.loginModule.actions.checkAutoLogin();
     }, 500);*/
  }

  ngOnDestroy() {
    this.cleanSubScriptions();
  }


  watchGame() {
    this.subscriptions.push(RunGame.subscribe((action:OLDAction)=> {
      switch (action.actionType) {
        case GamePlayActionType.NEW_GAME: {
          console.log("Ionic nav NEW_GAME")
          this.navigateToGamePlayer('');
          break;
        }
        case GamePlayActionType.ENTER_GAME_FAIL: {
          this.navigateToEnter();
          break;
        }
        case GamePlayActionType.ENTER_GAME_AT_HAND_NOTIFY:{
          console.log("Ionic nav ENTER_GAME_AT_HAND_NOTIFY")
          this.navigateToGamePlayer(action.gameId);
          break;
        }
        case GamePlayActionType.ENTER_GAME_AT_TABLE_NOTIFY: {
          this.navigateToGameTable(action.gameId);
          break;
        }
      }
    }));
  }

  abstract navigateToStart():void;
  abstract navigateToEnter():void;
  abstract navigateToGameTable(gameId:string):void;
  abstract navigateToGamePlayer(gameId:string):void;

}