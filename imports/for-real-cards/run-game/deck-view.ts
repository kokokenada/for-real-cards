/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, NgZone } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import {RunGame} from './run-game.ts';
import {Card, Deck} from "../api/index";
import {CardImageStyle} from "../api/interfaces/card-image-style.interface";
import {GamePlayActions} from "../ui/redux/game-play/game-play-actions.class";
import {CommonPopups} from "../../common-app/src/ui-ng2/common-popups/common-popups";
import {DealModalService} from "../deal-modal/deal-modal.service";

@Component(
  {
    selector: 'deck-view',
    template: `
<!-- The image--> 
<img [hidden]="!numberOfCards()" [src]="URL()"
  [ngStyle]="imgStyle"
  data-drag-source="DECK"
/>
<!-- CARD COUNT-->
<label [hidden]="!numberOfCards()" 
  class="card-count"
  style="position: absolute; top:0; left:85%; ">
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
      (click)="vm.pileToDeck()">
      Shuffle & Move
  </button>
</div> 
`
  }
)
export class DeckView extends RunGame {
  @Input() imgStyle:CardImageStyle;

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