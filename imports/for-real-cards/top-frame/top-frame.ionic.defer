import {Component, NgModule, NgZone, ViewChild} from '@angular/core';
import {MenuController, NavController, TabsModule} from 'ionic-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
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
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser';
import {CoreModule} from './core.module';
import {DragulaModule} from 'ng2-dragula';
import {DealModal} from '../deal-modal/deal-modal.ionic';
import {DeckView} from '../run-game/deck-view';
import {EditGameConfig} from '../edit-game-config/edit-game-config';
import {JoinGame} from '../enter-game/join-game';
import {NewGame} from '../enter-game/new-game';
import {PileView} from '../run-game/pile-view';
import {Player} from '../player/player';
import {PlayingCard} from '../playing-card/playing-card';
import {RunGameHand} from '../run-game/run-game-hand';
import {RunGameHandAndTable} from '../run-game/run-game-hand-and-table';
import {RunGameTable} from '../run-game/run-game-table';
import {DealModalService} from '../deal-modal/deal-modal.service';
import {COMMON_APP_SINGLETONS} from '../../common-app/src/ui-ng2/common-app-ng.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonAppNgIonic} from '../../common-app/src/ui-ionic/common-app-ng-ionic.module';
import {PileViewShowAll} from '../run-game/pile-show-all-view';


@Component({
  selector: 'selector: for-real-cards-top-frame',
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
  viewProviders: [DragulaService]
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
// CommonAppNgTWBS, routing, , EditUserProfileTWBS, NgReduxRouter,
@NgModule({
  imports: [
    IonicModule.forRoot(ForRealCardsTopFrame),
    BrowserModule, CoreModule, CommonAppNgIonic, DragulaModule, TabsModule, NgbModule.forRoot()],
  declarations: [
    DealModal,
    DeckView,
    EditGameConfig,
    EnterGame,
    ForRealCardsTopFrame,
    GameActionList,
    JoinGame,
    NewGame,
    PileView,
    PileViewShowAll,
    Player,
    PlayingCard,
    RunGameTableContainer,
    RunGameHand,
    RunGameHandAndTable,
    RunGameTable,
    RunGameTabs,
    Start
  ],
  bootstrap: [IonicApp],
  providers: [
    ReduxModules,
    DealModalService,
    ForRealCardsModule,
    ForRealCardsAsync,
    GamePlayAsync,
    GamePlayModule,
    ...COMMON_APP_SINGLETONS]
})
export class AppModule {
}

export function run(): void {
  const platform = platformBrowserDynamic();

  platform.bootstrapModule(AppModule);

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