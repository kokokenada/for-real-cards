import {Injectable} from "@angular/core";

import { ReduxPackage, IAppState, IPayloadAction} from 'redux-package';
import { accountsAdminReducer} from "./accounts-admin-reducer";
import { AccountsAdminAsync} from "./accounts-admin-async.class";
import { AccountsAdminActions} from "./accounts-admin-actions.class";

@Injectable()
export class AccountsAdminModule extends ReduxPackage<IAppState, IPayloadAction>  {
  reducers=[{name:'accountsAdminReducer', reducer: accountsAdminReducer}];
  actions = AccountsAdminActions;
  constructor(private accountsAdminAsync:AccountsAdminAsync) {
    super();
    this.middlewares.push(accountsAdminAsync.modalMiddleware);
  }
}