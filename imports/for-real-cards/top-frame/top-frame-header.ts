import { Component, NgZone, OnInit } from '@angular/core';
import { select } from 'ng2-redux';

import { IForRealCardsState, INITIAL_STATE_FOR_REAL_CARDS } from "../ui";
import {PlatformTools} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";
import {LOGIN_INITIAL_STATE} from "../../common-app/src/ui/redux/login/login-reducer";
import {ILoginState} from "../../common-app/src/ui/redux/login/login.types";

function template():string {
  if (PlatformTools.isIonic())
    return '{{displayName}} {{gameDescription}}';
  return '<label><strong>For Real Cards!!</strong> {{displayName}} {{gameDescription}}</label>';
}

@Component({
  selector: 'top-frame-header',
  template: template()
})
export class TopFrameHeader implements OnInit {
  @select() loginReducer;
  @select() forRealCardsReducer;
  gameDescription:string;
  displayName:string;

  constructor(private ngZone:NgZone) {}

  ngOnInit() {
    this.forRealCardsReducer.subscribe( (state:IForRealCardsState)=>{
      state = state || INITIAL_STATE_FOR_REAL_CARDS;
      this.ngZone.run( ()=>{
        this.gameDescription = state.gameDescription;
      } );
    } );
    this.loginReducer.subscribe( (state:ILoginState)=>{
      state = state || LOGIN_INITIAL_STATE;
      this.ngZone.run( ()=>{
        this.displayName = state.displayName;
      } );
    } );
  }
}