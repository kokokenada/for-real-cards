/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import {IAppState} from "../../../../common-app";


export interface IForRealCardsState extends IAppState {
  gameDescription:string;
  gameId:string;
  loading:boolean;
}

export interface IForRealCardsActionPayload {
  password?:string
  gameId?:string
}
