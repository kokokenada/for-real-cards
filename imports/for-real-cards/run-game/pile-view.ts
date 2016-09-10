/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, Injector } from '@angular/core';

import { RunGame } from './run-game.ts';
import { PlayingCard } from "../playing-card/playing-card";
import { CardImageStyle } from "../api/index";

@Component(
  {
    selector: 'pile-view',
    directives: [PlayingCard],
    template: `

<playing-card 
  [hidden]="!numberOfCards()"
  [card]="topCardInPile()" 
  [imgStyle]="imgStyle"
  [attr.data-card-rank]="topCardInPile()?.rank"
  [attr.data-card-suit]="topCardInPile()?.suit"
>
</playing-card>      
<label 
  *ngIf="numberOfCards()" 
  class="card-count" 
  style="position: absolute; 10%; top:0%; left:85%; ">
  {{numberOfCards()}}
</label>
<div *ngIf="numberOfCards()===0"  
  style="position: absolute; height:100%; width:100%; border-width: 1px; border-style: solid;border-color: black ">
</div> 

`
  }
)
export class PileView extends RunGame {
  @Input() imgStyle:CardImageStyle;
  constructor(private injectorInjection: Injector) {
    super(injectorInjection);
  }
  childInit() {}

  numberOfCards():number {
    return this.getCardsInPile() ? this.getCardsInPile().length : 0;
  }
}