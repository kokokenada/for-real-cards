import { select } from 'ng2-redux';
import 'meteor/alanning:roles'
import {Type} from '@angular/core';

import { User} from '../../../../common-app-api';
import {ModalService} from '../../ui-ng2/modal/modal.service';
import {IModalState} from "../../ui/redux/modal/modal.types";

export class AccountsModal {
  @select() modalReducer;
  user:User;
  protected _error:string;

  constructor() {
  }

  ngOnInit() {
    this.modalReducer.subscribe(
      (state:IModalState)=>{
        this.user = state.params.user;
      }
    );
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
    return User.getDisplayName(this.user);
  }

}
