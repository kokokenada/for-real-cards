
import { User } from '../../../../../common-app-api';
import {Credentials} from "../../services/credentials";


export interface ILoginState {
  loggedIn:boolean;
  loggingIn:boolean;
  userId:string;
  displayName: string;
  user:User;
  errorMessage:string;
}

export interface ILoginAction {
  credentials: Credentials,
  user: User
}

