import { Component, NgZone } from '@angular/core';
import { select } from '@angular-redux/store';

import {IGamePlayRecord} from "../ui/redux/game-play/game-play.types";


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
    template: template()
  }
)
export class RunGameHandAndTable {
  gameId:string;
  @select() gamePlayReducer;

  constructor(private ngZone:NgZone) {
  }
  ngOnInit() {
    this.gamePlayReducer.subscribe( (gameState:IGamePlayRecord)=>{
      this.ngZone.run(
        ()=> {
          this.gameId = gameState ? gameState.gameId : null;
        });
    } );
  }
}

