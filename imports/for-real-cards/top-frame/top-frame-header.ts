import { Component, NgZone, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';

import {PlatformTools} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";
import {ILoginState, LOGIN_PACKAGE_NAME} from 'common-app';
import { IGameStartState, INITIAL_STATE_GAME_START } from '../../for-real-cards-lib';
import {GAME_START_PACKAGE_NAME} from '../../for-real-cards-lib/redux-packages/game-start/game-start.package';

function template():string {
  if (PlatformTools.isIonic())
    return '{{displayName}} {{gameDescription}}';
  return '<label><strong>For Real Cards!</strong> {{displayName}} {{gameDescription}}</label>';
}

@Component({
  selector: 'top-frame-header',
  template: template()
})
export class TopFrameHeader implements OnInit {
  @select(LOGIN_PACKAGE_NAME) loginReducer;
  @select(GAME_START_PACKAGE_NAME) forRealCardsReducer;
  gameDescription:string;
  displayName:string;

  constructor(private ngZone:NgZone) {}

  ngOnInit() {
    this.forRealCardsReducer.subscribe( (state:IGameStartState)=>{
      this.ngZone.run( ()=>{
        state = state || INITIAL_STATE_GAME_START;
        this.gameDescription = state.gameDescription;
      } );
    } );
    this.loginReducer.subscribe( (state:ILoginState)=>{
      this.ngZone.run( ()=>{
        if (!state)
          this.displayName = '';
        else
          this.displayName = state.displayName;
      } );
    } );
  }
}