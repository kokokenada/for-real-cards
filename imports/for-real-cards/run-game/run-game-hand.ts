import { Component, Input } from '@angular/core';

import {CommonPopups} from "../../common-app/ui-twbs-ng2";
import {Tools} from "../../common-app/api";

import {RunGame} from './run-game.ts';
import {DealModal} from "../deal-modal/deal-modal"
import {PlayingCard} from "../playing-card/playing-card";
import {GameConfig, CardLocation, CardCountAllowed} from "../api";
import {DeckView} from "./deck-view";
import {PileView} from "./pile-view";
import {Action, ActionFormatted} from "../api/models/action.model";

import {Card} from "../api/models/card.model";
import {Hand} from "../api/models/hand.model";

@Component(
  {
    selector: 'run-game-hand',
    directives: [DeckView, PileView, PlayingCard],
    template: `
  <div>
    <button class="btn btn-primary" (click)="deal()">Deal</button>
    <button [hidden]="!canShowHand()" class="btn btn-primary" (click)="showHand()">Show Hand</button>
    <button [hidden]="!shouldShowTakeTrick()" class="btn btn-primary" (click)="takeTrick()">Take Trick</button>
    <button [hidden]="!shouldShowSort()" class="btn btn-primary" (click)="sort()">Sort Hand</button>
    <button [hidden]="!shouldShowUndo()" class="btn btn-default pull-right" (click)="undo()">Undo</button>
  </div>
  <div [hidden]="!shouldShowTableProxy()" 
        style="height:15vh" 
        class="row"
      >
      <!--transform:rotate(90deg) translate(-2.6vh, 0) !important;-->
    <style>
      .playing-card-landscape {
        transform-not:rotate(90deg) scale(0.5, 3.5) !important;
    
        height:100% !important;
        width:100% !important;
      }
    </style>
    <!-- DECK -->
    <deck-view 
      [hidden]="!shouldShowDeck()" 
      class="drag-and-drop-container col-xs-{{numberOfColumns()}}"
      style="height:15vh;"  
      data-drag-source="DECK"
      data-drop-target="DECK"
      [imgClass]="playing-card-landscape"
      [gameId]="gameId"
      >
    </deck-view>
    <!-- PILE -->
    <pile-view 
      [hidden]="!shouldShowPile()" 
      class="drag-and-drop-container col-xs-{{numberOfColumns()}}"
      style="height:15vh;"
      [imgClass]="playing-card-landscape"
      [card]="topCardInPile()" 
      [gameId]="gameId"
      [attr.data-card-rank]="topCardInPile()?.rank"
      [attr.data-card-suit]="topCardInPile()?.suit"
      data-drag-source="PILE"
      data-drop-target="PILE"
    >
    </pile-view>      
    <!-- TABLE DROP -->
    <div [hidden]="!shouldShowTableDrop()" 
          data-drop-target="TABLE"
          style="height:15vh;"
          class="well drag-and-drop-container col-xs-{{numberOfColumns()}}" style="text-align: center">
          Drag here to place card on table
    </div>

  </div>


  <!-- HAND -->
  <div class="drag-and-drop-container" 
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
.playing-card-hand {
  width: 71px !important; height: 100px !important; 
}
    </style>
      <playing-card 
          
        *ngFor="let card of getCardsInHand()"
        [imgClass]="playing-card-hand"
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

  private showTableProxyBool():boolean {
    return Tools.stringToBool(this.showTableProxy);
  }

  shouldShowTableProxy():boolean {
    return this.showTableProxyBool() && (this.shouldShowDeck() || this.shouldShowPile() || this.shouldShowTableDrop());
  }

  shouldShowTakeTrick():boolean {
      if (RunGame.gameStreams)
      return RunGame.gameStreams.currentGameConfig && RunGame.gameStreams.currentGameConfig.hasTricks && RunGame.gameStreams.trickReady();
  }
  
  numberOfColumns():string {
    let numberOfBoxes = 
      (this.shouldShowDeck() ? 1 : 0) +
      (this.shouldShowPile() ? 1 : 0) +
      (this.shouldShowTableDrop() ? 1 : 0);
    return (numberOfBoxes===0 ? "4" : (12/numberOfBoxes).toString());
  }
  
  takeTrick():void {
    RunGame.gameStreams.takeTrick();
  }
  
  shouldShowSort():boolean {
    return (
      RunGame.gameStreams &&
      RunGame.gameStreams.currentGameConfig &&
      RunGame.gameStreams.currentGameConfig.findCommand(CardLocation.HAND, CardLocation.HAND).cardCountAllowed!==CardCountAllowed.NONE
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
    RunGame.gameStreams.sortHand(cardOrder);
  }

  deal() {
    let defaultGameConfig:GameConfig;
    if (RunGame.gameStreams)
      defaultGameConfig = RunGame.gameStreams.currentGameConfig;
    DealModal.openWithDefaults(defaultGameConfig).subscribe(
      (result:GameConfig)=> {
        if (result) {
          RunGame.gameStreams.deal(result);
        }
      },
      (error)=>{
        CommonPopups.alert(error);
      }
    );
  }

  shouldShowUndo():boolean {
    return RunGame.gameStreams && RunGame.gameStreams.actionToUndo();
  }
  
  undo():void {
    
    let action:ActionFormatted  = new ActionFormatted( RunGame.gameStreams.actionToUndo() );

    let prompt:string = "Undo " + action.actionDescription() + " done by "
      + (action.action.creatorId === Meteor.userId() ? "yourself" : action.creator());
    CommonPopups.confirm(prompt).subscribe((result:boolean)=> {
      if (result) {
        RunGame.gameStreams.undo(action.action._id);
      }
    })
  }
}

