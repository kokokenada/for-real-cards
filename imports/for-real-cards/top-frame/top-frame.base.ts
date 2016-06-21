import { Subscription } from 'rxjs'

import {Action, ActionType} from "../api/models/action.model";
import {RunGame} from "../run-game/run-game";
/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
export class TopFrame {
  protected gameDescription:string;
  protected displayName:string;
  protected subscriptions:Subscription[] = [];

  getGameDescription():string {
    return this.gameDescription;
  }
  protected setGameDescription(newDescription:string):void {
    this.gameDescription = newDescription;
  }

  protected setGameDescriptionFromAction(action:Action) {
    if (action.actionType === ActionType.DEAL) {
      this.setGameDescription(RunGame.gameState.currentGameConfig.name + " (id " + action.gameId + ")");
    } else if (action.actionType === ActionType.NEW_HAND) {
      this.setGameDescription(RunGame.gameState.currentGameConfig.name + " (id " + action.gameId + ")");
    } else if (action.actionType === ActionType.RESET || action.actionType===ActionType.NEW_GAME) {
      this.setGameDescription("New Game (id " + action.gameId + ")");
    }
  }
  
  protected cleanSubScriptions():void {
    if (this.subscriptions) {
      this.subscriptions.forEach((subscription:Subscription)=>{
        subscription.unsubscribe();
      })
    }

  }
}