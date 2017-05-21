///<reference path='../../../../../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');
import { IUser, IDocumentChange } from 'common-app';

export interface IUsersState {
  users:Immutable.Map<string, IUser>;
}

export interface IUsersActionPayload {
  users?:IUser[];
  documentChange?:IDocumentChange<IUser>;
}



