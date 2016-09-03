import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState, IPayloadAction } from '../../../../common-app';


import { ActionType } from "../../../api";

/*
export enum ActionType {
  NEW_GAME,           // 0
  RESET,              // 1
  NEW_HAND,           // 2
  DEAL,               // 3
  DECK_TO_HAND,       // 4
  HAND_TO_TABLE,      // 5
  DECK_TO_PILE,       // 6
  HAND_TO_PILE,       // 7
  HAND_SORT,          // 8
  PILE_TO_HAND,       // 9
  PILE_TO_DECK,       // 10
  HAND_TO_DECK,       // 11
  TABLE_TO_HAND,      // 12
  TAKE_TRICK,         // 13
  UNDO,               // 14
  ENTER_GAME_FAIL,    // 15
  ENTER_GAME_AT_HAND_NOTIFY,  // 16
  ENTER_GAME_AT_TABLE_NOTIFY, // 17
  LEAVE_GAME          // 18
}
*/

@Injectable()
export class GamePlayActions {
  private static prefix = 'FRC_GAMEPLAY_';

  constructor(private ngRedux: NgRedux<IAppState>) {
  }

  fireAction(actionType:ActionType, payload:any) {
    this.ngRedux.dispatch({type: GamePlayActions.prefix + ActionType[actionType]});
  }

  navigate(to:string, gamdId:string='') {
    this.ngRedux.dispatch({type:to});
  }
}
