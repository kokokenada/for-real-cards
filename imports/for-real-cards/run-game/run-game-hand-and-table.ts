/**
 * Created by kenono on 2016-05-08.
 */
import { Component, Input } from '@angular/core';
import {RunGameTable} from "./run-game-table";
import {RunGameHand} from "./run-game-hand";

@Component(
  {
    selector: 'run-game-hand-and-table',
    directives: [RunGameTable, RunGameHand],
    template: `

  <run-game-table 
    forPlayer="true" 
    height="45vh" 
    width="100hw" 
    [gameId]="gameId">  
  </run-game-table>
  <run-game-hand 
    [gameId]="gameId" 
    style="width:100vw; height: 45vh">
  </run-game-hand>
          `
  }
)
export class RunGameHandAndTable {
  @Input() gameId:string;
}

