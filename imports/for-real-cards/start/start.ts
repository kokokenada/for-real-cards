/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component } from '@angular/core';
import { select } from 'ng2-redux';
import * as log from 'loglevel';

import {LoginActions, Credentials, ConnectEvent, ConnectEventType, PlatformTools, UserEvent, UserEventType} from '../../common-app';

//import * as templateTWBS from './start.twbs.html';  //This also works and doesn't cause webstorm to complain
//import * as templateIonic from './start.ionic.html';
//  template: PlatformTools.isIonic() ? templateIonic.default.toString() : templateTWBS.default.toString(),
import templateTWBS from './start.twbs.html';
import templateIonic from './start.ionic.html';
import {loginReducer} from "../../common-app/src/ui/redux/login/login-reducer";
import {ILoginState} from "../../common-app/src/ui/redux/login/login.types";


@Component({
  template: PlatformTools.isIonic() ? templateIonic : templateTWBS,
  selector: 'start'
})
export class Start {
  @select() loginReducer;
  state:ILoginState;
  credentials:Credentials;
  active:boolean = true;
  constructor(private loginActions:LoginActions) {}
  ngOnInit() {
    this.loginReducer.subscribe( (state:ILoginState)=>{  /// Hmm.  Is there a way of doing this automatically?
      this.state = state;
    });
    this.credentials = Credentials.getLastCredentials();
    log.debug("in ngOnInit() of Start. this.PlatformTools.platformNameSegment()=" + PlatformTools.platformNameSegment())
    ConnectEvent.subscribe(
      (event:ConnectEvent)=>{
        if (event.eventType===ConnectEventType.CONNECTION_ATTEMPT && event.retryCount>1) {}
          //this.message = event.message;
        else if (event.eventType===ConnectEventType.CONNECT_SUCCESS) {}
          //this.message = "";
        else if (event.eventType===ConnectEventType.USER_LOGIN) {
          log.debug("ConnectEventType.USER_LOGIN event detected, pushing login event");
          UserEvent.pushEvent(new UserEvent(UserEventType.LOGIN, {userId: Meteor.userId()})); // Will cause navigation
        }
      }
    );
    ConnectEvent.checkConnection();

  }
  ngOnDestroy() {
    ConnectEvent.stopCheckingConnection();
  }

  ngAfterContentInit() {
    this.reset();
  }
  
  private reset() {
    this.active = false;  // Forces reset as per https://angular.io/docs/ts/latest/guide/forms.html
                          // This is a temporary workaround while we await a proper form reset feature.
    setTimeout(()=> this.active=true, 0);
  }

  login() {
    this.loginActions.login(this.credentials);
  }

  register() {
    this.loginActions.register(this.credentials)
  }

  tempUser() {
    this.debug()
//    this.loginActions.loginAsTemporaryUser()
  }
//        this.message = error.message; TODO: Figure out how to display login errors

  setServer() {
    ConnectEvent.setServer();
  }

  debug():void {
    console.log(this);
  }

} 