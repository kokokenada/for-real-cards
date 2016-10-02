import 'meteor/alanning:roles'

import { User } from '../../../../common-app-api/src/api/models/user.model';
import { IModalState } from "../../ui";
import { ModalBase } from "../../ui-ng2";

export class AccountsModal extends ModalBase {
  user:User;
  protected _error:string;

  constructor() {
    super()
  }

  ngOnInit() {
    this.modalReducer$.subscribe(
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
