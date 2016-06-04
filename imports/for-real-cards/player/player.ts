/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component, Input } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Subscription } from 'rxjs'

import { Avatar } from '../../common-app/ui-twbs-ng2';
import { UserEvent, UserEventType } from "../../common-app/api";
import { Card, Hand, GameRenderingTools } from  '../api';

@Component(
  {
    selector: 'player',
    directives: [Avatar],
    template: `


<div style="position: relative; 
             width:100%; 
             height: 100%;
             display: block;
              overflow-y: hidden;
              overflow-x: hidden;
             border-width: 1px; border-style: outset; border-color: darkblue; background-color: white">
  <!-- NAME -->
  <div style="
            position: absolute;
            width:  100%;
            top: 0;
            height: 1.2em;
            text-align: center; 
            white-space: nowrap;
            background-color:lightgray; color:darkblue; padding: 0; margin: 0">
    {{displayName()}}
  </div>
  <!-- AVATAR -->
  <avatar (click)="clickedAvatar()" [userId]="hand.userId"  shape="rectangle"
      style="     
        position: absolute;
        top: 1.2em;
         display: inline-block;
        height: 60%;
        max-height: 60%;
        width: auto
         "
   >  
    </avatar>
  <!-- CARDS -->
  <div style="position: absolute; display: inline-block; top: 80%; z-index: 100; width: 100%;  " >
    <div 
      *ngFor="let card of getCardsInHand()" 
      style="display: inline-block;
      height:auto;"
      [style.width]="cardWidth() + '%'"
      [attr.data-card-suit]="card?.suit"
      [attr.data-card-rank]="card?.rank"
      >
      <img style="height:auto; width:90%" [src]="getCardBackURL()"/>        
    </div>
  </div>
  <!-- Tricks -->
  <div 
    *ngFor="let trick of getTricks(); let i=index" 
    [ngStyle]="{'position': 'absolute', 'top':0, 'left':getTrickLeft(i), 'width': getTrickWidth() }"
    z-index: 200;
    [attr.data-cards-in-trick]="trick?.length"
    >
    <img style="height:auto; width:100%" [src]="getCardBackURL()"/>        
  </div>

</div>
  <!-- card count -->
  <label [hidden]='!numberOfCards()' 
    class="card-count" 
    style="position: absolute; 10%; top:80%; left:90%; font-size: x-small; z-index: 250;">
    {{numberOfCards()}}
  </label>

          `
  }
)
export class Player {
  @Input() hand:Hand;
  disposable:Subscription;  
  private _displayName:string;

  ngOnInit() {
//    console.log('player on init')
//    console.log(this)
    this.disposable = UserEvent.startObserving((event:UserEvent)=>{
      if (event.eventType===UserEventType.DISPLAY_NAME_UPDATE && event.userId===this.hand.userId) {
        this._displayName = event.displayName;
      }
    });
  }
  ngOnDestroy() {
    if (this.disposable) {
      this.disposable.unsubscribe();
    }
  }

  getCardsInHand():Card[] {
    return this.hand.cardsInHand;
  }

  getCardBackURL():string {
    return GameRenderingTools.getCardBackURL(this.hand.gameId);
  }

  displayName():string {
    return this._displayName;
  }

  cardWidth():string {
    return (100/Math.max(this.getCardsInHand().length,5)).toString();
  }

  getTricks():Card[][] {
    return this.hand.tricks;
  }

  private getTrickWidthValue():number {
    let numberOfSlots = Math.max(this.hand.tricks[0].length, 4);
    return 100/numberOfSlots;
  }

  getTrickWidth():string {
    return this.getTrickWidthValue().toString() + "%";
  }

  getTrickLeft(index:number):string {
    return (index * this.getTrickWidthValue()).toString() + "%";
  }

  numberOfCards():number {
    if (!this.hand.cardsInHand)
      return 0;
    return this.hand.cardsInHand.length;
  }

  clickedAvatar():void {
    if (this.hand.userId === Meteor.userId() ) {
      //alert('clicked self')
    } else {
      //alert('clicked' + this.hand.userId)
    }
  }

}