/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Router } from '@angular/router'
import * as log from 'loglevel';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Component } from '@angular/core';
import {RunGame} from "../run-game/run-game";

@Component(
  {
    selector: 'new-game',
    template: `
<div class="panel panel-default">
  <form class="form-horizontal">
    <div class="panel-heading">
      <h3 class="panel-title">New Game</h3>
    </div>
    <div class="panel-body">
      <div class="form-group">
        <div class="col-xs-1"></div>
        <label class="col-xs-4" for="password">Password (optional):</label>
        <div class="col-xs-7">
          <input class="form-control" [(ngModel)]="password" type="text" id="password">
        </div>
      </div>
      <button type="button" class="btn btn-success btn-block" (click)="newGame()">
        Start Game
      </button>
      </div>
  </form>
</div>
`
  }
)
export class NewGame{
  constructor(private router:Router) {
  }
  password: string;
  newGame() {
    Meteor.call('ForRealCardsNewGame', this.password, (error, result)=>{
      if (error) {
        log.error(error);
      } else {
        Session.set('password', this.password);
        this.router.navigateByUrl('/game-hand/' + result).then((navResult)=>{
          RunGame.pushNewGameNotification(result);
        });
      }
    });
  }
}

