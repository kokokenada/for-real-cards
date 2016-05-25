/**
 * Created by kenono on 2016-05-13.
 */

import { Component, Input } from '@angular/core';

import {RunGame } from './run-game.ts';
import { PlayingCard } from "../playing-card/playing-card"; {PlayingCard}

@Component(
  {
    module: 'fastcards',
    selector: 'pileView',
    controller: PileView,
    controllerAs: 'vm',
    template: `

<playing-card 
  ng-show="vm.numberOfCards()"
  card="vm.topCardInPile()" 
  game-id="{{vm.gameId}}"
  img-class="{{vm.imgClass}}"
  data-card-rank="{{vm.topCardInPile().rank}}"
  data-card-suit="{{vm.topCardInPile().suit}}"
>
</playing-card>      
<label ng-show="vm.numberOfCards()" class="card-count" style="position: absolute; 10%; top:0%; left:85%; ">{{vm.numberOfCards()}}</label>
<div ng-show="vm.numberOfCards()===0"  style="position: absolute; height:100%; width:100%; border-width: 1px; border-style: solid;border-color: black ">
</div> 


`
  }
)
export class PileView extends RunGame {
  @Input() imgClass:string;
  constructor($log, $scope) {
    super($log, $scope);
  }
  numberOfCards():number {
    return this.getCardsInPile().length;
  }
}