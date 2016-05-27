/**
 * Created by kenono on 2016-05-13.
 */

import { Component, Input } from '@angular/core';

import {RunGame } from './run-game.ts';
import { PlayingCard } from "../playing-card/playing-card"; {PlayingCard}

@Component(
  {
    selector: 'pile-view',
    template: `

<playing-card 
  ng-show="vm.numberOfCards()"
  card="vm.topCardInPile()" 
  game-id="{{gameId}}"
  img-class="{{imgClass}}"
  data-card-rank="{{topCardInPile().rank}}"
  data-card-suit="{{topCardInPile().suit}}"
>
</playing-card>      
<label [hidden]="!vm.numberOfCards()" class="card-count" style="position: absolute; 10%; top:0%; left:85%; ">{{vm.numberOfCards()}}</label>
<div [hidden]="!vm.numberOfCards()===0"  style="position: absolute; height:100%; width:100%; border-width: 1px; border-style: solid;border-color: black ">
</div> 

`
  }
)
export class PileView extends RunGame {
  @Input() imgClass:string;
  numberOfCards():number {
    return this.getCardsInPile().length;
  }
}