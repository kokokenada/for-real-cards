/**
 * Created by kenono on 2016-05-14.
 */
import { Component, Input } from '@angular/core';

import {Tools} from "../../common-app/api";

import {RunGame} from './run-game.ts';
import {Player} from "../player/player";
import {Card, Coordinates, Deck, GameRenderingTools, Hand} from "../api";
import {PlayingCard} from "../playing-card/playing-card";
import {DeckView} from "./deck-view";

const TABLE_ZONE_CENTER_RADIUS = 20;
const TABLE_ZONE_OUTER_RADIUS = 30;

//object-fit: contain !important;
@Component(
  {
    selector: 'run-game-table',
    directives: [DeckView, Player, PlayingCard],
    template: `

  <div [ngStyle]="{position: 'relative', width:width, height: height}">


  <svg style="position: absolute; z-index: 5" height="100%" width="100%" viewBox="0,0,100,100" preserveAspectRatio="none">
    <circle cx="50" cy="50" r="40" style="fill:green;stroke:grey;stroke-width:2" />
    <!--
    <path    
            ng-if="showDropZone()" d="{{dropZonePath()}}" fill="darkgreen"></path>
            -->
  </svg>
  
  <!-- TABLE DROP ZONE -->
  <div
      style="position: absolute; top: 60%; left: 10%; width:80%; height:30%; z-index: 20;"
      
       class="drag-and-drop-container"
       data-drop-target="TABLE"
>
  
  </div>
  <!-- PLAYERS AROUND THE TABLE -->
  <player 
    *ngFor="let hand of getHands(); let i = index" 
    [hand]="hand" 
    [ngStyle]="{
            position: 'absolute', 
            'z-index': 100,
            width:'10%',
            height:'20%', 
            top: get100BasedCoordinates(i).y.toString() + '%', 
            left: get100BasedCoordinates(i).x.toString() + '%'
            }"
  >        
    
  
  </player>
  
  <!-- CARDS SHOWN BY PLAYERS -->
  
  <div
    style="position: absolute; width:100%; height:100%" 
    *ngFor="let hand of getHands(); let j=index"
    data-drop-target="TABLE"
    data-drag-source="TABLE"
    id="player-table-cards-{{j}}"
    ng-init="addDragContainer(j)"
    class="drag-and-drop-container"
  > 
    <style>
    
    .gu-transit {
      opacity: 0.2;
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
      filter: alpha(opacity=20);
      position: absolute;
      z-index: 30;
      width: 7.19% !important; height: 10% !important; top: {{getDropCoordinates(hand).y}}% !important; left: {{getDropCoordinates(hand).x}}% !important;
    }
    </style>
    <playing-card 
        *ngFor="let card of getCardsInHandFaceUp(hand.userId)"
        [card]="card"
        [imgStyle]="portraitCardStyle()"
        [attr.data-card-rank]="card.rank"
        [attr.data-card-suit]="card.suit"
        [ngStyle]="{
              position: 'absolute', 
              'z-index': 20,
              width:'7.19%', 
              height:'10%', 
              top: getFaceUpCardCoordinate(hand, card).y.toString() + '%', 
              left: getFaceUpCardCoordinate(hand, card).x.toString() + '%'
              }"
      >
      </playing-card>
  </div>
    <!-- DECK -->
  <deck-view [gameId]="gameId" 
    [hidden]="!shouldShowDeck()"
    [imgStyle] ="portraitCardStyle()"
    style = "
            position: absolute; 
            z-index: 10;
            width:14.38%; height:20%;
            top:40%;
            left:33.61%
    "
    class="drag-and-drop-container"
    data-drag-source="DECK"
    data-drop-target="DECK"
  >
  </deck-view>

  
  <!-- PILE -->
  
  <pile-view 
    class="drag-and-drop-container"
    style = "
        position: absolute; 
        z-index: 10;
        width:14.38%; height:20%;
        top:40%;
        left:52%
    "
    [hidden]="!shouldShowPile()" 
    [imgClass]="portraitCardStyle()"
    [gameId]="gameId"
    [attr.data-card-rank]="topCardInPile()?.rank"
    [attr.data-card-suit]="topCardInPile()?.suit"
    data-drag-source="PILE"
    data-drop-target="PILE"
  >
  </pile-view>
</div>
          `,
  }
)


export class RunGameTable extends RunGame {
  @Input() width:string;
  @Input() height:string;
  @Input() forPlayer:string;
  @Input() gameId:string;
  
  constructor() {
  }

  private forPlayerBool():boolean {
    return Tools.stringToBool(this.forPlayer);
  }
  addDragContainer(index:number):void {
    let id= "player-table-cards-" + index.toString();
    let el = document.getElementById(id);
    if (!el)
      return;
    RunGame.drake.containers.forEach((container)=> {
      if (container.id === id)
        return;
    });
    RunGame.drake.containers.push(el);

  }
  showDropZone():boolean {
    return this.forPlayerBool() &&
        this.shouldShowTableDrop();
  }

  private degrees(playerIndex:number):number {
    let hands:Hand[] = this.getHands();
    let numberOfPlayers:number = hands.length;
    let degrees = 360/numberOfPlayers*playerIndex;
    if (this.forPlayerBool()) {
      // Rotate so user is at bottom
      let currentUserIndex = Hand.indexOfUser(hands);
      if (currentUserIndex===-1) {
        throw "Couldn't find current user in hands"
      }
      let currentPlayerDegrees:number = 360/numberOfPlayers*currentUserIndex;
      let desiredDegrees = 270; // (0 is 3 oclock)
      degrees -= (currentPlayerDegrees-desiredDegrees);
    } else {
      degrees += 90; // make top 1st position (0 is 3 oclock)
    }
    if (degrees>=360)
      degrees -= 360;
    return degrees;
  }

  get100BasedCoordinates(index:number):Coordinates {
    let degrees = this.degrees(index);
//    console.log('getCoord')  investigate why these recur
 //   console.log(index)
  //  console.log(degrees)
    return GameRenderingTools.getXY(20, 10, 50, 50, 40, this.degrees(index));
  }

  private degreesWidth():number {
    return this.getHands().length<3 ? 120 : 360/this.getHands().length;
  }

  dropZonePath():string {
    if (!this.getHands().length)
      return "M0,0Z";
    let degreesWidth:number = this.degreesWidth();
    let upperLeft:Coordinates = GameRenderingTools.getXY(0,0, 50, 50, TABLE_ZONE_CENTER_RADIUS, 270-degreesWidth/2);
    let upperRight:Coordinates = GameRenderingTools.getXY(0, 0, 50, 50, TABLE_ZONE_CENTER_RADIUS, 270+degreesWidth/2);
    let lowerLeft:Coordinates = GameRenderingTools.getXY(0, 0, 50, 50, TABLE_ZONE_OUTER_RADIUS, 270-degreesWidth/2);
    let lowerRight:Coordinates = GameRenderingTools.getXY(0, 0, 50, 50, TABLE_ZONE_OUTER_RADIUS, 270+degreesWidth/2);


    let returnValue = "M" + upperLeft.x.toString() + "," + upperLeft.y.toString() + " "        // Move to upper left
      + "A" + TABLE_ZONE_CENTER_RADIUS.toString() + "," + TABLE_ZONE_CENTER_RADIUS.toLocaleString() + " "   // Arc to upper right
      + " 0 0 0" + " "
      + upperRight.x.toString() + "," + upperRight.y.toString() + " "
      + "L" + lowerRight.x.toString() + "," + lowerRight.y.toString() + " "         // Line to lower right
      + "A" + TABLE_ZONE_OUTER_RADIUS.toString() + "," + TABLE_ZONE_OUTER_RADIUS.toString() + " "           // Arc to lower left
      + " 0 0 1 " + " "
      + lowerLeft.x.toString() + "," + lowerLeft.y.toString() + " "
      + "L" + upperLeft.x.toString() + "," + upperLeft.y.toString() + " "           // Line to upper left
      + "z";
    console.log(returnValue)
    return returnValue;
  }

  getFaceUpCardCoordinate(hand:Hand, card:Card):Coordinates {
    let handId:string = hand._id;
    let playerIndex:number =  Hand.indexOf(this.getHands(), handId);
    let cardIndex:number = Deck.indexOf(hand.cardsFaceUp, card);
    let degreesWidth:number = this.degreesWidth();
    let cardDegrees;
    cardDegrees = (cardIndex/hand.cardsFaceUp.length)*degreesWidth;
    cardDegrees += 1/(hand.cardsFaceUp.length+1)*degreesWidth;

    return GameRenderingTools.getXY(10,5,50,50, TABLE_ZONE_CENTER_RADIUS, this.degrees(playerIndex)-degreesWidth/2+cardDegrees);
  }

  getDropCoordinates(hand:Hand):Coordinates {
    let handId:string = hand._id;
    let playerIndex:number =  Hand.indexOf(this.getHands(), handId);
    return GameRenderingTools.getXY(10,5,50,50, TABLE_ZONE_CENTER_RADIUS, this.degrees(playerIndex)-this.degreesWidth()/2);
  }
}
