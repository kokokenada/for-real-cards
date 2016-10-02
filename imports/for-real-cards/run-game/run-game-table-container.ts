/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone,OnInit } from '@angular/core';
import { select } from 'ng2-redux';

import { RunGameContainer } from "./run-game-container";

@Component(
  {
    selector: 'run-game-table-container',
    template: `

  <run-game-table height="90vw" width="100hw"></run-game-table>
          `
  }
)
export class RunGameTableContainer extends RunGameContainer implements OnInit {
  @select() gamePlayReducer;
  constructor(private ngZone:NgZone) {
    super(ngZone);
  }
  ngOnInit() {
    this.initialize(this.gamePlayReducer);
  }
}
