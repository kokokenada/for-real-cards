/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, NgZone } from '@angular/core';
import { select } from 'ng2-redux';

import { GamePlayAction, Hand } from '../api/index'
import { ActionFormatted, ForRealCardsActions, IGamePlayState } from "../ui";
import {PlatformTools} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";
import {AccountTools} from "../../common-app/src/ui/services/account-tools";

function genericTableContent():string {
return `
<form class="form-inline" #displayGameForm="ngForm">
  <div class="form-group">
    <label class="control-label" for="gameId">Game Id:</label>
    <input 
      [(ngModel)]="gameId"
      name="gameId"
      type="text" 
      class="form-control" 
      id="gameId"
      ngControl="formGameId" 
      #formGameId="ngModel" 
      required
    />
  </div>
  <div class="form-group">
    <label class="control-label" for="password">Password (if required):</label>
    <input [(ngModel)]="password" name="password" type="text" class="form-control" id="password"/>
  </div>
  <button class="xs-col-4"
    [disabled]="!displayGameForm.form.valid" 
    (click)="displayGame()" 
    class="btn btn-default">
      View
  </button>
</form>
<table class="table table-striped">
  <thead>
    <tr>
      <th>id</th>
      <th>Time</th>      
      <th>Action</th>
      <th>Created By</th>
      <th>To Player</th>
      <th>From Player</th>
      <th>Realted Id</th>
      <th>Visiblity Type</th>
    </tr>    
  </thead>
  <tbody>
    <template ngFor let-action [ngForOf]="getActions()">
      <tr>
        <td>{{action._id}}</td>
        <td>{{actionTime(action)}}</td>
        <td>{{actionDescription(action)}} ({{action.actionType}})</td>
        <td>{{creator(action)}}</td>
        <td>{{toPlayer(action)}}</td>
        <td>{{fromPlayer(action)}}</td>
        <td>{{action.relatedActionId}}</td>
        <td>{{visibilityTypeDescription(action)}}</td>
      </tr>
      <tr [hidden]="action.cards?.length===0">
        <td>Cards:</td>
        <td colspan="5">
          <playing-card *ngFor="let card of action.cards" [card]="card" [imgStyle]="{height: 'auto', width: '100%'}" style="display:inline-block; width:40px"></playing-card>
        </td>
      </tr>
      <tr *ngIf="action.previousState">
        <td>Previous State Hands:</td>
        <td colspan="5">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Player</th>              
                <th>In Hand</th>
                <th>Face Up</th>
                <th>Face Down</th>
              </tr>            
            </thead>
            <tbody>
              <tr *ngFor="let hand of action.previousState.hands">
                <td>{{handPlayer(hand)}}</td>                              
                <td>
                  <playing-card *ngFor="let card of hand.cardsInHand" [card]="card" [imgStyle]="{height: 'auto', width: '100%'}" style="display:inline-block; width:40px"></playing-card>
                </td>
                <td>
                  <playing-card *ngFor="let card of hand.cardsFaceUp" [card]="card" [imgStyle]="{height: 'auto', width: '100%'}" style="display:inline-block; width:40px"></playing-card>
                </td>
                <td>
                  <playing-card *ngFor="let card of hand.cardsFaceDown" [card]="card" [imgStyle]="{height: 'auto', width: '100%'}" style="display:inline-block; width:40px"></playing-card>
                </td>
              </tr>            
            </tbody>
          </table>
        </td>
      </tr>
      <tr *ngIf="action.previousState">
        <td>Previous State Table Face Down:</td>
        <td colspan="5">
          <playing-card *ngFor="let card of action.previousState.tableFaceDown" [card]="card" [imgStyle]="{height: 'auto', width: '100%'}" style="display:inline-block; width:40px"></playing-card>
        </td>             
      </tr>              
      <tr *ngIf="action.previousState">
        <td>Previous State Table Pile:</td>
        <td colspan="5">
          <playing-card *ngFor="let card of action.previousState.tablePile" [card]="card" [imgStyle]="{height: 'auto', width: '100%'}" style="display:inline-block; width:40px"></playing-card>
        </td>             
      </tr>
    </template>
  </tbody>
</table>
`
}

function template():string {
  if (PlatformTools.isIonic()) {
    return `
<ion-header>
  <ion-navbar *navbar>
    <button menuToggle>
       <ion-icon name='menu'></ion-icon>
    </button>
    <ion-title>
      <top-frame-header></top-frame-header>      
    </ion-title>
  </ion-navbar>
</ion-header>

<!--<ion-content>-->
  <ion-list>
    <ion-list-header>
      Game Action List (debugger)
    </ion-list-header>    
    <ion-item>
      <table>`
          + genericTableContent() + `
      </table>
    </ion-item>
  </ion-list>
<!--</ion-content>-->
`
  } else {
    return `
  <div class="panel-heading">
    <h3 class="panel-title">Game Action List (debugger)</h3>
  </div>
`
    + genericTableContent()
  }
}

@Component({
  selector: 'game-action-list',
  template: template()}
)
export class GameActionList {
  @select() gamePlayReducer;
  gamePlayState:IGamePlayState;
  password: string;
  gameId: string;

  constructor(private ngZone:NgZone) {}

  ngOnInit() {
    this.gamePlayReducer.subscribe( (gamePlayState:IGamePlayState)=>{
      this.ngZone.run( ()=>{
        this.gamePlayState = gamePlayState;
      });
    });
  }

  displayGame() {
    ForRealCardsActions.loadGameRequest(this.gameId, this.password);
  }

  getActions():GamePlayAction[] {
    return this.gamePlayState.actions.toArray();
  }

  actionTime(action:GamePlayAction):string {
    return new ActionFormatted(action).actionTime();
  }

  actionDescription(action:GamePlayAction):string {
    return new ActionFormatted(action).actionDescription();
  }

  creator(action:GamePlayAction):string {
    return new ActionFormatted(action).creator();
  }

  toPlayer(action:GamePlayAction):string {
    return new ActionFormatted(action).toPlayer();
  }

  fromPlayer(action:GamePlayAction):string {
    return new ActionFormatted(action).fromPlayer();
  }

  handPlayer(hand:Hand):string {
    return AccountTools.getDisplayName(hand.userId);
  }

  visibilityTypeDescription(action:GamePlayAction):string {
    return new ActionFormatted(action).visibilityTypeDescription();
  }

}