import { Component, NgZone, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';

import { RunGameContainer } from "./run-game-container";

@Component(
  {
    selector: 'run-game-tabs',
    template:  `
 
  <ngb-tabset active="active">
    <ngb-tab title="Hand and Table">
      <ng-template ngbTabContent>
        <run-game-hand-and-table></run-game-hand-and-table>
      </ng-template>
    </ngb-tab>
    <ngb-tab title="Hand">
      <ng-template ngbTabContent>
        <run-game-hand showTableProxy="true"></run-game-hand>    
      </ng-template>
    </ngb-tab> 
    <ngb-tab title="Table">
      <ng-template ngbTabContent>
        <run-game-table height="90vw" width="100hw"></run-game-table>  
      </ng-template>
    </ngb-tab>
  </ngb-tabset>
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

