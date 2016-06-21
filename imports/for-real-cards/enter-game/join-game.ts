/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component, Input } from '@angular/core';
import { Session } from 'meteor/session';
import {RunGame} from "../run-game/run-game";
import {ActionType, Action} from "../api/models/action.model";

@Component(
  {
    selector: 'join-game',
    template: `
 
 <div>
  <form #joinGameForm="ngForm">
    <div class="panel-heading">
      <h2 class="panel-title">Join Existing Game</h2>
    </div>
    <div class="panel-body">
      <div class="form-group">
        <label class="control-label" for="gameId">Game Id:</label>
        <input 
          [(ngModel)]="gameId" 
          type="text" 
          class="form-control" 
          id="gameId"
          ngControl="formGameId" 
          #formGameId="ngForm" 
          required
        />
      </div>
      <div class="form-group">
        <label class="control-label" for="password">Password (if required):</label>
        <input [(ngModel)]="password" type="text" class="form-control" id="password">
      </div>
      <button 
        [disabled]="!joinGameForm.form.valid" 
        (click)="joinGame()" 
        class="btn btn-success btn-block">
          Join Game
      </button>
      <button 
        [disabled]="!joinGameForm.form.valid" 
        (click)="displayGame()" 
        class="btn btn-default btn-block">
          Display Game Table
      </button>
    </div>
  </form>
</div>

    `
})
export class JoinGame{
  password:string;
  gameId:string;
  constructor() {
  }
  joinGame() {
    RunGame.joinGame(this.gameId, this.password);
    RunGame.pushGameNotification(this.gameId, ActionType.ENTER_GAME_AT_HAND_NOTIFY);
  };
  displayGame() {
    Session.set('password', this.password);
    RunGame.pushGameNotification(this.gameId, ActionType.ENTER_GAME_AT_TABLE_NOTIFY);
  };
}