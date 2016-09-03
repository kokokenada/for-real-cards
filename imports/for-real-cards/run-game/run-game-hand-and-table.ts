/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, NgZone } from '@angular/core';
import {RunGameTable} from "./run-game-table";
import {RunGameHand} from "./run-game-hand";
import {RunGame} from "./run-game";
import {GamePlayAction, GamePlayActionType} from "../api/models/action.model";


function template():string {
return `
  <run-game-table 
    forPlayer="true" 
    height="45vh" 
    width="100hw" 
   >  
  </run-game-table>
  <run-game-hand 
    style="width:100vw; height: 45vh">
  </run-game-hand>
`;
}

@Component(
  {
    selector: 'run-game-hand-and-table',
    directives: [RunGameTable, RunGameHand],
    template: template()
  }
)
export class RunGameHandAndTable {
  @Input() gameId:string;
  constructor(private ngZone:NgZone) {
 }
  ngOnInit() {
    RunGame.subscribe((action:GamePlayAction)=> {
      this.ngZone.run(()=> {
        if (action.actionType===GamePlayActionType.NEW_GAME) {
          this.gameId = action.gameId;
        }
      });
    });
  }
}

