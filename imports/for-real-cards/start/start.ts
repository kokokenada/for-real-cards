/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Observable } from 'rxjs';
import { Component } from '@angular/core';

import {AccountTools, Credentials, ConnectTools, ConnectEvent, ConnectEventType} from "../../common-app/api/index";
import {CommonPopups} from "../../common-app/ui-twbs-ng2/index";
import {UserEvent} from "../../common-app/api/models/user-event.class";

@Component({
  templateUrl: '/imports/for-real-cards/start/start.html'
})
export class Start {
  message:string;
  loggingIn:boolean = false;
  registering:boolean = false;
  credentials:Credentials;

  ngOnInit() {
    this.credentials = Credentials.getLastCredentials();
    ConnectTools.subscribe(
      (event:ConnectEvent)=>{
        if (event.retryCount>1)
          this.message = event.message;
      }
    );
    ConnectTools.checkConnection();

  }
  ngOnDestroy() {
    ConnectTools.stopCheckingConnection();
  }

  registerOpenClose() {
    this.registering = !this.registering;
    this.loggingIn = false;
  }

  loginOpenClose() {
    this.loggingIn = !this.loggingIn;
    this.registering = false;
  }

  login() {
    let observable:Observable<UserEvent> = AccountTools.login(this.credentials);
    observable.subscribe(
      (user)=>{
        // Login event will cause navigation to enter screen
      }, (error)=> {
        CommonPopups.alert(error);
      }
    );
  }

  register() {
    AccountTools.register(this.credentials).subscribe(
      ()=>{
        // Login event will cause navigation to enter screen
      }, (error)=>{
        CommonPopups.alert(error);
      }
    );
  }

  tempUser() {
    AccountTools.createTempUser().subscribe(
      ()=>{
        // Login event will cause navigation to enter screen
      }, (error)=>{
        CommonPopups.alert(error);
      }
    );
  }

  setServer() {
    ConnectTools.setServer();
  }
} 