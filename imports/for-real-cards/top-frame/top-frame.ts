import { Component } from '@angular/core';
import { Routes, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router'


import { Session } from 'meteor/session';
import {Subscription} from 'rxjs'

import { Menus, MenuItem, AccountTools, UserEventType, UserEvent} from '../../common-app/api';

import {PopoverMenu} from '../../common-app/ui-twbs-ng2';
import {EditUserProfile} from '../edit-user-profile/edit-user-profile';
import {RunGameTabs} from "../run-game/run-game-tabs";
import {RunGameTableContainer} from "../run-game/run-game-table-container"; 
//import {AccountsAdmin} from '../../common-app/ui-twbs_ng15/accounts-admin/accounts-admin'; (AccountsAdmin)
import {EnterGame} from '../enter-game/enter-game';
//import {GameActionList} from './game-action-list'; (GameActionList)
import "../scss/for-real-cards.scss";
import {Start} from "../start/start";
import {Action, ActionType} from "../api/models/action.model";
import {RunGame} from "../run-game/run-game";
import {DealModal} from "../deal-modal/deal-modal";

@Component(
  {
    selector: 'for-real-cards-top-frame',
    directives: [PopoverMenu, ROUTER_DIRECTIVES],
    template: `
<div class="row">
  <label class="col-xs-5">For Real Cards ({{getUserDisplayName()}})</label>
  <label class="col-xs-5">{{getGameDescription()}}</label>
  
  <popover-menu class="pull-right col-xs-1" [menuId]="'topbar'"></popover-menu>
</div>
<router-outlet></router-outlet>
      `,
  }
)
@Routes([
  {path: '/start', component: Start},
  {path: '/enter-game', component: EnterGame},
  {path: '/game-hand/:id', component: RunGameTabs},
  {path: '/game-table/:id', component: RunGameTableContainer },
  {path: '/edit-profile', component: EditUserProfile},
  {path: '/frc-deal-modal', component: DealModal}
  /*,
  {path: '/accounts-admin',  component: 'accountsAdmin'},
  {path: '/game-action-list',  component: 'gameActionList'}*/
])
export class ForRealCardsTopFrame {
  private gameDescription:string;
  private displayName:string;
  disposable:Subscription;
  constructor(private router: Router) {

    Menus.addMenu({id: 'topbar'});

    Menus.addSubMenuItem('topbar', {
      id: 'admin.users',
      state: 'admin.users',
      title: 'User Admin',
      roles: ['admin'],
      callback: ()=>{
        this.router.navigate(['AccountsAdmin']);
      }
    });

    Menus.addSubMenuItem('topbar', {
      id: 'admin.game-debug',
      title: 'Game Action List',
      roles: ['admin'],
      callback: ()=>{
        this.router.navigate(['GameActionList']);
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
      callback: (menuItem:MenuItem)=> {
        AccountTools.pushEvent(new UserEvent(UserEventType.LOG_OUT_REQUEST));
      }
    });
  }

  ngOnInit() {
    console.log("On Init")
    this.router.navigate(['/start']);
    this.disposable = AccountTools.startObserving((event:UserEvent)=> {
        if (event.eventType === UserEventType.LOGOUT) {
          this.navigateToStart();
        } else if (event.eventType === UserEventType.LOGIN) {
            this.navigateToEnter();
        } else if (event.eventType===UserEventType.DISPLAY_NAME_UPDATE) {
          this.displayName = event.displayName;
        }
      }
    );
  }
  ngOnDestroy() {
    console.log("On Destroy")
    if (this.disposable) {
      this.disposable.unsubscribe();
    }
  }


  // Hmm when can this be called
  startWatchingGame() {
    RunGame.gameStreams.subscribe((action:Action)=> {
      if (action.actionType === ActionType.DEAL) {
        this.setGameDescription(RunGame.gameStreams.currentGameConfig.name + " (id " + action.gameId + ")");
      } else if (action.actionType === ActionType.NEW_HAND) {
        this.setGameDescription(RunGame.gameStreams.currentGameConfig.name + " (id " + action.gameId + ")");
      } else if (action.actionType === ActionType.RESET) {
        this.setGameDescription("New Game (id " + action.gameId + ")");
      }
    });
  }

  navigateToHand(gameId:string, userPassword:string) {
    Session.set('password', userPassword);
    this.router.navigate(['/game-hand', {gameId: gameId}]);
  }
  navigateToTable(gameId:string, userPassword:string) {
    Session.set('password', userPassword);
    this.router.navigate(['/game-table', {gameId: gameId}]);
  }
  navigateToEnter() {
    this.router.navigate(['/enter-game']);
  }
  navigateToProfile() {
    this.router.navigate(['/edit-profile']);
  }
  navigateToStart() {
    this.router.navigate(['/start']);
  }


  getUserDisplayName():string  {
    return this.displayName;
  }

  getGameDescription():string {
    return this.gameDescription;
  }
  private setGameDescription(newDescription:string):void {
    this.gameDescription = newDescription;
  }
}
  