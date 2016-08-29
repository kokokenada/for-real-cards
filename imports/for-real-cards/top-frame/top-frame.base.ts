/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Subscription } from 'rxjs'
import {UserEventType, UserEvent, IAppState, BaseApp, ConnectModule} from "../../common-app";
import {RunGame} from "../run-game/run-game";
import {Action, ActionType} from "../api/models/action.model";
import {NgRedux} from "ng2-redux";
import {LoginModule} from "../../common-app";

export abstract class TopFrame extends BaseApp<IAppState> {

  constructor(connectModule:ConnectModule, loginModule:LoginModule, ngRedux: NgRedux<IAppState>) {
    super([connectModule, loginModule], ngRedux);
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

  protected abstract navigateToStart():void;
  protected abstract navigateToEnter():void;
  protected abstract navigateToGameTable(gameId:string):void;
  protected abstract navigateToGamePlayer(gameId:string):void;

}