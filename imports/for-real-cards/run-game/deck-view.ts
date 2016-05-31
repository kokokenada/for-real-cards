/**
 * Created by kenono on 2016-05-13.
 */
import { Component, Input } from '@angular/core';

import {RunGame} from './run-game.ts';
import {Card, Deck} from "../api";
import {CardImageStyle} from "../api/interfaces/card-image-style.interface";

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
  @Input() gameId:string;

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
      let seed = this.gameId;
      this.getCardsInPile().forEach( (card:Card)=>{
        seed += card.encode();
      });
      Deck.shuffle(seed, this.getCardsInPile());
    }
    RunGame.gameStreams.pileToDeck(this.getCardsInPile());
  }
}