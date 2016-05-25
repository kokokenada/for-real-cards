import { Component } from '@angular/core';
import { Session } from 'meteor/session';
import { Menus, MenuItem, AccountTools, UserEventType, UserEvent} from '../../common-app/api';
import {Subscription} from 'rxjs'
import {PopoverMenu} from '../../common-app/ui-twbs-ng2'; (PopoverMenu)
import {EditUserProfile} from '../edit-user-profile/edit-user-profile'; (EditUserProfile)
import {RunGameTabs} from "../run-game/run-game-tabs"; (RunGameTabs)
import {RunGameTableContainer} from "../run-game/run-game-table-container"; {RunGameTableContainer}
//import {AccountsAdmin} from '../../common-app/ui-twbs_ng15/accounts-admin/accounts-admin'; (AccountsAdmin)
import {EnterGame} from '../enter-game/enter-game'; (EnterGame)
//import {GameActionList} from './game-action-list'; (GameActionList)
import "../scss/fastcards.scss";

@Component(
  {
    selector: 'for-real-cards-top-frame',
    template: `
<div class="row">
  <label class="col-xs-5">For Real Cards ({{vm.getUserDisplayName()}})</label>
  <label class="col-xs-5">{{vm.getGameDescription()}}</label>
  
  <popover-menu class="pull-right col-xs-1" menu-id="topbar"></popover-menu>
</div>
<ng-outlet></ng-outlet>
      `,
    $routeConfig: [
      {path: '/start/', name: 'Start', component: 'start', useAsDefault: true},
      {path: '/welcome/', name: 'Welcome', component: 'welcome'},
      {path: '/game-hand/', name: 'GameHand', component: 'runGameTabs'},
      {path: '/game-table/', name: 'GameTable', component: 'runGameTableContainer' },
      {path: '/edit-profile/', name: 'EditUserProfile', component: 'editUserProfile'},
      {path: '/accounts-admin/', name: 'AccountsAdmin', component: 'accountsAdmin'},
      {path: '/game-action-list/', name: 'GameActionList', component: 'gameActionList'}
    ],
    controller: ForRealCardsTopFrame,
    controllerAs: 'vm'
  }
)
export class ForRealCardsTopFrame {
  $scope: any;
  private gameDescription:string;
  static $rootRouter: any;
  disposable:Subscription;
  constructor($rootRouter) {

    ForRealCardsTopFrame.$rootRouter = $rootRouter;

    Menus.addMenu({id: 'topbar'});

    Menus.addSubMenuItem('topbar', {
      id: 'admin.users',
      state: 'admin.users',
      title: 'User Admin',
      roles: ['admin'],
      callback: ()=>{
        ForRealCardsTopFrame.$rootRouter.navigate(['AccountsAdmin']);
      }
    });

    Menus.addSubMenuItem('topbar', {
      id: 'admin.game-debug',
      title: 'Game Action List',
      roles: ['admin'],
      callback: ()=>{
        ForRealCardsTopFrame.$rootRouter.navigate(['GameActionList']);
      }
    });

    Menus.addSubMenuItem('topbar', {
      id: 'launch-pad',
      title: 'Start or Join Game',
      callback: ()=>{
        ForRealCardsTopFrame.navigateToWelcome();
      }
    });


    Menus.addSubMenuItem('topbar', {
      id: 'edit-user-profile',
      title: 'Profile',
      callback: ()=>{
        ForRealCardsTopFrame.navigateToProfile();
      }
    });


    Menus.addSubMenuItem('topbar', {
      id: 'logout',
      title: 'Logout',
      callback: (menuItem:MenuItem)=> {
        AccountTools.pushEvent(new UserEvent(UserEventType.LOG_OUT_REQUEST));
      }
    });
  }

  $onInit() {
    this.disposable = AccountTools.startObserving((event:UserEvent)=> {
        if (event.eventType === UserEventType.LOGOUT)
          ForRealCardsTopFrame.navigateToStart();
      }
    );
  }
  $onDestroy() {
    if (this.disposable) {
      this.disposable.unsubscribe();
    }
  }

  static navigateToHand($scope:any, gameId:string, userPassword:string) {
    Session.set('password', userPassword);
    ForRealCardsTopFrame.$rootRouter.navigate(['GameHand', {gameId: gameId}]);
  }
  static navigateToTable($scope:any, gameId:string, userPassword:string) {
    Session.set('password', userPassword);
    ForRealCardsTopFrame.$rootRouter.navigate(['GameTable', {gameId: gameId}]);
  }
  static navigateToWelcome() {
    ForRealCardsTopFrame.$rootRouter.navigate(['Welcome']);
  }
  static navigateToProfile() {
    ForRealCardsTopFrame.$rootRouter.navigate(['EditUserProfile']);
  }
  static navigateToStart() {
    ForRealCardsTopFrame.$rootRouter.navigate(['Start']);
  }


  getUserDisplayName():string  {
    return AccountTools.getDisplayName();
  }

  getGameDescription():string {
    return this.gameDescription;
  }
  setGameDescription(newDescription:string):void {
    this.gameDescription = newDescription;
  }
}
