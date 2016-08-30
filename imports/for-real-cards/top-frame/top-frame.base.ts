/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Subscription } from 'rxjs'
import { IAppState, BaseApp, ConnectModule, LoginModule} from "../../common-app";
import {RunGame} from "../run-game/run-game";
import { Action } from "redux";
import {Action as OLDAction, ActionType} from "../api/models/action.model";
import {NgRedux} from "ng2-redux";
import {ForRealCardsModule} from "../ui";
import {LoginActions} from "../../common-app";

export abstract class TopFrame extends BaseApp<IAppState> {

  topFrameConfigure(connectModule:ConnectModule, loginModule:LoginModule, forRealCardsModule:ForRealCardsModule, ngRedux: NgRedux<IAppState>) {


    const navigatorMiddleware = store => next => (action:Action) => {
      switch (action.type)  {
        case LoginActions.LOGGED_IN:
          this.navigateToEnter();
          break;
      }
      let result = next(action)
      return result
    };

    forRealCardsModule.middlewares.push(navigatorMiddleware);
    this.configure([connectModule, loginModule, forRealCardsModule], ngRedux);

    forRealCardsModule.actions.setTopFrame(this);
    loginModule.actions.checkAutoLogin();
  }

  protected subscriptions:Subscription[] = [];
  
  protected cleanSubScriptions():void {
    if (this.subscriptions) {
      this.subscriptions.forEach((subscription:Subscription)=>{
        subscription.unsubscribe();
      })
    }
  }

  ngOnDestroy() {
    this.cleanSubScriptions();
  }


  watchGame() {
    this.subscriptions.push(RunGame.subscribe((action:OLDAction)=> {
      switch (action.actionType) {
        case ActionType.NEW_GAME: {
          console.log("Ionic nav NEW_GAME")
          this.navigateToGamePlayer('');
          break;
        }
        case ActionType.ENTER_GAME_FAIL: {
          this.navigateToEnter();
          break;
        }
        case ActionType.ENTER_GAME_AT_HAND_NOTIFY:{
          console.log("Ionic nav ENTER_GAME_AT_HAND_NOTIFY")
          this.navigateToGamePlayer(action.gameId);
          break;
        }
        case ActionType.ENTER_GAME_AT_TABLE_NOTIFY: {
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