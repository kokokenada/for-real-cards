///<reference path='../../../../../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');
import {User} from "../../../../../common-app-api";
import {IDocumentChange } from "../../reactive-data/document-change.interface";

export interface IUsersState {
  users:Immutable.Map<string, User>;
}

export interface IUsersActionPayload {
  users?:User[];
  documentChange?:IDocumentChange<User>;
}



