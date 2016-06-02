/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code licensed under GPL 3.0
 */

import { Component, Input } from '@angular/core';

import { RunGame } from "../run-game/run-game";
import { Action } from '../api'
import { PlayingCard } from "../playing-card/playing-card"
import {ActionFormatted} from "../api/models/action.model";

@Component({
  selector: 'game-action-list',
  directives: [PlayingCard],
  template: `
<form role="form" class="form-horizontal">
  <div class="panel-heading">
    <h3 class="panel-title">Game Action List (debugger)</h3>
  </div>
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
      </template>
    </tbody>
  </table>
</form>
`})
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