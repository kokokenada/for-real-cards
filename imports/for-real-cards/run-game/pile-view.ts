/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, NgZone } from '@angular/core';
import { select } from 'ng2-redux';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { RunGame } from './run-game.ts';
import { PlayingCard } from "../playing-card/playing-card";
import { CardImageStyle } from "../api/index";
import {GamePlayActions} from "../ui/redux/game-play/game-play-actions.class";

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
  @select() gamePlayReducer;

  constructor(
    private gamePlayActions:GamePlayActions,
    private dragulaServiceChild: DragulaService,
    private ngZoneChild:NgZone ) {
    super(gamePlayActions, dragulaServiceChild, ngZoneChild);
  }

  ngOnInit() {
    this.initialize(this.gamePlayReducer);
  }

  numberOfCards():number {
    return this.getCardsInPile() ? this.getCardsInPile().length : 0;
  }
}