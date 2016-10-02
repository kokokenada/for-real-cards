/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Injectable } from '@angular/core';
import {NgRedux} from "ng2-redux";

import {ForRealCardsModule, ForRealCardsActions, GamePlayModule, IForRealCardsActionPayload} from "../ui";
import {ReduxModuleCombiner} from "../../common-app/src/ui/redux/redux-module-combiner";
import {LoginModule} from "../../common-app/src/ui/redux/login/login.module";
import {ConnectModule} from "../../common-app/src/ui/redux/connect/connect.module";
import {UsersModule} from "../../common-app/src/ui/redux/users/users.module";
import {IAppState} from "../../common-app/src/ui/redux/state.interface";
import {UploaderModule} from "../../common-app/src/ui/redux/uploader/uploader.module";
import {ModalModule} from "../../common-app/src/ui/redux/modal/modal.module";

@Injectable()
export class ReduxModules {
  constructor(
    private connectModule:ConnectModule,
    private loginModule:LoginModule,
    private modalModule:ModalModule,
    private forRealCardsModule:ForRealCardsModule,
    private gamePlayModule:GamePlayModule,
    private usersModule:UsersModule,
    private uploaderModule:UploaderModule,
    private ngRedux: NgRedux<IAppState>,
    private reduxModuleCombiner:ReduxModuleCombiner
  ) {}
  configure() {
    if (Meteor.isDevelopment)
      this.reduxModuleCombiner.turnOnConsoleLogging();

    this.reduxModuleCombiner.configure([
      this.connectModule,
      this.loginModule,
      this.modalModule,
      this.forRealCardsModule,
      this.gamePlayModule,
      this.uploaderModule,
      this.usersModule],
      this.ngRedux);
    this.loginModule.actions.watchUser(); // for auto login
  }
}