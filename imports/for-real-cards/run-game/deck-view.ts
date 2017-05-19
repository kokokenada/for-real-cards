import { Component, Input, NgZone } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import {RunGame} from './run-game';
import {Card, Deck, GamePlayActions} from "../../for-real-cards-lib";
import {CommonPopups} from "../../common-app/src/ui-ng2/common-popups/common-popups";
import {DealModalService} from "../deal-modal/deal-modal.service";

@Component(
  {
    selector: 'deck-view',
    template: `
<!-- The image--> 
<img [hidden]="!numberOfCards()" [src]="URL()"
  [ngStyle]="cardImgStyle(landscape)"
  data-drag-source="DECK"
/>
<!-- CARD COUNT-->
<label [hidden]="!numberOfCards()" 
  class="card-count"
  [ngStyle]="cardCountStyle(landscape)">
  {{numberOfCards()}}
 </label>
<!--FLIP THE DECK BUTTONS-->  
<div 
  [hidden]="numberOfCards()>0"  
  style="position: absolute; height:100%; width:100%; border-width: 1px; border-style: solid;border-color: black ">
  
  <button 
      class="btn btn-block btn-default" 
      style="font-size: x-small; white-space: normal; height: 50%" 
      [hidden]="!cardsInPile(false)" 
      (click)="pileToDeck()">
      Move Pile
  </button>
  <button class="btn btn-block btn-default" 
      style="font-size: x-small; white-space: normal; height: 50%" 
      [hidden]="!cardsInPile(true)" 
      (click)="pileToDeck()">
      Shuffle & Move
  </button>
</div> 
`
  }
)
export class DeckView extends RunGame {
  @Input() landscape:boolean;

  constructor(
    protected dragulaService: DragulaService,
    protected ngZone:NgZone,
    protected dealModelService:DealModalService,
    protected commonPopups:CommonPopups,
  ) {
    super();
  }

  childInit(){};

  URL():string {
    return this.cardBackURL();
  }

  numberOfCards():number {
    return this.getCardsInDeck() ? this.getCardsInDeck().length : 0;
  }
  cardsInPile():number {
    return this.getCardsInPile() ? this.getCardsInPile().length : 0;
  }
  pileToDeck(shuffle:boolean):void{
    if (shuffle) {
      let seed = this.gameState.gameId;
      this.getCardsInPile().forEach( (card:Card)=>{
        seed += card.encode();
      });
      Deck.shuffle(seed, this.getCardsInPile());
    }
    GamePlayActions.pileToDeck(this.gameState, this.getCardsInPile());
  }
}