/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, provide, NgZone } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { NgRedux } from 'ng2-redux';
import { provideRouter, ROUTER_DIRECTIVES, RouterConfig, Router } from '@angular/router'
import { DragulaService} from 'ng2-dragula/ng2-dragula';

import {
  AccountsAdmin,
  ConnectActions,
  ConnectAsync,
  ConnectModule,
  LoginActions,
  LoginAsync,
  LoginModule,
  IAppState,
  Menus,
  MenuItem,
  ModalDialog,
  ModalService,
  UsersModule,
  UsersActions,
  UsersAsync,
  UploaderModule,
  UploaderActions,
  UploaderAsync,
  PopoverMenu
} from '../../common-app';

import {
  ForRealCardsActions,
  ForRealCardsModule,
  ForRealCardsAsync,
  GamePlayActions,
  GamePlayAsync,
  GamePlayModule
} from '../ui';

import { DealModal } from "../deal-modal/deal-modal.twbs";
import { EditUserProfileTWBS } from '../edit-user-profile/edit-user-profile.twbs';
import { EnterGame } from '../enter-game/enter-game';
import { GameActionList } from '../debug-tools/game-action-list';
import { RunGameTableContainer } from "../run-game/run-game-table-container";
import { RunGameTabs } from "../run-game/run-game-tabs.twbs";
import { Start } from "../start/start";

import "../scss/for-real-cards.scss";
import {TopFrame} from "./top-frame.base";
import {TopFrameHeader} from "./top-frame-header";
import {DealModalService} from "../deal-modal/deal-modal.service";


const routes:RouterConfig = [
  {path: '', component: Start},
  {path: 'start', component: Start},
  {path: 'enter-game', component: EnterGame},
  {path: 'game-hand/:id', component: RunGameTabs},
  {path: 'game-table/:id', component: RunGameTableContainer},
  {path: 'edit-profile', component: EditUserProfileTWBS},
  {path: 'frc-deal-modal', component: DealModal},
  {path: 'accounts-admin',  component: AccountsAdmin},
  {path: 'game-action-list',  component: GameActionList}
];

const appRouterProviders = [
  provideRouter(routes)
];

@Component(
  {
    selector: 'for-real-cards-top-frame',
    directives: [PopoverMenu, ROUTER_DIRECTIVES, ModalDialog, TopFrameHeader],
    viewProviders: [DragulaService],
    providers: [
      ModalService,
      DealModalService,
      ConnectActions,
      ConnectAsync,
      ConnectModule,
      LoginActions,
      LoginAsync,
      LoginModule,
      ForRealCardsActions,
      ForRealCardsModule,
      ForRealCardsAsync,
      GamePlayActions,
      GamePlayAsync,
      GamePlayModule,
      UploaderModule,
      UploaderActions,
      UploaderAsync,
      UsersModule,
      UsersAsync,
      UsersActions
    ],
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
export class ForRealCardsTopFrame extends TopFrame {
  constructor(
    private router: Router,
    private ngZone:NgZone,
    ngRedux:NgRedux<IAppState>,
    connectModule:ConnectModule,
    loginModule:LoginModule,
    forRealCardsModule:ForRealCardsModule,
    gamePlatModule:GamePlayModule,
    usersModule:UsersModule,
    uploaderModule:UploaderModule
  )
  {
    super();
    this.topFrameConfigure(connectModule, loginModule, forRealCardsModule, gamePlatModule, usersModule, uploaderModule, ngRedux);
    Menus.addMenu({id: 'topbar'});

    Menus.addSubMenuItem('topbar', {
      id: 'admin.users',
      title: 'User Admin',
      roles: ['admin'],
      callback: ()=>{
        this.router.navigate(['/accounts-admin']);
      }
    });

    Menus.addSubMenuItem('topbar', {
      id: 'admin.game-debug',
      title: 'Game GamePlayAction List',
      roles: ['admin'],
      callback: ()=>{
        this.router.navigate(['/game-action-list']);
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
        this.navigateToProfile();
      }
    });


    Menus.addSubMenuItem('topbar', {
      id: 'logout',
      title: 'Logout',
      roles: ['*'],
      callback: (menuItem:MenuItem)=> {
        loginModule.actions.logout();
      }
    });
  }

  navigateToEnter() {
    this.ngZone.run( ()=>{
      this.router.navigate(['/enter-game']);
    });
  }

  navigateToProfile() {
    this.ngZone.run( ()=> {
      this.router.navigate(['/edit-profile']);
    });
  }

  navigateToStart() {
    this.ngZone.run( ()=> {
      this.router.navigate(['/start']);
    });
  }

  navigateToGameTable(gameId:string=''):void {
    this.ngZone.run( ()=> {
      this.router.navigate(['/game-table/', gameId]); // gameId parameter in URL for refresh feature (not yet implemented)
    });
  }

  navigateToGamePlayer(gameId:string=''):void {
    this.ngZone.run( ()=> {
      this.router.navigateByUrl('/game-hand/' + gameId);  // gameId parameter in URL for refresh feature (not yet implemented)
    });
  }
}
  
export function run() {
  bootstrap(ForRealCardsTopFrame,
    [
      NgRedux,
      appRouterProviders
//      provide(APP_BASE_HREF, { useValue: '/' }),
//      ROUTER_DIRECTIVES,
//      provide(LocationStrategy,
//        {useClass: HashLocationStrategy})
    ]
  );
}

export function prepare():void {
  
}

