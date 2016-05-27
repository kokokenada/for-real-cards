/**
 * Created by kenono on 2016-05-08.
 */

import { Component, Input } from '@angular/core';
import { OnActivate, Router, RouteSegment } from '@angular/router';

import { RunGameHandAndTable} from "./run-game-hand-and-table";
import { RunGameHand } from "./run-game-hand";
import { RunGameTable } from "./run-game-table";
import { TAB_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap'
import {RunGameContainer} from "./run-game-container";

@Component(
  {
    selector: 'run-game-tabs',
    directives: [RunGameHandAndTable, RunGameHand, RunGameTable, TAB_DIRECTIVES],
    template: `
  <tabset active="active">
    <tab index="0" heading="Hand and Table">
      <run-game-hand-and-table game-id="{{gameId}}"></run-game-hand-and-table>
    </tab>
    <tab index="1" heading="Hand">
      <run-game-hand show-table-proxy game-id="{{gameId}}"></run-game-hand>    
    </tab>
    <tab index="2" heading="Table">
      <run-game-table height="90vw" width="100hw" game-id="{{gameId}}"></run-game-table>
    </tab>
  </tabset>
  
          `,
  }
)

export class RunGameTabs extends RunGameContainer{
}

