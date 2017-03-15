import { Component, Input, NgZone } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { RunGame } from './run-game';
import { CardImageStyle } from "../api/index";
import {CommonPopups} from "../../common-app/src/ui-ng2/common-popups/common-popups";
import {DealModalService} from "../deal-modal/deal-modal.service";

@Component(
  {
    selector: 'pile-view',
    template: `

<playing-card 
  [hidden]="!numberOfCards()"
  [card]="topCardInPile()" 
  [imgStyle]="cardImgStyle(landscape)"
  [attr.data-card-rank]="topCardInPile()?.rank"
  [attr.data-card-suit]="topCardInPile()?.suit"
>
</playing-card>      
<label 
  *ngIf="numberOfCards()" 
  class="card-count" 
  [ngStyle]="cardCountStyle(landscape)">
  {{numberOfCards()}}
</label>
<div *ngIf="numberOfCards()===0"  
  style="position: absolute; height:100%; width:100%; border-width: 1px; border-style: solid;border-color: black ">
</div> 

`
  }
)
export class PileView extends RunGame {
  @Input() landscape:boolean;
  constructor(
    protected dragulaService: DragulaService,
    protected ngZone:NgZone,
    protected dealModelService:DealModalService,
    protected commonPopups:CommonPopups,
  ) {
    super();
  }
  childInit() {}

  numberOfCards():number {
    return this.getCardsInPile() ? this.getCardsInPile().length : 0;
  }
}