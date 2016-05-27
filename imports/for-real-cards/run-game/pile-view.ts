/**
 * Created by kenono on 2016-05-13.
 */

import { Component, Input } from '@angular/core';

import { RunGame } from './run-game.ts';
import { PlayingCard } from "../playing-card/playing-card";

@Component(
  {
    selector: 'pile-view',
    directives: [PlayingCard],
    template: `

<playing-card 
  [hidden]="!numberOfCards()"
  [card]="topCardInPile()" 
  [gameId]="gameId"
  [imgClass]="imgClass"
  [attr.data-card-rank]="topCardInPile()?.rank"
  [attr.data-card-suit]="topCardInPile()?.suit"
>
</playing-card>      
<label 
  [hidden]="!numberOfCards()" 
  class="card-count" 
  style="position: absolute; 10%; top:0%; left:85%; ">
  {{numberOfCards()}}
</label>
<div [hidden]="!numberOfCards()===0"  
  style="position: absolute; height:100%; width:100%; border-width: 1px; border-style: solid;border-color: black ">
</div> 

`
  }
)
export class PileView extends RunGame {
  @Input() imgClass:string;
  numberOfCards():number {
    return this.getCardsInPile() ? this.getCardsInPile().length : 0;
  }
}