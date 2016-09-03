/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Observable, Subscription } from 'rxjs';

import {GamePlayAction, GamePlayActionType} from "../api/models/action.model";
import {RunGame} from "../run-game/run-game";

export class GameDescriptionEvent {
  description:string;
  constructor(action:GamePlayAction=undefined) {
    if (action===undefined) {
      this.description = '';
    } else {
      if (action.actionType === GamePlayActionType.DEAL || action.actionType === GamePlayActionType.NEW_HAND) {
        this.description = RunGame.gameState.currentGameConfig.name + " (id " + action.gameId + ")"; // TODO: Change this to pull name from event instead of global state
      } else if (action.actionType === GamePlayActionType.RESET || action.actionType===GamePlayActionType.NEW_GAME) {
        this.description = "New Game (id " + action.gameId + ")";
      } else if (action.actionType === GamePlayActionType.LEAVE_GAME) {
        this.description = '';
      }
    }
  }
  
  static subscribe(actionStream:Observable<GamePlayAction>, onNext:(gameDescriptionEvent:GameDescriptionEvent)=>void):Subscription {
    return actionStream
    .filter( (action:GamePlayAction)=> {
      return (
      action.actionType === GamePlayActionType.DEAL ||
      action.actionType === GamePlayActionType.NEW_HAND ||
      action.actionType === GamePlayActionType.RESET ||
      action.actionType === GamePlayActionType.NEW_GAME ||
      action.actionType === GamePlayActionType.LEAVE_GAME)
    })
    .map( (action:GamePlayAction)=> {
      return new GameDescriptionEvent(action)
    })
    .subscribe(onNext);
  }
}

/*UserEvent.startObserving( (userEvent:UserEvent)=>{
  if (userEvent.eventType===UserEventType.LOGOUT) {
    RunGame.pushGameNotification(null, GamePlayActionType.LEAVE_GAME);
  }

});*/