import { Pipe, PipeTransform } from '@angular/core';
import { select } from 'ng2-redux';

import {MenuItem} from "../../ui/services/menu-item";
import {ILoginState, LOGIN_INITIAL_STATE} from "../../ui";
import { User } from "../../../../common-app-api/src/api/models/user.model";

@Pipe({
  name: 'menuFilter',
  pure: false
})
export class MenuFilterPipe implements PipeTransform {
  @select() loginReducer;
  private user:User;
  constructor() {
    console.log('MenuFilterPipe init');
    this.loginReducer.subscribe( (loginState:ILoginState)=>{
      loginState = loginState || LOGIN_INITIAL_STATE;
      this.user = loginState.user;
    })
  }
  transform(allMenus: MenuItem[]) {
    return allMenus.filter( (menuItem) => { return menuItem.shouldRender(this.user)});
  }
}