/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router'
import { Session } from 'meteor/session';

@Component(
  {
    selector: 'join-game',
    template: `
 
 <div class="panel panel-default">
  <form class="form-horizontal">
    <div class="panel-heading">
      <h3 class="panel-title">Join Game</h3>
    </div>
    <div class="panel-body">
      <div class="form-group">
        <div class="col-xs-1"></div>
        <label class="col-xs-4 control-label" for="game-id">Game Id:</label>
        <div class="col-xs-7">
          <input [(ngModel)]="gameId" type="text" class="form-control" id="game-id">
        </div>
      </div>
      <div class="form-group">
        <div class="col-xs-1"></div>
        <label class="col-xs-4 control-label" for="password">Password (if required):</label>
        <div class="col-xs-7">
          <input [(ngModel)]="password" type="text" class="form-control" id="password">
        </div>
      </div>
      <button type="button" (click)="joinGame()" class="btn btn-success btn-block">
          Join Game
      </button>
      <button type="button" (click)="displayGame()" class="btn btn-default btn-block">
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
  constructor(private router:Router) {
  }
  joinGame() {
    Session.set('password', this.password);
    this.router.navigate(['/game-hand', this.gameId]);
  };
  displayGame() {
    Session.set('password', this.password);
    this.router.navigate(['/game-table', this.gameId]);
  }; 
}