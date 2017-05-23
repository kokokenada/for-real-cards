import 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import {Component, OnInit, ModuleWithProviders, NgZone} from '@angular/core';
import {Routes, RouterModule, Router} from '@angular/router';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DragulaService} from 'ng2-dragula/ng2-dragula';
import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { NgReduxRouter } from "@angular-redux/router"
import {DragulaModule} from 'ng2-dragula/ng2-dragula';

import {AccountsAdmin} from "../../common-app/src/ui-twbs-ng2/accounts-admin/accounts-admin";
import {CommonAppNgTWBS} from "../../common-app/src/ui-twbs-ng2/common-app-ng-twbs.module";
import {COMMON_APP_SINGLETONS} from "../../common-app/src/ui-ng2/common-app-ng.module";

import {
  LoginActions,
  Menus,
  MenuItem, ILoginState, LOGIN_PACKAGE_NAME, LoginPackage
} from 'common-app';


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
import {EditGameConfig} from "../edit-game-config/edit-game-config";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PileViewShowAll} from '../run-game/pile-show-all-view';
import {BetlModalService} from '../bet-modal/bet-modal.service';
import {BetModal} from '../bet-modal/bet-modal';
import {BetLedger} from '../bet-ledger/bet-ledger';
import {AppInfo} from './app-info';
import {GameStartActions} from '../../for-real-cards-lib';
import {ReduxPackageCombiner} from 'redux-package';

const appRoutes: Routes = [
  {path: '', component: Start},
  {path: 'start', component: Start},
  {path: 'enter-game', component: EnterGame},
  {path: 'game-hand/:id', component: RunGameTabs},
  {path: 'game-table/:id', component: RunGameTableContainer},
  {path: 'edit-profile', component: EditUserProfileTWBS},
  {path: 'frc-deal-modal', component: DealModal},
  {path: 'accounts-admin', component: AccountsAdmin},
  {path: 'edit-game-config', component: EditGameConfig},
  {path: 'bet-ledger', component: BetLedger},
  {path: 'game-action-list', component: GameActionList},
  {path: 'app-info', component: AppInfo}
];

//const appRouterProviders:any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@Component(
  {
    selector: 'for-real-cards-top-frame',
    viewProviders: [DragulaService],
    template: `
<div class="container row">
  <top-frame-header class="col-10"></top-frame-header>
  <popover-menu class="col-1" [menuItems]="menuItems"></popover-menu>
</div>
<router-outlet></router-outlet>
<modal-dialog></modal-dialog>
      `,
  }
)
export class ForRealCardsTopFrame extends TopFrame implements OnInit {
  menuItems:MenuItem[];
  constructor(private router: Router,
              private ngZone: NgZone,
              private reduxModules:ReduxModules
              ) {
    super();
    reduxModules.configure([this.navigatorMiddleware]);
    this.initMenus();
  }

  private initMenus() {
    let menu = new Menus();
    menu.addMenu({id: 'topbar'});

    menu.addSubMenuItem('topbar', {
      id: 'admin.users',
      title: 'User Admin',
      roles: ['admin'],
      callback: ()=> {
        this.router.navigate(['/accounts-admin']);
      }
    });

    menu.addSubMenuItem('topbar', {
      id: 'admin.edit-game-config',
      title: 'Edit Game Config',
      roles: ['admin'],
      callback: ()=> {
        this.router.navigate(['/edit-game-config']);
      }
    });

    menu.addSubMenuItem('topbar', {
      id: 'admin.game-debug',
      title: 'Debug Actions',
//      roles: ['admin'],
      callback: ()=> {
        this.router.navigate(['/game-action-list']);
      }
    });

    menu.addSubMenuItem('topbar', {
      id: 'launch-pad',
      title: 'Start or Join Game',
      callback: ()=> {
        this.navigateToEnter();
      }
    });


    menu.addSubMenuItem('topbar', {
      id: 'edit-user-profile',
      title: 'Profile',
      callback: ()=> {
        this.navigateToProfile();
      }
    });

    menu.addSubMenuItem('topbar', {
      id: 'bet-ledger',
      title: 'Bet Ledger',
      roles: ['*'],
      callback: (menuItem: MenuItem)=> {
        this.router.navigate(['/bet-ledger']);
      }
    });

    menu.addSubMenuItem('topbar', {
      id: 'info',
      title: 'App Info',
      roles: ['*'],
      callback: (menuItem: MenuItem)=> {
        this.router.navigate(['/app-info']);
      }
    });


    menu.addSubMenuItem('topbar', {
      id: 'logout',
      title: 'Logout',
      roles: ['*'],
      callback: (menuItem: MenuItem)=> {
        LoginActions.logout();
      }
    });

    this.menuItems = menu.getMenu('topbar').items;
  }

  ngOnInit() {
      // Check for deep link
      let pathname:string[] = window.location.pathname.split('/');
      if (pathname.length>=3) {
        let subUrl:string = pathname[1];
        let gameId:string = pathname[2];
        if (subUrl === 'game-hand' || subUrl ==='game-table') {
          if (LoginPackage.lastLoginState.loggedIn)
            GameStartActions.loadGameRequest(gameId, '');
          else {
            const subscription = ReduxPackageCombiner.select(LOGIN_PACKAGE_NAME).subscribe( (loginState: ILoginState) => {
              if (loginState.loggedIn) {
                GameStartActions.loadGameRequest(gameId, '');
                subscription.unsubscribe();
              }
            } );
          }
        }
      }
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
  imports: [BrowserModule, CoreModule, CommonAppNgTWBS, DragulaModule, routing, NgbModule.forRoot()],
  declarations: [
    AppInfo,
    BetLedger,
    BetModal,
    DealModal,
    DeckView,
    EditUserProfileTWBS,
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
  entryComponents: [BetModal],
  bootstrap: [ForRealCardsTopFrame],
  providers: [
    ReduxModules,
    BetlModalService,
    DealModalService,
    NgReduxRouter,
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

