/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component, NgZone } from '@angular/core';
import { select } from 'ng2-redux';
import * as log from 'loglevel';

//import * as templateTWBS from './start.twbs.html';  //This also works and doesn't cause webstorm to complain
//import * as templateIonic from './start.ionic.html';
//  template: PlatformTools.isIonic() ? templateIonic.default.toString() : templateTWBS.default.toString(),
import templateTWBS from './start.twbs.html';
import templateIonic from './start.ionic.html';
import {PlatformTools} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";
import {ILoginState} from "../../common-app/src/ui/redux/login/login.types";
import {LoginActions} from "../../common-app/src/ui/redux/login/login-actions.class";
import {Credentials} from "../../common-app/src/ui/services/credentials";
import {IConnectState} from "../../common-app/src/ui/redux/connect/connect.types";


@Component({
  template: PlatformTools.isIonic() ? templateIonic : templateTWBS,
  selector: 'start'
})
export class Start {
  @select() loginReducer;
  @select() connectReducer;
  state:ILoginState;
  connectionState:IConnectState;
  credentials:Credentials;
  active:boolean = true;
  constructor(private ngZone:NgZone) {}
  ngOnInit() {
    this.loginReducer.subscribe( (state:ILoginState)=>{  /// Hmm.  Is there a way of doing this automatically?
      this.state = state;
    });
    this.connectReducer.subscribe( (state:IConnectState)=>{
      this.ngZone.run( ()=>{
        this.connectionState = state;
      } );
      }
    );
    this.credentials = Credentials.getLastCredentials();
    log.debug("in ngOnInit() of Start. this.PlatformTools.platformNameSegment()=" + PlatformTools.platformNameSegment())
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
    LoginActions.login(this.credentials);
  }

  register() {
    LoginActions.register(this.credentials)
  }

  tempUser() {
    LoginActions.loginAsTemporaryUser()
  }

  debug():void {
    console.log(this);
  }

} 