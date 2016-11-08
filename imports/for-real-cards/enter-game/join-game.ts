import {Component } from '@angular/core';
import {ForRealCardsActions} from "../ui/redux/nav/for-real-cards-actions.class";
import {PlatformTools, TargetPlatformId} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";

function template(): string {
  switch (PlatformTools.getTargetPlatforrm()) {
    case TargetPlatformId.IONIC:
      return `
<ion-list>
  <form>
    <ion-list-header>
      Join Existing Game
    </ion-list-header>
    <ion-item>
        <ion-label>Game Id:</ion-label>
        <ion-input 
          [(ngModel)]="gameId" 
          type="text" 
        ></ion-input>
    </ion-item>
    <ion-item>
      <ion-label>Password (if required):</ion-label>
      <ion-input [(ngModel)]="password" type="text"></ion-input>
    </ion-item>
    <ion-item>
      <button 
        (click)="joinGame()" 
        block large>
          Join Game
      </button>
      <button 
        (click)="displayGame()" 
        block light large>
          Display Game Table
      </button>
    </ion-item>
  </form>
</ion-list>

    `;
    case TargetPlatformId.TWBS_CORDOVA:
    case TargetPlatformId.TWBS_WEB:
      return `
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
        <input [(ngModel)]="password" name="password" type="text" class="form-control" id="password">
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
      `;
    default:
      log.error('Styling not developed for target platform')
  }
}

@Component(
  {
    selector: 'join-game',
    template: template()
  })
export class JoinGame {
  password: string;
  gameId: string;

  joinGame() {
    ForRealCardsActions.joinGameRequest(this.gameId, this.password);
  };

  displayGame() {
    ForRealCardsActions.viewGameRequest(this.gameId, this.password);
  };
}