/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */


import { Component, NgZone, OnInit } from '@angular/core';
import { TAB_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap'
import { select } from 'ng2-redux';

import { RunGameHandAndTable } from "./run-game-hand-and-table";
import { RunGameHand } from "./run-game-hand";
import { RunGameTable } from "./run-game-table";
import { RunGameContainer } from "./run-game-container";

@Component(
  {
    selector: 'run-game-tabs',
    directives: [RunGameHandAndTable, RunGameHand, RunGameTable, TAB_DIRECTIVES],
    template:  `
 
  <tabset active="active">
    <tab index="0" heading="Hand and Table">
      <run-game-hand-and-table></run-game-hand-and-table>
    </tab>
    <tab index="1" heading="Hand">
      <run-game-hand showTableProxy="true"></run-game-hand>    
    </tab> 
    <tab index="2" heading="Table">
     <run-game-table height="90vw" width="100hw"></run-game-table>  
    </tab>
  </tabset>
      `
  }
)

export class RunGameTabs extends RunGameContainer implements OnInit {
  @select() gamePlayReducer;
  constructor(private ngZone:NgZone) {
    super(ngZone);
  }

  ngOnInit() {
    this.initialize(this.gamePlayReducer);
  }

}

