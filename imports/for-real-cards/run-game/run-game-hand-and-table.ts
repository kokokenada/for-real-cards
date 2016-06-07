/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, NgZone } from '@angular/core';
import {RunGameTable} from "./run-game-table";
import {RunGameHand} from "./run-game-hand";
import {RunGame} from "./run-game";
import {Action, ActionType} from "../api/models/action.model";

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
  constructor(private ngZone:NgZone) {
 }
  ngOnInit() {
    RunGame.subscribe((action:Action)=> {
      console.log("RunGameHandAndTable subscribe")
      console.log(action)
      this.ngZone.run(()=> {
        if (action.actionType===ActionType.NEW_GAME) {
          this.gameId = action.gameId;
        }
      });
    });
  }
}

