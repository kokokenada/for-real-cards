/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code licensed under GPL 3.0
 */

import { Component } from '@angular/core';
import { RunGameTable } from "./run-game-table";
import { RunGameContainer } from "./run-game-container"; 

@Component(
  {
    selector: 'run-game-table-container',
    directives: [RunGameTable],
    template: `

  <run-game-table height="90vw" width="100hw" [gameId]="gameId"></run-game-table>
          `
  }
)
export class RunGameTableContainer extends RunGameContainer {
}
