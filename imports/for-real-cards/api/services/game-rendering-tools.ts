/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import {Meteor} from 'meteor/meteor';
import { Coordinates } from "../models/coordinates.class"
 
export class GameRenderingTools {
  private static getPointOnEllipse(centerX:number, centerY:number, radius:number, degrees:number, xSquash:number=1, ySquash:number=1):Coordinates {
    let theta:number = 2*Math.PI*(degrees/360);
    return new Coordinates(
      centerX + xSquash * radius * Math.cos(theta),
      centerY - ySquash * radius * Math.sin(theta)
    );
    // http://www.mathopenref.com/coordcirclealgorithm.html
  }

  /**
   * get CY coordinates of upper left of a box that fits inside the given cirle at the given degrees
   *
   * @param objectHeight
   * @param objectWidth
   * @param centerX
   * @param centerY
   * @param radius
   * @param degrees
   * @returns {Coordinates}
   */
  static getXY(objectHeight:number, objectWidth:number, centerX:number, centerY:number, radius:number, degrees:number):Coordinates {
    let ellipseWidth = radius*2;// - objectWidth;
    let ellipseHeight = radius*2; // - objectHeight;
    return GameRenderingTools.getPointOnEllipse(centerX-objectWidth/2, centerY-objectHeight/2, radius, degrees, ellipseWidth/(radius*2), ellipseHeight/(radius*2));
    /*let midPoint =
    let returnCoordinates = new Coordinates();
    returnCoordinates.x = midPoint.x - objectWidth / 2;
    returnCoordinates.y = midPoint.y - objectHeight / 2;
    //console.log(degrees)
    //console.log(returnCoordinates)
    return returnCoordinates;*/
  }
  
  static getCardBackURL(gameId:string, portrait:boolean=true) {
    if (portrait)
      return Meteor.absoluteUrl() + "backs/standard-blue.jpg";
    else
      return Meteor.absoluteUrl() + "backs/standard-blue-landscape.png";
  }
  
}
