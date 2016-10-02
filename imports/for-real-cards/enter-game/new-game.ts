/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import * as log from 'loglevel';
import {Component} from '@angular/core';
import {ForRealCardsActions} from "../ui/redux/nav/for-real-cards-actions.class";
import {PlatformTools, TargetPlatformId} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";

function template():string {
  switch (PlatformTools.getTargetPlatforrm()) {
    case TargetPlatformId.IONIC:
      return `
<ion-list>
  <form>
    <ion-list-header>
      Start New Game
    </ion-list-header>
    <ion-item>
      <ion-label for="password">Password (optional):</ion-label>
      <ion-input class="form-control" [(ngModel)]="password" type="text" id="password"></ion-input>
    </ion-item>
    <ion-item>
      <button large block (click)="newGame()">
        Start Game
      </button>
    </ion-item>
  </form>
</ion-list>
`;
    case TargetPlatformId.TWBS_CORDOVA:
    case TargetPlatformId.TWBS_WEB:
      return `
<div>
  <form>
    <div class="panel-heading">
      <h2 class="panel-title">Start New Game</h2>
    </div>
    <div class="panel-body">
      <div class="form-group">
        <label for="password">Password (optional):</label>
        <input class="form-control" [(ngModel)]="password" name="password" type="text" id="password">
      </div>
      <button type="button" class="btn btn-success btn-block" (click)="newGame()">
        Start Game
      </button>
      </div>
  </form>
</div>
`;
    default:
      log.error('Styling not developed for target platform')
  }
}

@Component(
  {
    selector: 'new-game',
    template: template()
  }
)
export class NewGame {
  password:string;
  newGame() {
    ForRealCardsActions.newGame(this.password);
  }
}

