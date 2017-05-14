import 'meteor/alanning:roles'

import { LoginFunctions, IUser } from 'common-app';
import { IModalState } from "../../ui";
import { ModalBase } from "../../ui-ng2";
import { AccountModalParams } from "./account-modal-params";

export class AccountsModal extends ModalBase<AccountModalParams, boolean> {
  user: IUser;
  protected _error:string;

  constructor() {
    super()
  }

  ngOnInit() {
    this.modalReducer$.subscribe(
      (state:IModalState<AccountModalParams, boolean>)=>{
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
    return LoginFunctions.getDisplayName(this.user);
  }

}
