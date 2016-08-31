/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { select } from 'ng2-redux';

import {GameDescriptionEvent} from "./game-description-event";
import {RunGame} from "../run-game/run-game";
import {PlatformTools} from '../../common-app';
import {ILoginState} from "../../common-app/src/ui/redux/login/login.types";

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
  @select() loginReducer;
  gameDescription:string;
  displayName:string;
  private subscriptionGameDesc:Subscription;
  constructor(private ngZone:NgZone) {
    this.subscriptionGameDesc = GameDescriptionEvent.subscribe(RunGame.subject, (gameDescription:GameDescriptionEvent)=>{
      this.ngZone.run(()=>{
        this.gameDescription = gameDescription.description;
      });
    });
  }
  ngInit() {
    this.loginReducer.subscribe( (loginState:ILoginState)=>{
      this.displayName = loginState.displayName;
    } );
  }
  ngOnDestroy() {
    if (this.subscriptionGameDesc) {
      this.subscriptionGameDesc.unsubscribe();
    }
  }
}