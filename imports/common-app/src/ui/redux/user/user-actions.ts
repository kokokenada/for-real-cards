import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';

@Injectable()
export class UserActions {
  private static prefix = 'CA_USER_';
  static LOGIN = UserActions.prefix + 'LOGIN';
  static LOG_OUT_REQUEST = UserActions.prefix + 'LOG_OUT_REQUEST';
  static LOGOUT = UserActions.prefix + 'LOGOUT';
  static AVATAR_UPDATE = UserActions.prefix + 'AVATAR_UPDATE';
  static DISPLAY_NAME_UPDATE = UserActions + 'DISPLAY_NAME_UPDATE';
  static ROLL_UPDATE = UserActions + 'ROLL_UPDATE';

}