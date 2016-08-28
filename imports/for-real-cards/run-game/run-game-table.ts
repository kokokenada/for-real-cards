/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Injector, Input, NgZone, ViewEncapsulation } from '@angular/core';
import { Dragula, DragulaService} from 'ng2-dragula/ng2-dragula';

import { Tools } from '/imports/common-app';

import { GameRenderingTools } from "../ui/index";
import { Card, Coordinates, Deck, Hand} from "../api/index";
import { RunGame } from './run-game.ts';
import { Player } from "../player/player";
import { PlayingCard } from "../playing-card/playing-card";
import { DeckView } from "./deck-view";
import { PileView } from "./pile-view";
import {PlatformTools} from '/imports/common-app';

import template from "./run-game-table.html"

const TABLE_ZONE_CENTER_RADIUS = 20;
const TABLE_ZONE_OUTER_RADIUS = 30;

@Component(
  {
    selector: 'run-game-table',
    directives: [DeckView, Dragula, Player, PlayingCard, PileView],
    encapsulation: ViewEncapsulation.None, // Require for Dragula .gu-transit
    template: template
  }
)

export class RunGameTable extends RunGame {
  @Input() width:string;
  @Input() height:string;
  @Input() forPlayer:string;
  
  constructor(private dragulaServiceChild: DragulaService, private ngZoneChild:NgZone, private injector: Injector) {
    super(dragulaServiceChild, ngZoneChild);
    if (PlatformTools.isIonic())  {
      let navParams = PlatformTools.getNavParams(injector);
      if (navParams) {
        this.width = navParams.data.width;
        this.height = navParams.data.height;
      }
    }
  }

  private forPlayerBool():boolean {
    return Tools.stringToBool(this.forPlayer);
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
