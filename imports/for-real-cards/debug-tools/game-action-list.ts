/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input } from '@angular/core';

import { RunGame } from "../run-game/run-game";
import { Action } from '../api/index'
import { PlayingCard } from "../playing-card/playing-card"
import {ActionFormatted} from "../ui/action-formatted.class";
import {PlatformTools} from '/imports/common-app';
import {TopFrameHeader} from "../top-frame/top-frame-header";

function genericTableContent():string {
return `
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
  </template>
</tbody>
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
<form role="form" class="form-horizontal">
  <div class="panel-heading">
    <h3 class="panel-title">Game Action List (debugger)</h3>
  </div>
  <table class="table table-striped">`
  + genericTableContent() + `
  </table>
</form>
`
  }
}

@Component({
  selector: 'game-action-list',
  directives: [PlayingCard, TopFrameHeader],
  template: template()})
export class GameActionList {

  getActions():Action[] {
    return RunGame.getActions(); //this.actionsFormatted;
  }

  actionTime(action:Action):string {
    console.log(action)
    console.log(new ActionFormatted(action).actionTime())
    return new ActionFormatted(action).actionTime();
  }

  actionDescription(action:Action):string {
    return new ActionFormatted(action).actionDescription();
  }

  creator(action:Action):string {
    return new ActionFormatted(action).creator();
  }

  toPlayer(action:Action):string {
    return new ActionFormatted(action).toPlayer();
  }

  fromPlayer(action:Action):string {
    return new ActionFormatted(action).fromPlayer();
  }

  visibilityTypeDescription(action:Action):string {
    return new ActionFormatted(action).visibilityTypeDescription();
  }

}