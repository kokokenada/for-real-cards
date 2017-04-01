import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import { accountsAdminReducer} from "./accounts-admin-reducer";
import { AccountsAdminAsync} from "./accounts-admin-async.class";
import { IAppState } from "../state.interface";
import { IPayloadAction } from "../action.interface";
import { AccountsAdminActions} from "./accounts-admin-actions.class";

@Injectable()
export class AccountsAdminModule extends ReduxModule<IAppState, IPayloadAction>  {
  reducers=[{name:'accountsAdminReducer', reducer: accountsAdminReducer}];
  actions = AccountsAdminActions;
  constructor(private accountsAdminAsync:AccountsAdminAsync) {
    super();
    this.middlewares.push(accountsAdminAsync.modalMiddleware);
  }
}