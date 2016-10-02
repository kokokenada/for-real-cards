/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import {Component, Injector, OnInit, NgModuleRef, ModuleWithProviders, NgZone} from '@angular/core';
import {Routes, RouterModule, Router} from '@angular/router';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DragulaService} from 'ng2-dragula/ng2-dragula';
import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import {TabsModule} from 'ng2-bootstrap/ng2-bootstrap';

import {AccountsAdmin} from "../../common-app/src/ui-twbs-ng2/accounts-admin/accounts-admin";
import {CommonAppNgTWBS} from "../../common-app/src/ui-twbs-ng2/common-app-ng-twbs.module";
import {LoginModule} from "../../common-app/src/ui/redux/login/login.module";
import {Menus} from "../../common-app/src/ui/services/menus";
import {MenuItem} from "../../common-app/src/ui/services/menu-item";
import {COMMON_APP_SINGLETONS} from "../../common-app/src/ui-ng2/common-app-ng.module";

import {
  ForRealCardsActions,
  ForRealCardsModule,
  ForRealCardsAsync,
  GamePlayActions,
  GamePlayAsync,
  GamePlayModule
} from '../ui';

import {DealModal} from "../deal-modal/deal-modal.twbs";
import {EditUserProfileTWBS} from '../edit-user-profile/edit-user-profile.twbs';
import {EnterGame} from '../enter-game/enter-game';
import {GameActionList} from '../debug-tools/game-action-list';
import {RunGameTableContainer} from "../run-game/run-game-table-container";
import {RunGameTabs} from "../run-game/run-game-tabs.twbs";
import {Start} from "../start/start";

import {TopFrame} from "./top-frame.base";
import {DealModalService} from "../deal-modal/deal-modal.service";
import {CoreModule} from "./core.module";
import {PlayingCard} from "../playing-card/playing-card";
import {JoinGame} from "../enter-game/join-game";
import {NewGame} from "../enter-game/new-game";
import {Player} from "../player/player";
import {DeckView} from "../run-game/deck-view";
import {PileView} from "../run-game/pile-view";
import {RunGameTable} from "../run-game/run-game-table";
import {RunGameHand} from "../run-game/run-game-hand";
import {RunGameHandAndTable} from "../run-game/run-game-hand-and-table";
import {ReduxModules} from "./redux-modules";

const appRoutes: Routes = [
  {path: '', component: Start},
  {path: 'start', component: Start},
  {path: 'enter-game', component: EnterGame},
  {path: 'game-hand/:id', component: RunGameTabs},
  {path: 'game-table/:id', component: RunGameTableContainer},
  {path: 'edit-profile', component: EditUserProfileTWBS},
  {path: 'frc-deal-modal', component: DealModal},
  {path: 'accounts-admin', component: AccountsAdmin},
  {path: 'game-action-list', component: GameActionList}
];

//const appRouterProviders:any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@Component(
  {
    selector: 'for-real-cards-top-frame',
    viewProviders: [DragulaService],
    template: `
<div class="row">
  <top-frame-header class="col-xs-10"></top-frame-header>
  <popover-menu class="pull-right col-xs-1" [menuId]="'topbar'"></popover-menu>
</div>
<router-outlet></router-outlet>
<modal-dialog></modal-dialog>
      `,
  }
)
export class ForRealCardsTopFrame extends TopFrame implements OnInit {
  constructor(private router: Router,
              private ngZone: NgZone,
              private reduxModules:ReduxModules,
              forRealCardsModule:ForRealCardsModule,
              private loginModule: LoginModule) {
    super();
    this.addMiddlware(forRealCardsModule)
    reduxModules.configure();
    Menus.addMenu({id: 'topbar'});

    Menus.addSubMenuItem('topbar', {
      id: 'admin.users',
      title: 'User Admin',
      roles: ['admin'],
      callback: ()=> {
        this.router.navigate(['/accounts-admin']);
      }
    });

    Menus.addSubMenuItem('topbar', {
      id: 'admin.game-debug',
      title: 'Debug Actions',
      roles: ['admin'],
      callback: ()=> {
        this.router.navigate(['/game-action-list']);
      }
    });

    Menus.addSubMenuItem('topbar', {
      id: 'launch-pad',
      title: 'Start or Join Game',
      callback: ()=> {
        this.navigateToEnter();
      }
    });


    Menus.addSubMenuItem('topbar', {
      id: 'edit-user-profile',
      title: 'Profile',
      callback: ()=> {
        this.navigateToProfile();
      }
    });


    Menus.addSubMenuItem('topbar', {
      id: 'logout',
      title: 'Logout',
      roles: ['*'],
      callback: (menuItem: MenuItem)=> {
        this.loginModule.actions.logout();
      }
    });

  }

  ngOnInit() {
  }

  navigateToEnter() {
    this.ngZone.run(()=> {
      this.router.navigate(['/enter-game']);
    });
  }

  navigateToProfile() {
    this.ngZone.run(()=> {
      this.router.navigate(['/edit-profile']);
    });
  }

  navigateToStart() {
    this.ngZone.run(()=> {
      this.router.navigate(['/start']);
    });
  }

  navigateToGameTable(gameId: string = ''): void {
    this.ngZone.run(()=> {
      this.router.navigate(['/game-table/', gameId]); // gameId parameter in URL for refresh feature (not yet implemented)
    });
  }

  navigateToGamePlayer(gameId: string = ''): void {
    this.ngZone.run(()=> {
      this.router.navigateByUrl('/game-hand/' + gameId);  // gameId parameter in URL for refresh feature (not yet implemented)
    });
  }
}

@NgModule({
  imports: [BrowserModule, CoreModule, CommonAppNgTWBS, DragulaModule, routing, TabsModule],
  declarations: [
    AccountsAdmin,
    DealModal,
    DeckView,
    EditUserProfileTWBS,
    EnterGame,
    ForRealCardsTopFrame,
    GameActionList,
    JoinGame,
    NewGame,
    PileView,
    Player,
    PlayingCard,
    RunGameTableContainer,
    RunGameHand,
    RunGameHandAndTable,
    RunGameTable,
    RunGameTabs,
    Start
  ],
  bootstrap: [ForRealCardsTopFrame],
  providers: [
    ReduxModules,
    DealModalService,
    ForRealCardsActions,
    ForRealCardsModule,
    ForRealCardsAsync,
    GamePlayActions,
    GamePlayAsync,
    GamePlayModule,
    ...COMMON_APP_SINGLETONS]
})
export class AppModule {
}


export function run() {
  const platform = platformBrowserDynamic();


  platform.bootstrapModule(AppModule);
/*.then(
    (moduleRef:NgModuleRef<any>)=>{
      const reduxModule:ReduxModules = moduleRef.injector.get(ReduxModules);
      reduxModule.configure();
    }
  );
*/
}

export function prepare(): void {

}

