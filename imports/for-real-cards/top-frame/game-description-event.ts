/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Observable, Subscription } from 'rxjs';

import {UserEvent, UserEventType} from "common-app";

import {Action, ActionType} from "../api/models/action.model";
import {RunGame} from "../run-game/run-game";

export class GameDescriptionEvent {
  description:string;
  constructor(action:Action=undefined) {
    if (action===undefined) {
      this.description = '';
    } else {
      if (action.actionType === ActionType.DEAL || action.actionType === ActionType.NEW_HAND) {
        this.description = RunGame.gameState.currentGameConfig.name + " (id " + action.gameId + ")"; // TODO: Change this to pull name from event instead of global state
      } else if (action.actionType === ActionType.RESET || action.actionType===ActionType.NEW_GAME) {
        this.description = "New Game (id " + action.gameId + ")";
      } else if (action.actionType === ActionType.LEAVE_GAME) {
        this.description = '';
      }
    }
  }
  
  static subscribe(actionStream:Observable<Action>, onNext:(gameDescriptionEvent:GameDescriptionEvent)=>void):Subscription {
    return actionStream
    .filter( (action:Action)=> {
      return (
      action.actionType === ActionType.DEAL ||
      action.actionType === ActionType.NEW_HAND ||
      action.actionType === ActionType.RESET ||
      action.actionType === ActionType.NEW_GAME ||
      action.actionType === ActionType.LEAVE_GAME)
    })
    .map( (action:Action)=> {
      return new GameDescriptionEvent(action)
    })
    .subscribe(onNext);
  }
}
UserEvent.startObserving( (userEvent:UserEvent)=>{
  if (userEvent.eventType===UserEventType.LOGOUT) {
    RunGame.pushGameNotification(null, ActionType.LEAVE_GAME);
  }
});