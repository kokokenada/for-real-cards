/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState, IPayloadAction } from '../../../../common-app';
import {TopFrame} from "../../../top-frame/top-frame.base";
import {BaseApp} from "../../../../common-app/src/ui/redux/base-app.class";

@Injectable()
export class ForRealCardsActions {
  private static prefix = 'FRC_';
  static NAV_TO_ENTER = ForRealCardsActions.prefix + 'NAV_TO_ENTER';
  static NAV_TO_PROFILE = ForRealCardsActions.prefix + 'NAV_TO_PROFILE';
  static NAV_TO_START = ForRealCardsActions.prefix + 'NAV_TO_START';
  static NAV_TO_TABLE = ForRealCardsActions.prefix + 'NAV_TO_TABLE';
  static NAV_TO_HAND = ForRealCardsActions.prefix + 'NAV_TO_HAND';
  static START_NEW_GAME_REQUEST = ForRealCardsActions.prefix + 'START_NEW_GAME_REQUEST';
  static JOIN_GAME_REQUEST = ForRealCardsActions.prefix + 'JOIN_GAME_REQUEST';
  static ENTER_GAME_FAIL = ForRealCardsActions.prefix + 'ENTER_GAME_FAIL';
  static JOIN_GAME_SUCCESS = ForRealCardsActions.prefix + 'JOIN_GAME_SUCCESS';
  static VIEW_GAME_REQUEST = ForRealCardsActions.prefix + 'VIEW_GAME_REQUEST';
  static VIEW_GAME_SUCCESS = ForRealCardsActions.prefix + 'VIEW_GAME_SUCCESS';

  constructor(private ngRedux: NgRedux<IAppState>) {
  }

  newGame(password:string) : void {
    this.ngRedux.dispatch({type:ForRealCardsActions.START_NEW_GAME_REQUEST, payload: {password:password}});
  }

  joinGameRequest(gameId:string, password:string) : void {
    this.ngRedux.dispatch({type:ForRealCardsActions.JOIN_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  joinGameSuccess(gameId:string) {
    this.ngRedux.dispatch({type:ForRealCardsActions.JOIN_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  viewGameRequest(gameId:string, password:string) {
    this.ngRedux.dispatch({type:ForRealCardsActions.VIEW_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  viewGameSuccess(gameId:string) {
    this.ngRedux.dispatch({type:ForRealCardsActions.VIEW_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  error(error) {
    this.ngRedux.dispatch( BaseApp.errorFactory(ForRealCardsActions.ENTER_GAME_FAIL, error) );
  }
}
