import { Component, Input } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Dragula, DragulaService } from 'ng2-dragula/ng2-dragula';

import { CommonPopups } from "../../common-app/ui-twbs-ng2";
import { Tools } from "../../common-app/api";

import { RunGame } from './run-game.ts';
import { DealModalService, DEAL_MODAL_PROVIDERS } from "../deal-modal/deal-modal.service"
import { PlayingCard } from "../playing-card/playing-card";
import { Action, ActionFormatted, Card, CardImageStyle, GameConfig, CardLocation, CardCountAllowed, Hand} from "../api";
import { DeckView } from "./deck-view";
import { PileView } from "./pile-view";

@Component(
  {
    selector: 'run-game-hand',
    directives: [DeckView, Dragula, PileView, PlayingCard],
    providers: [DEAL_MODAL_PROVIDERS],
    template: `
  <div>
    <button class="btn btn-primary" (click)="deal()">Deal</button>
    <button *ngIf="canShowHand()" class="btn btn-primary" (click)="showHand()">Show Hand</button>
    <button *ngIf="shouldShowTakeTrick()" class="btn btn-primary" (click)="takeTrick()">Take Trick</button>
    <button *ngIf="shouldShowSort()" class="btn btn-primary" (click)="sort()">Sort Hand</button>
    <button *ngIf="shouldShowUndo()" class="btn btn-default pull-right" (click)="undo()">Undo</button>
  </div>
  <div *ngIf="shouldShowTableProxy()" 
        style="height:15vh" 
        class="row"
      >
    <!-- DECK -->
    <deck-view
      *ngIf="shouldShowDeck()" 
      [dragula]="'drag-and-drop'"
      [class]="'col-xs-' + numberOfColumns()"
      style="height:15vh;"  
      data-drag-source="DECK"
      data-drop-target="DECK"
      [imgStyle]="landscapeCardStyle()"
      [gameId]="gameId"
      >
    </deck-view>
    <!-- PILE -->
    <pile-view 
      *ngIf="shouldShowPile()" 
      [dragula]="'drag-and-drop'"
      [class]="'col-xs-' + numberOfColumns()"
      style="height:15vh;"
      [imgStyle]="landscapeCardStyle()"
      [card]="topCardInPile()" 
      [gameId]="gameId"
      [attr.data-card-rank]="topCardInPile()?.rank"
      [attr.data-card-suit]="topCardInPile()?.suit"
      data-drag-source="PILE"
      data-drop-target="PILE"
    >
    </pile-view>      
    <!-- TABLE DROP -->
    <div 
      *ngIf="shouldShowTableDrop()" 
      [dragula]="'drag-and-drop'"      
      data-drop-target="TABLE"
      style="height:15vh;"
      class="well"
      [class]="'col-xs-' + numberOfColumns()" 
      style="text-align: center">
      Drag here to place card on table
    </div>

  </div>


  <!-- HAND -->
  <div 
    [dragula]="'drag-and-drop'" 
    style="padding-left: 20px; padding-right: 20px; overflow-y: scroll" 
    data-drop-target="HAND"
    data-drag-source="HAND"
    >
    <style>
.gu-transit, .gu-mirror {
  opacity: 0.2;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
  filter: alpha(opacity=20);
  display:inline-block ; width: 71px !important; height: 100px!important; padding-left: 1px; padding-right: 1px 
}
    </style>
      <playing-card 
          
        *ngFor="let card of getCardsInHand()"
        [imgStyle]="inHandCardStyle()"
        style="display:inline-block ; width: 71px; height: 100px; padding-left: 1px; padding-right: 1px "
        [card]="card" 
        [gameId]="gameId"
        [attr.data-card-rank]="card.rank"
        [attr.data-card-suit]="card.suit"
        data-drag-source="HAND"
        data-drop-target="HAND">
      </playing-card>
  </div>
  
          `,
//    templateUrl: '/imports/fastcards/ui/run-game-hand/run-game-hand.html',
  }
)
export class RunGameHand extends RunGame {
  @Input() showTableProxy:string;
  @Input() gameId:string;
  undoAction:Action;

  constructor(private dealModelService:DealModalService, private dragulaService: DragulaService ) {
    super(dragulaService);
  }

  private showTableProxyBool():boolean {
    return Tools.stringToBool(this.showTableProxy);
  }

  shouldShowTableProxy():boolean {
//    console.log('shouldShowTableProxy')
//    console.log(this.showTableProxyBool())
//    console.log(this.shouldShowDeck())
//    console.log(this.shouldShowPile())
//    console.log(this.shouldShowTableDrop())
    return this.showTableProxyBool() && (this.shouldShowDeck() || this.shouldShowPile() || this.shouldShowTableDrop());
  }

  shouldShowTakeTrick():boolean {
      return RunGame.gameState && RunGame.gameState.currentGameConfig && RunGame.gameState.currentGameConfig.hasTricks && RunGame.gameState.trickReady();
  }
  
  numberOfColumns():string {
    let numberOfBoxes = 
      (this.shouldShowDeck() ? 1 : 0) +
      (this.shouldShowPile() ? 1 : 0) +
      (this.shouldShowTableDrop() ? 1 : 0);
    return (numberOfBoxes===0 ? "4" : (12/numberOfBoxes).toString());
  }
  
  takeTrick():void {
    RunGame.gameState.takeTrick();
  }
  
  shouldShowSort():boolean {
    return (
      RunGame.gameState &&
      RunGame.gameState.currentGameConfig &&
      RunGame.gameState.currentGameConfig.findCommand(CardLocation.HAND, CardLocation.HAND).cardCountAllowed!==CardCountAllowed.NONE
    );
  }
  
  sort():void {
    let cardOrder:Card[] = [];
    let hand:Hand = this.getHand();
    hand.sortHand();

    for (let i = 0; i < hand.cardsInHand.length; i++) {
      let card = hand.cardsInHand[i];
      cardOrder.push(card);
    }
    RunGame.gameState.sortHand(cardOrder);
  }

  deal() {
    let defaultGameConfig:GameConfig;
    if (RunGame.gameState)
      defaultGameConfig = RunGame.gameState.currentGameConfig;
    this.dealModelService.open(defaultGameConfig).subscribe(
      (result:GameConfig)=> {
        if (result) {
          RunGame.gameState.deal(result);
        }
      },
      (error)=>{
        CommonPopups.alert(error);
      }
    );
  }

  shouldShowUndo():boolean {
    return RunGame.gameState && RunGame.gameState.actionToUndo();
  }
  
  undo():void {
    
    let action:ActionFormatted  = new ActionFormatted( RunGame.gameState.actionToUndo() );

    let prompt:string = "Undo " + action.actionDescription() + " done by "
      + (action.creatorId === Meteor.userId() ? "yourself" : action.creator());
    CommonPopups.confirm(prompt).subscribe((result:boolean)=> {
      if (result) {
        RunGame.gameState.undo(action._id);
      }
    })
  }
  
  inHandCardStyle():CardImageStyle {
    return {
      width: "71px",
      height: "100px"
    }
  } 
}

