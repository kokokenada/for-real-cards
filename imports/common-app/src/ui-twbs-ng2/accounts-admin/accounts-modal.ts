import { select } from 'ng2-redux';
import 'meteor/alanning:roles'

import { User} from '../../../../common-app-api';
import {IModalState, ModalActions, ModalBase} from "../../ui";

export class AccountsModal extends ModalBase {
  @select() modalReducer;
  user:User;
  protected _error:string;

  constructor(modalActions:ModalActions) {
    super(modalActions)
  }

  ngOnInit() {
    this.modalReducer.subscribe(
      (state:IModalState)=>{
        this.user = state.params.user;
      }
    );
  }


  cancel() {
    this.close(false);
  }

  complete() {
    this.close(true);
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
