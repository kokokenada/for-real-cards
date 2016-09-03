/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { NgZone } from '@angular/core';
import {RunGame} from "./run-game";
import {GamePlayAction, GamePlayActionType} from "../api/models/action.model";
import { Subscription } from 'rxjs';


export class RunGameContainer {
  protected gameId:string;
  private subscription:Subscription;
  ngZoneBase:NgZone
  constructor(ngZone  :NgZone) {
    this.ngZoneBase = ngZone;
    this.subscription = RunGame.subscribe((action:GamePlayAction)=> {
      this.ngZoneBase.run(()=> {
        if (action.actionType===GamePlayActionType.NEW_GAME) {
          console.log('setting gameId in RunGameController')
          console.log(action)
          this.gameId = action.gameId;
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
}