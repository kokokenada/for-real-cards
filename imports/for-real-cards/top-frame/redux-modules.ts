import { Injectable } from '@angular/core';
import { NgRedux } from "@angular-redux/store";

import {ForRealCardsModule, GamePlayModule } from "../ui";
import {ReduxModuleCombiner} from "../../common-app/src/ui/redux/redux-module-combiner";
import {LoginModule} from "../../common-app/src/ui/redux/login/login.module";
import {ConnectModule} from "../../common-app/src/ui/redux/connect/connect.module";
import {UsersModule} from "../../common-app/src/ui/redux/users/users.module";
import {IAppState} from "../../common-app/src/ui/redux/state.interface";
import {UploaderModule} from "../../common-app/src/ui/redux/uploader/uploader.module";
import {ModalModule} from "../../common-app/src/ui/redux/modal/modal.module";
import {AccountsAdminModule} from "../../common-app/src/ui/redux/accounts-admin/accounts-admin.module";
import {LoginActions} from "../../common-app/src/ui/redux/login/login-actions.class";

@Injectable()
export class ReduxModules {
  constructor(
    private connectModule:ConnectModule,
    private loginModule:LoginModule,
    private modalModule:ModalModule,
    private accountsAdminModule:AccountsAdminModule,
    private forRealCardsModule:ForRealCardsModule,
    private gamePlayModule:GamePlayModule,
    private usersModule:UsersModule,
    private uploaderModule:UploaderModule,
    private ngRedux: NgRedux<IAppState>,
    private reduxModuleCombiner:ReduxModuleCombiner
  ) {}
  configure() {
    if (Meteor.isDevelopment && false)
      this.reduxModuleCombiner.turnOnConsoleLogging();

    this.reduxModuleCombiner.configure([
      this.connectModule,
      this.loginModule,
      this.modalModule,
      this.accountsAdminModule,
      this.forRealCardsModule,
      this.gamePlayModule,
      this.uploaderModule,
      this.usersModule],
      this.ngRedux);
    LoginActions.watchUser(); // for auto login
  }
}