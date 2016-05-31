/**
 * Created by kenono on 2016-05-15.
 */
import { Component, Input } from '@angular/core';

import { RunGame } from "../run-game/run-game";
import { Action, ActionFormatted } from '../api'
import { PlayingCard } from "../playing-card/playing-card"

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
      <template ngFor #action [ngForOf]="getActions()">
        <tr>
          <td>{{action._id}}</td>
          <td>{{format(action).actionTime()}}</td>
          <td>{{format(action).actionDescription()}} ({{action.actionType}})</td>
          <td>{{format(action).creator()}}</td>
          <td>{{format(action).toPlayer()}}</td>
          <td>{{format(action).fromPlayer()}}</td>
          <td>{{action.relatedActionId}}</td>
          <td>{{format(action).visibilityType()}}</td>
        </tr>
        <tr [hidden]="action.cards?.length===0">
          <td>Cards:</td>
          <td colspan="5">
            <playing-card *ngFor="let card of action.cards" card="card" imgStyle="{height: 'auto', width: '100%'}" style="display:inline-block; width:40px"></playing-card>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</form>
`})
export class GameActionList {
  @Input() gameId:string;
  getActions():Action[] {
    console.log(RunGame.getActions())
    return RunGame.getActions();
  }
  format(action:Action):ActionFormatted {
    return new ActionFormatted(action);
  }
}