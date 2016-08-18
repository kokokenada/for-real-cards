/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Subscription } from 'rxjs'
import {UserEventType, UserEvent, IAppState} from "common-app";
//import {UserEventType, UserEvent, BaseApp, ConnectModule} from "../../common-app/api";
import {RunGame} from "../run-game/run-game";
import {Action, ActionType} from "../api/models/action.model";
//import {NgRedux} from "../../common-app/node_modules/ng2-redux/lib/components/ng-redux";

export abstract class TopFrame { //extends BaseApp {

//  constructor(private ngRedux: NgRedux<IAppState>, private connectModule:ConnectModule) {
//    super([connectModule], ngRedux);
//  }

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
  
  watchUserEvents():void {
    this.subscriptions.push(UserEvent.startObserving((event:UserEvent)=> {
      if (event.eventType === UserEventType.LOGOUT) {
        this.navigateToStart();
      } else if (event.eventType === UserEventType.LOGIN) {
        console.log('UserEventType.LOGIN detected')
        this.navigateToEnter();
      }
    }));
  }

  watchGame() {
    this.subscriptions.push(RunGame.subscribe((action:Action)=> {
      switch (action.actionType) {
        case ActionType.NEW_GAME: {
          console.log("Ionic nav NEW_GAME")
          this.navigateToGamePlayer();
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

  protected abstract navigateToStart():void;
  protected abstract navigateToEnter():void;
  protected abstract navigateToGameTable(gameId:string=''):void;
  protected abstract navigateToGamePlayer(gameId:string=''):void;

}