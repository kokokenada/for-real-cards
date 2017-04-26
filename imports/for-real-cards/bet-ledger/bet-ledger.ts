import { Component, Input, NgZone } from '@angular/core';
import { select } from '@angular-redux/store';

import { GamePlayAction, GamePlayActionType, Hand } from '../api/index'
import { ActionFormatted, IGamePlayState } from "../ui";
import {GamePlayFunctions} from "../ui/redux/game-play/game-play.functions";

@Component({
  selector: 'bet-ledger',
  template: `
    <div [(ngModel)]="displayMode" ngbRadioGroup name="radioBasic">
      <label class="btn btn-primary">
        <input type="radio" value="buyOnly"> Buy Only
      </label>
      <label class="btn btn-primary">
        <input type="radio" value="all"> All
      </label>
    </div>
    <pre>{{displayMode}}</pre>
    <table class="table table-striped">
      <thead>
      <tr>
        <th>Time</th>
        <th>Player</th>
        <th>Event</th>
        <th>Amount</th>
      </tr>
      </thead>
      <tbody>
      <ng-template ngFor let-action [ngForOf]="getActions()">
        <tr>
          <td>{{actionTime(action)}}</td>
          <td>{{actionDescription(action)}}</td>
          <td>{{toPlayer(action)}}</td>
          <td>{{action.moneyAmount}}</td>
        </tr>
      </ng-template>
      </tbody>
    </table>
  `
})
export class BetLedger {
  @select() gamePlayReducer;
  gamePlayState:IGamePlayState;
  private actions:GamePlayAction[] = [];
  public displayMode:string = 'buyOnly';

  constructor(private ngZone:NgZone) {}

  ngOnInit() {
    this.gamePlayReducer.subscribe( (gamePlayState:IGamePlayState)=>{
      this.ngZone.run( ()=>{
        this.gamePlayState = gamePlayState;
      });
    });
  }

  getActions():GamePlayAction[] {
    this.actions.length = 0;
    GamePlayFunctions.forEachActionInCurrentGame(this.gamePlayState, (action: GamePlayAction) => {
      switch(action.actionType) {
        case GamePlayActionType.BUY:
          this.actions.push(action);
          break;
        case GamePlayActionType.DEAL:
        case GamePlayActionType.FOLD:
        case GamePlayActionType.DEAL_STEP:
        case GamePlayActionType.BET:
        case GamePlayActionType.TAKE_MONEY:
          if (this.displayMode!=='buyOnly')
            this.actions.push(action);
          break;
      }
    } );
    return this.actions;
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

}