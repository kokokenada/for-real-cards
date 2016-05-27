/**
 * Created by kenono on 2016-05-08.
 */
import { Component } from '@angular/core';
import { RunGameTable } from "./run-game-table";
import { RunGameContainer } from "./run-game-container"; 

@Component(
  {
    selector: 'run-game-table-container',
    directives: [RunGameTable],
    template: `

  <run-game-table height="90vw" width="100hw" game-id="{{gameId}}"></run-game-table>
          `
  }
)
export class RunGameTableContainer extends RunGameContainer {
}
