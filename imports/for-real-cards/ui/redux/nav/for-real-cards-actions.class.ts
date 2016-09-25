/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { ReduxModuleUtil, IAppState } from '../../../../common-app';

@Injectable()
export class ForRealCardsActions {
  private static prefix = 'FRC_';
  static START_NEW_GAME_REQUEST = ForRealCardsActions.prefix + 'START_NEW_GAME_REQUEST';
  static JOIN_GAME_REQUEST = ForRealCardsActions.prefix + 'JOIN_GAME_REQUEST';
  static ENTER_GAME_FAIL = ForRealCardsActions.prefix + 'ENTER_GAME_FAIL';
  static JOIN_GAME_SUCCESS = ForRealCardsActions.prefix + 'JOIN_GAME_SUCCESS';
  static VIEW_GAME_REQUEST = ForRealCardsActions.prefix + 'VIEW_GAME_REQUEST';
  static VIEW_GAME_SUCCESS = ForRealCardsActions.prefix + 'VIEW_GAME_SUCCESS';
  static LOAD_GAME_REQUEST = ForRealCardsActions.prefix + 'LOAD_GAME_REQUEST';
  static LOAD_GAME_SUCCESS = ForRealCardsActions.prefix + 'LOAD_GAME_SUCCESS';

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

  loadGameRequest(gameId:string, password:string) {
    this.ngRedux.dispatch({type:ForRealCardsActions.LOAD_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  loadGameSuccess(gameId:string) {
    this.ngRedux.dispatch({type:ForRealCardsActions.LOAD_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  viewGameRequest(gameId:string, password:string) {
    this.ngRedux.dispatch({type:ForRealCardsActions.VIEW_GAME_REQUEST, payload: {gameId:gameId , password:password}});
  }

  viewGameSuccess(gameId:string) {
    this.ngRedux.dispatch({type:ForRealCardsActions.VIEW_GAME_SUCCESS, payload: {gameId:gameId}});
  }

  error(error) {
    this.ngRedux.dispatch( ReduxModuleUtil.errorFactory(ForRealCardsActions.ENTER_GAME_FAIL, error) );
  }
}
