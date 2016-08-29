import {TypedRecord} from 'typed-immutable-record';

import { User } from '../../../../../common-app-api';
import {Credentials} from "../../services/credentials";


export interface ILoginState {
  loggedIn:boolean;
  loggingIn:boolean;
  userId:string;
  displayName: string;
  user:User;
}

export interface ILoginRecord extends TypedRecord<ILoginRecord>, ILoginState {}

export interface ILoginAction {
  credentials: Credentials,
  user: User
}

