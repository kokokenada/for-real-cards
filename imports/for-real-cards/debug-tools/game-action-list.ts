import { Component, Input, NgZone } from '@angular/core';
import { select } from '@angular-redux/store';

import { GamePlayAction, GamePlayActionType, Hand } from '../api/index'
import { ActionFormatted, ForRealCardsActions, IGamePlayState } from "../ui";
import { AccountTools } from "../../common-app/src/ui/services/account-tools";
import {GamePlayFunctions} from "../ui/redux/game-play/game-play.functions";

@Component({
  selector: 'game-action-list',
  template: `
    <form #displayGameForm="ngForm">
      <div class="form-group">
        <label class="control-label" for="displayType">Include Script</label>
        <div class="btn-group">
          <label class="btn btn-primary" name="displayType" [(ngModel)]="displayMode" btnRadio="noScript">No
            Script</label>
          <label class="btn btn-primary" name="displayType" [(ngModel)]="displayMode" btnRadio="script">Script</label>
        </div>
      </div>
      <div class="form-group form-inline ">
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
      <div class="form-group form-inline">
        <label class="control-label" for="password">Password (if required):</label>
        <input [(ngModel)]="password" name="password" type="text" class="form-control" id="password"
               ngControl="formGameId"
               #formGameId="ngModel"/>
      </div>
      <button class="col "
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
      <ng-template ngFor let-action [ngForOf]="getActions()">
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
            <playing-card *ngFor="let card of action.cards" [card]="card" [imgStyle]="{height: 'auto', width: '100%'}"
                          style="display:inline-block; width:40px"></playing-card>
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
                  <playing-card *ngFor="let card of hand.cardsInHand" [card]="card"
                                [imgStyle]="{height: 'auto', width: '100%'}"
                                style="display:inline-block; width:40px"></playing-card>
                </td>
                <td>
                  <playing-card *ngFor="let card of hand.cardsFaceUp" [card]="card"
                                [imgStyle]="{height: 'auto', width: '100%'}"
                                style="display:inline-block; width:40px"></playing-card>
                </td>
                <td>
                  <playing-card *ngFor="let card of hand.cardsFaceDown" [card]="card"
                                [imgStyle]="{height: 'auto', width: '100%'}"
                                style="display:inline-block; width:40px"></playing-card>
                </td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr *ngIf="action.previousState">
          <td>Previous State Table Face Down:</td>
          <td colspan="5">
            <playing-card *ngFor="let card of action.previousState.tableFaceDown" [card]="card"
                          [imgStyle]="{height: 'auto', width: '100%'}"
                          style="display:inline-block; width:40px"></playing-card>
          </td>
        </tr>
        <tr *ngIf="action.previousState">
          <td>Previous State Table Pile:</td>
          <td colspan="5">
            <playing-card *ngFor="let card of action.previousState.tablePile" [card]="card"
                          [imgStyle]="{height: 'auto', width: '100%'}"
                          style="display:inline-block; width:40px"></playing-card>
          </td>
        </tr>
        <tr *ngIf="displayMode==='script'">
          <td colspan="8">
          <textarea style="width:100%; height: 200px">
          {{testScriptState(action)}}
          </textarea>
          </td>
        <tr *ngIf="displayMode==='script'">
          <td colspan="8">
          <textarea style="width:100%; height: 200px">
          {{testScriptAction(action)}}
          </textarea>
          </td>
        </tr>
      </ng-template>
      <tr>
        <td colspan="8">FINAL STATE</td>
      </tr>
      <tr>
        <td>Pile:</td>
        <td colspan="5">
          <playing-card *ngFor="let card of gamePlayState.tablePile" [card]="card"
                        [imgStyle]="{height: 'auto', width: '100%'}"
                        style="display:inline-block; width:40px"></playing-card>
        </td>
      </tr>
      </tbody>
    </table>
  `
})
export class GameActionList {
  @select() gamePlayReducer;
  public displayMode:string = 'visual';
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


  testScriptAction(action:GamePlayAction):string {
    const replacer = (key, value) => {
      switch (key) {
        case 'actionType': {
          return 'GamePlayActionType.' + GamePlayActionType[value]
        }
        case 'currentGameConfig':
        case 'previousState':
          return undefined;
        default:
          return value;
      }
    };
    const addNewHandIfThere = (action:GamePlayAction) => {
      if (action.actionType === GamePlayActionType.NEW_HAND ) {
        const userId = action.toPlayerId;
        const handIndex = GamePlayFunctions.getHandIndexFromUserId(this.gamePlayState.hands, userId);
        const hand:Hand = this.gamePlayState.hands.get(handIndex);
        const handPruned:Hand = Object.assign({}, hand);
        handPruned.cardsFaceDown = [];
        handPruned.cardsFaceUp = [];
        handPruned.cardsInHand = [];
        return 'newHand: ' + JSON.stringify(handPruned, null, '    ');
      } else {
        return '';
      }
    }
     return `
      action = {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {gamePlayAction:
          ` + JSON.stringify(action, replacer, '    ') + ` 
          ` + addNewHandIfThere(action) + `
        }
      };
`
  }

  testScriptState(action:GamePlayAction):string {
    const replacer = (key, value) => {
      switch (key) {
        case 'actionsXXX':
          return undefined;
        default:
          return value;
      }
    };
    return `
      // State resulting from previous action
      obj = ` + JSON.stringify(action.previousState, replacer, '    ') + `;
`
  }

}