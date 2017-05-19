import { Component, NgZone,OnInit } from '@angular/core';
import { select } from '@angular-redux/store';

import { RunGameContainer } from "./run-game-container";
import {GAME_PLAY_PACKAGE_NAME} from '../../for-real-cards-lib';

@Component(
  {
    selector: 'run-game-table-container',
    template: `

  <run-game-table height="90vw" width="100hw"></run-game-table>
          `
  }
)
export class RunGameTableContainer extends RunGameContainer implements OnInit {
  @select(GAME_PLAY_PACKAGE_NAME) gamePlayReducer;
  constructor(private ngZone:NgZone) {
    super(ngZone);
  }
  ngOnInit() {
    this.initialize(this.gamePlayReducer);
  }
}
