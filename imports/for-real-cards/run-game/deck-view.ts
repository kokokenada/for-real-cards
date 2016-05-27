/**
 * Created by kenono on 2016-05-13.
 */
import { Component, Input } from '@angular/core';

import {RunGame} from './run-game.ts';
import {Card, Deck} from "../api";

@Component(
  {
    selector: 'deckView',
    controller: DeckView,
    controllerAs: 'vm',
    template: `
<!-- The image--> 
<img ng-show="vm.numberOfCards()" src="{{vm.URL()}}"
  class="{{vm.imgClass}}"
  data-drag-source="DECK"
/>
<!-- CARD COUNT-->
<label ng-show="vm.numberOfCards()" 
  class="card-count"
  style="position: absolute; top:0%; left:85%; ">{{vm.numberOfCards()}}</label>
<!--FLIP THE DECK BUTTONS-->  
<div ng-show="vm.numberOfCards()===0"  style="position: absolute; height:100%; width:100%; border-width: 1px; border-style: solid;border-color: black ">
  <button class="btn btn-block btn-default" style="font-size: x-small; white-space: normal; height: 50%" ng-show="vm.cardsInPile(false)" ng-click="vm.pileToDeck()">Move Pile</button>
  <button class="btn btn-block btn-default" style="font-size: x-small; white-space: normal; height: 50%" ng-show="vm.cardsInPile(true)" ng-click="vm.pileToDeck()">Shuffle & Move</button>
</div> 
`
  }
)
export class DeckView extends RunGame {
  @Input() imgClass:string;

  URL():string {
    return this.cardBackURL();
  }

  numberOfCards():number {
    return this.getCardsInDeck().length;
  }
  cardsInPile():number {
    return this.getCardsInPile().length;
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