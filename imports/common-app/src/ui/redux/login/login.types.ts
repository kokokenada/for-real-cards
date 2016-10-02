
import { User } from "../../../../../common-app-api/src/api/models/user.model";
import { Credentials } from "../../services/credentials";
import { IDocumentChange } from "../../reactive-data/document-change.interface";


export interface ILoginState {
  neverLoggedIn:boolean;
  loggedIn:boolean;
  loggingIn:boolean;
  userId:string;
  displayName: string;
  user:User;
  errorMessage:string;
}

export interface ILoginActionPayload {
  credentials?: Credentials,
  user?: User,
  userId?: string,
  documentChange?:IDocumentChange<User>,
  autoLogin?: boolean
  error?: any
}

