import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import {IGamePlayRecord} from "../ui/redux/game-play/game-play.types";


export class RunGameContainer {
  protected gameId:string;
  ngZoneBase:NgZone;
  constructor(ngZone  :NgZone) {
    this.ngZoneBase = ngZone;
  }

  initialize(gameState$:Observable<IGamePlayRecord>) {
    gameState$.subscribe( (gameState:IGamePlayRecord)=>{
      this.ngZoneBase.run(()=> {
        this.gameId = gameState ? gameState.gameId : null;
      })
    });
  }
}