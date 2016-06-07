/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Meteor } from 'meteor/meteor';
import { Component, NgZone } from '@angular/core';
import { Routes, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router'
import { Subscription } from 'rxjs'
import { DragulaService} from 'ng2-dragula/ng2-dragula';

import { AccountTools, Menus, MenuItem, User, UserEventType, UserEvent} from '../../common-app/api/index';
import { AccountsAdmin } from '../../common-app/ui-twbs-ng2/accounts-admin/accounts-admin';

import { Action, ActionType } from "../api/index";
import { ModalDialog } from "../../common-app/ui-twbs-ng2/modal.component";
import { DealModal } from "../deal-modal/deal-modal";
import { EditUserProfile } from '../edit-user-profile/edit-user-profile';
import { EnterGame } from '../enter-game/enter-game';
import { GameActionList } from '../debug-tools/game-action-list';
import { PopoverMenu } from '../../common-app/ui-twbs-ng2/index';
import { RunGame } from "../run-game/run-game";
import { RunGameTableContainer } from "../run-game/run-game-table-container";
import { RunGameTabs } from "../run-game/run-game-tabs";
import { Start } from "../start/start";

import "../scss/for-real-cards.scss";
import subscription = Roles.subscription;
import {ModalService} from "../../common-app/ui-ng2/modal/modal.service";

@Component(
  {
    selector: 'for-real-cards-top-frame',
    directives: [PopoverMenu, ROUTER_DIRECTIVES, ModalDialog],
    viewProviders: [DragulaService],
    providers: [ModalService],
    template: `
<div class="row">
  <label class="col-xs-5">For Real Cards ({{getUserDisplayName()}})</label>
  <label class="col-xs-5">{{getGameDescription()}}</label>
  
  <popover-menu class="pull-right col-xs-1" [menuId]="'topbar'"></popover-menu>
</div>
<router-outlet></router-outlet>
<modal-dialog></modal-dialog>
      `,
  }
)
@Routes([
  {path: '/start', component: Start},
  {path: '/enter-game', component: EnterGame},
  {path: '/game-hand/:id', component: RunGameTabs},
  {path: '/game-table/:id', component: RunGameTableContainer },
  {path: '/edit-profile', component: EditUserProfile},
  {path: '/frc-deal-modal', component: DealModal},
  {path: '/accounts-admin',  component: AccountsAdmin},
  {path: '/game-action-list',  component: GameActionList}
])
export class ForRealCardsTopFrame {
  private gameDescription:string;
  private displayName:string;
  private subscriptions:Subscription[] = [];
  constructor(private router: Router, private ngZone:NgZone) {

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
      title: 'Game Action List',
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
      callback: (menuItem:MenuItem)=> {
        UserEvent.pushEvent(new UserEvent(UserEventType.LOG_OUT_REQUEST));
      }
    });
  }

  ngOnInit() {
    console.log("On Init of top frame");
    this.router.navigate(['/start']);
    this.watchingGame();
    this.watchingUserEvents();
  }
  
  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach((subscription:Subscription)=>{
        subscription.unsubscribe();
      })
    }
  }
  
  watchingUserEvents() {
    this.subscriptions.push(UserEvent.startObserving((event:UserEvent)=> {
      this.ngZone.run(()=>{
        if (event.eventType === UserEventType.LOGOUT) {
          this.displayName = "Not logged in";
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
      console.log("topframe subscribe")
      console.log(action)
      this.ngZone.run(()=> {
        if (action.actionType === ActionType.DEAL) {
          this.setGameDescription(RunGame.gameState.currentGameConfig.name + " (id " + action.gameId + ")");
        } else if (action.actionType === ActionType.NEW_HAND) {
          this.setGameDescription(RunGame.gameState.currentGameConfig.name + " (id " + action.gameId + ")");
        } else if (action.actionType === ActionType.RESET || action.actionType===ActionType.NEW_GAME) {
          this.setGameDescription("New Game (id " + action.gameId + ")");
        }
      });
    }));
  }

  private navigateToEnter() {
    this.router.navigate(['/enter-game']);
  }
  private navigateToProfile() {
    this.router.navigate(['/edit-profile']);
  }
  private navigateToStart() {
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
  