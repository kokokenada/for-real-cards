/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Observable } from 'rxjs';
import { Component } from '@angular/core';

import {AccountTools, Credentials, ConnectEvent, ConnectEvent, ConnectEventType} from "../../common-app/api/index";
import {CommonPopups} from "../../common-app/ui-twbs-ng2/index";
import {UserEvent, UserEventType} from "../../common-app/api/models/user-event.class";

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
    ConnectEvent.subscribe(
      (event:ConnectEvent)=>{
        if (event.eventType===ConnectEventType.CONNECTION_ATTEMPT && event.retryCount>1)
          this.message = event.message;
        else if (event.eventType===ConnectEventType.CONNECT_SUCCESS)
          this.message = "";
        else if (event.eventType===ConnectEventType.USER_LOGIN)
          UserEvent.pushEvent(new UserEvent(UserEventType.LOGIN, {userId: Meteor.userId()})); // Will cause navigation
      }
    );
    ConnectEvent.checkConnection();

  }
  ngOnDestroy() {
    ConnectEvent.stopCheckingConnection();
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
    ConnectEvent.setServer();
  }
} 