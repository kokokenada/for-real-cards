
import { User } from '../../../../../common-app-api';
import {Credentials} from "../../services/credentials";
import {IDocumentChange} from "../../reactive-data/document-change.interface";


export interface ILoginState {
  neverLoggedIn:boolean;
  loggedIn:boolean;
  loggingIn:boolean;
  userId:string;
  displayName: string;
  user:User;
  errorMessage:string;
}

export interface ILoginAction {
  credentials?: Credentials,
  user?: User,
  userId?: string,
  documentChange?:IDocumentChange<User>
}

