/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone, OnInit } from '@angular/core';
import { select } from 'ng2-redux';

import { ILoginState, PlatformTools} from '../../common-app';
import {IForRealCardsState} from "../ui";

function template():string {
  if (PlatformTools.isIonic())
    return '{{displayName}} {{gameDescription}}';
  return '<label><strong>For Real Cards</strong> {{displayName}} {{gameDescription}}</label>';
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
      this.ngZone.run( ()=>{
        this.gameDescription = state.gameDescription;
      } );
    } );
    this.loginReducer.subscribe( (state:ILoginState)=>{
      this.ngZone.run( ()=>{
        this.displayName = state.displayName;
      } );
    } );
  }
}