/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';

import {GameDescriptionEvent} from "./game-description-event";
import {RunGame} from "../run-game/run-game";
import {UserDisplayEvent} from "./user-display-event";
import {PlatformTools} from "../../common-app/api/services/platform-tools";

function template():string {
  if (PlatformTools.isIonic())
    return '{{displayName}} {{gameDescription}}';
  return '<label><strong>For Real Cards</strong> {{displayName}} {{gameDescription}}</label>';
}

@Component({
  selector: 'top-frame-header',
  template: template()
})
export class TopFrameHeader {
  gameDescription:string;
  displayName:string;
  private subscriptionGameDesc:Subscription;
  private subscriptionUserDisplay:Subscription;
  constructor(private ngZone:NgZone) {
    this.subscriptionGameDesc = GameDescriptionEvent.subscribe(RunGame.subject, (gameDescription:GameDescriptionEvent)=>{
      this.ngZone.run(()=>{
        this.gameDescription = gameDescription.description;
      });
    });
    this.subscriptionUserDisplay = UserDisplayEvent.subscribe( (userDisplayEvent:UserDisplayEvent)=> {
      this.ngZone.run(()=>{
        this.displayName = userDisplayEvent.displayName;
      });
    });
  }
  ngOnDestroy() {
    if (this.subscriptionGameDesc) {
      this.subscriptionGameDesc.unsubscribe();
    }
    if (this.subscriptionUserDisplay) {
      this.subscriptionUserDisplay.unsubscribe();
    }
  }
}