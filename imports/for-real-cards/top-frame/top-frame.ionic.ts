/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component, NgZone, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, MenuController, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs'
import { DragulaService} from 'ng2-dragula/ng2-dragula';

import { Start } from '../start/start';
import { UserEvent, UserEventType } from "../../common-app/api/models/user-event.class";
import { AccountTools } from "../../common-app/api/services/account-tools";
import { RunGame } from "../run-game/run-game";
import { Action, ActionType } from "../api/models/action.model";
import { TopFrame } from "./top-frame.base";
import { GameActionList } from "../debug-tools/game-action-list";
import { EditUserProfile } from "../edit-user-profile/edit-user-profile";
import { EnterGame } from "../enter-game/enter-game";
import { RunGameTabs } from "../run-game/run-game-tabs.ionic";
import { MenuItem } from "../../common-app/api/services/menu-item";
import { Menus } from "../../common-app/api/services/menus";
import { MenuFilterPipe } from "../../common-app/ui-ng2/menu-filter/menu-filter";
import { RunGameTableContainer } from "../run-game/run-game-table-container";
import { PlatformToolsIonic } from "../../common-app/ui-ionic/index";

@Component({
  template: `
<!-- logged out menu -->
<ion-menu id="topFrameMenu" [content]="myNav">

  <ion-toolbar>
    <ion-title>For Real Cards</ion-title>
  </ion-toolbar>

  <ion-content class="outer-content">

    <ion-list>
      <button ion-item menuClose *ngFor="let menu of (menuItems() | menuFilter)" (click)="openPage(menu)">
        {{menu.title}}
      </button>
    </ion-list>
  </ion-content>

</ion-menu>

<ion-nav  #myNav [root]="rootPage" swipe-back-enabled="true"></ion-nav>
`,
  viewProviders: [DragulaService],
  pipes: [MenuFilterPipe]
})
class ForRealCardsTopFrame extends TopFrame {
  private subscriptions:Subscription[] = [];
  private displayName:string;
  @ViewChild('myNav') nav: NavController;

  rootPage: any;
  constructor( platform: Platform, private menu: MenuController, private ngZone:NgZone) { //, private navParams:NavParams) {
    super();

    Menus.addMenu({id: 'topbar'});

    Menus.addSubMenuItem('topbar', {
      id: 'admin.game-debug',
      title: 'Game Action List',
      roles: ['admin'],
      callback: ()=>{
        this.nav.push(GameActionList);
      }
    });

    Menus.addSubMenuItem('topbar', {
      id: 'launch-pad',
      title: 'Start or Join Game',
      callback: ()=>{
        this.navigateToEnter();
      }
    });


    Menus.addSubMenuItem('topbar', {
      id: 'edit-user-profile',
      title: 'Profile',
      callback: ()=>{
        this.nav.push(EditUserProfile);
      }
    });


    Menus.addSubMenuItem('topbar', {
      id: 'logout',
      title: 'Logout',
      roles: ['*'],
      callback: (menuItem:MenuItem)=> {
        UserEvent.pushEvent(new UserEvent(UserEventType.LOG_OUT_REQUEST));
      }
    });

    this.rootPage = Start;
  }

  ngAfterViewInit() { // Defer until after the view initializad and all components available
    this.watchingGame();
    this.watchingUserEvents();
    this.menu.enable(true, 'topFrameMenu');
    PlatformToolsIonic.initializeWithRouter(this.nav);
  }
  
  ngOnDestroy() {
    this.cleanSubScriptions();
  }

  menuItems():MenuItem[] {
    return Menus.getMenuFromId('topbar').items;
  }

  openPage(menuItem:MenuItem) {
    menuItem.selected();
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
          console.log('UserEventType.LOGIN detected')
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
          case ActionType.NEW_GAME: {
            console.log("Ionic nav NEW_GAME")
            this.nav.setRoot(RunGameTabs);
            break;
          }
          case ActionType.ENTER_GAME_FAIL: {
            this.navigateToEnter();
            break;
          }
          case ActionType.ENTER_GAME_AT_HAND_NOTIFY:{
            console.log("Ionic nav ENTER_GAME_AT_HAND_NOTIFY")
            this.nav.setRoot(RunGameTabs);
            break;
          }
          case ActionType.ENTER_GAME_AT_TABLE_NOTIFY: {
            this.nav.setRoot(RunGameTableContainer);
            break;
          }
        }
      });
    }));
  }

  navigateToStart() {
    this.nav.setRoot(Start);
  }

  navigateToEnter() {
    this.nav.setRoot(EnterGame);
  }

}

export function run(): void {
  ionicBootstrap(ForRealCardsTopFrame, [
  ]);
}

declare let cordova:any;
export function prepare():void {

  if (typeof cordova==='undefined') {
    console.log("cordova not defined.  We must be running ionic similation in browser. Calling run() in 500ms");
    Meteor.setTimeout(run, 500);
  } else {
    console.log('cordova detected')
    console.log(cordova);
  }
}