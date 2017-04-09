import { Component, Input, NgZone } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { RunGame } from './run-game';
import {CommonPopups} from "../../common-app/src/ui-ng2/common-popups/common-popups";
import {DealModalService} from "../deal-modal/deal-modal.service";

@Component(
  {
    selector: 'pile-show-all-view',
    template: `

      <playing-card *ngFor="let card of getCardsInPile(); let idx=index"
              [card]="card"
              [imgStyle]="cardStyle(idx)"
              [attr.data-card-rank]="card.rank"
              [attr.data-card-suit]="card.suit"
      >
      </playing-card>
    `
  }
)
export class PileViewShowAll extends RunGame {
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

  cardStyle(index:number) {
    let cardWidth = 14.38;
    let numberOfCards = this.getCardsInPile().length;
    let width = numberOfCards * cardWidth;
    let gap: boolean = true;
    if (width>80) {
      width = 80;
      gap = false;
    }
    let blockLeft = 50 - width / 2;
    let left = Math.round( (index * (gap ? cardWidth * 1.1 : cardWidth) + blockLeft)*100)/100;
    return {
      width: String(cardWidth) + '%',
      height: '100%',
      left: String(left) + '%',
      position: 'absolute'
    };
  }
}