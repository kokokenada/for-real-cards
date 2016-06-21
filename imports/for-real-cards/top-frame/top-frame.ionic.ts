/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component, NgZone, ViewChild } from '@angular/core';
import { ionicBootstrap, App, Platform, MenuController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs'

import { Start } from '../start/start';
import { UserEvent, UserEventType } from "../../common-app/api/models/user-event.class";
import { AccountTools } from "../../common-app/api/services/account-tools";
import { RunGame } from "../run-game/run-game";
import { Action, ActionType } from "../api/models/action.model";
import { TopFrame } from "./top-frame.base";
import {EnterGame} from "../enter-game/enter-game";

@Component({
  template: '<ion-nav  #myNav [root]="rootPage" swipe-back-enabled="true"></ion-nav>'
})
class ForRealCardsTopFrame extends TopFrame {
  private subscriptions:Subscription[] = [];
  private displayName:string;
  @ViewChild('myNav') nav;

  rootPage: any;
  constructor(app: App, platform: Platform, menu: MenuController, private ngZone:NgZone) {
    super();
    this.rootPage = Start;
    this.watchingGame();
    this.watchingUserEvents();
  }

  ngOnDestroy() {
    this.cleanSubScriptions();
  }


  watchingUserEvents() {
    this.subscriptions.push(UserEvent.startObserving((event:UserEvent)=> {
      this.ngZone.run(()=>{
        if (event.eventType === UserEventType.LOGOUT) {
          this.displayName = "Not logged in";
          this.setGameDescription("");
          this.navigateToStart();
        } else if (event.eventType === UserEventType.LOGIN) {
          this.displayName = AccountTools.getDisplayName(Meteor.user());
          this.navigateToEnter();
        } else if (event.eventType===UserEventType.DISPLAY_NAME_UPDATE && event.userId === Meteor.userId()) {
          this.displayName = event.displayName;
        }
      })
    }));
  }

  watchingGame() {
    this.subscriptions.push(RunGame.subscribe((action:Action)=> {
      this.ngZone.run(()=> {
        this.setGameDescriptionFromAction(action);
        switch (action.actionType) {
          case ActionType.ENTER_GAME_FAIL: {
            this.navigateToEnter();
            break;
          }
          case ActionType.ENTER_GAME_AT_HAND_NOTIFY:{
//            this.router.navigate(['/game-hand', action.gameId]);
            break;
          }
          case ActionType.ENTER_GAME_AT_TABLE_NOTIFY: {
//            this.router.navigate(['/game-table', action.gameId]);
            break;
          }
        }
      });
    }));
  }

  navigateToStart() {

  }

  navigateToEnter() {
    console.log('ionic nav to enter')
    this.nav.push(EnterGame);
  }

}

@Component({
  template: `
<ion-navbar *navbar>
  <ion-title>Login</ion-title>
</ion-navbar>
<ion-content>Ionic Version!!!!!</ion-content>  
`
})
class ForRealCardsTopFrameIonic {
}


export function run(): void {
  ionicBootstrap(ForRealCardsTopFrame, [
  ]);
}