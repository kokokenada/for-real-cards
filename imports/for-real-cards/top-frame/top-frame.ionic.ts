/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component, NgZone, ViewChild } from '@angular/core';
//import { ionicBootstrap, MenuController, NavController } from 'ionic-angular';
declare let ionicBootstrap, MenuController, NavController; // Shut up compiler until we have another go at Ionic
import { DragulaService} from 'ng2-dragula/ng2-dragula';

import {
  ForRealCardsModule,
  ForRealCardsAsync,
  GamePlayAsync,
  GamePlayModule,
} from '../ui';

import { Start } from '../start/start';
import { TopFrame } from "./top-frame.base";
import { GameActionList } from "../debug-tools/game-action-list";
import { EditUserProfileIonic } from "../edit-user-profile/edit-user-profile.ionic";
import { EnterGame } from "../enter-game/enter-game";
import { RunGameTabs } from "../run-game/run-game-tabs.ionic";
import { RunGameTableContainer } from "../run-game/run-game-table-container";
import {LoginModule} from "../../common-app/src/ui/redux/login/login.module";
import {Menus} from "../../common-app/src/ui/services/menus";
import {MenuItem} from "../../common-app/src/ui/services/menu-item";
import {PlatformToolsIonic} from "../../common-app/src/ui-ionic/platform-tools/platform-tools-ionic";
import {ReduxModules} from "./redux-modules";
import {LoginActions} from "../../common-app/src/ui/redux/login/login-actions.class";


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
  providers: [
    ForRealCardsModule,
    ForRealCardsAsync,
    GamePlayAsync,
    GamePlayModule
  ]
})
class ForRealCardsTopFrame extends TopFrame {
  @ViewChild('myNav') nav: NavController;

  rootPage: any;
  constructor(
    private menu: MenuController,
    private ngZone:NgZone,
    loginModule:LoginModule,
    reduxModules:ReduxModules

) { //, private navParams:NavParams) {
    super();
    reduxModules.configure();

    Menus.addMenu({id: 'topbar'});

    Menus.addSubMenuItem('topbar', {
      id: 'admin.game-debug',
      title: 'Game GamePlayAction List',
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
        this.nav.push(EditUserProfileIonic);
      }
    });


    Menus.addSubMenuItem('topbar', {
      id: 'logout',
      title: 'Logout',
      roles: ['*'],
      callback: (menuItem:MenuItem)=> {
        LoginActions.logout();
      }
    });

    this.rootPage = Start;
  }

  ngAfterViewInit() { // Defer until after the view initializad and all components available
    this.menu.enable(true, 'topFrameMenu');
    PlatformToolsIonic.initializeWithRouter(this.nav);
  }
  
  menuItems():MenuItem[] {
    return Menus.getMenuFromId('topbar').items;
  }

  openPage(menuItem:MenuItem) {
    menuItem.selected();
  }

  navigateToStart():void {
    this.ngZone.run( ()=> {
      this.nav.setRoot(Start);
    });
  }

  navigateToEnter():void {
    this.ngZone.run( ()=> {
      this.nav.setRoot(EnterGame);
    });
  }

  navigateToGamePlayer(gameId:string=''):void {
    this.ngZone.run( ()=> {
      this.nav.setRoot(RunGameTabs);
    });
  }

  navigateToGameTable(gameId:string=''):void {
    this.ngZone.run( ()=> {
      this.nav.setRoot(RunGameTableContainer);
    });
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
    console.log('cordova detected');
    console.log(cordova);
  }
}