import { Pipe, PipeTransform } from '@angular/core';
import { select } from '@angular-redux/store';

import {MenuItem, ILoginState, IUser, LOGIN_PACKAGE_NAME} from 'common-app';

@Pipe({
  name: 'menuFilter',
  pure: false
})
export class MenuFilterPipe implements PipeTransform {
  @select(LOGIN_PACKAGE_NAME) loginState;
  private user: IUser;
  constructor() {
    this.loginState.subscribe( (loginState:ILoginState)=>{
      this.user = loginState.user;
    })
  }
  transform(allMenus: MenuItem[]) {
//    if (!allMenus)
//        return null;
    return allMenus.filter( (menuItem) => { return menuItem.shouldRender(this.user)});
  }
}