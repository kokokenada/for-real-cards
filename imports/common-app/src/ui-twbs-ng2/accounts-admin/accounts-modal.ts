import { Input } from '@angular/core';
import 'meteor/alanning:roles'
import {Type} from '@angular/core';

import { AccountTools } from '../../ui/index';
import { User} from '/imports/common-app-api';
import {ModalService} from '../../ui-ng2/modal/modal.service';

export class AccountsModal {
  @Input() componentParameters;
  user:User;
  protected _error:string;

  constructor() {
  }

  ngOnChanges(obj) {
//    console.log("ngOnChnages accounts modal")
//    console.log(this)
    if (obj.componentParameters) {
      this.user = this.componentParameters.user;
      if (this.user && !this.user.profile)
        this.user.profile = {};
    }
//    console.log(this)
  }

  protected static _open(component:Type, selector:string, user:User):Promise<any> {
    return ModalService.open(component, selector, {user: user})
  }

  cancel() {
    ModalService.close(false);
  }

  complete() {
    ModalService.close(true);
  }

  get error():string {
    return this._error;
  }

  allRoles():string[] {
    return _.pluck(Roles.getAllRoles().fetch(), "name");
  }

  displayName():string {
    if (!this.user)
      return "";
    return AccountTools.getDisplayName(this.user._id);
  }

  timeoutApply():void {
    //Meteor.setTimeout(()=>{this.$scope.$apply()}, 0)
  }
}
