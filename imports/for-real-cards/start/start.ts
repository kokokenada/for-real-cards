/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component } from '@angular/core';
//import { NgForm }    from '@angular/common';

import {AccountTools, Credentials, ConnectEvent, ConnectEventType} from "../../common-app/api/index";
import {UserEvent, UserEventType} from "../../common-app/api/models/user-event.class";

@Component({
  templateUrl: '/imports/for-real-cards/start/start.html'
})
export class Start {
  message:string;
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

  login() {
    AccountTools.login(this.credentials).then(
      (user)=>{
        // Login event will cause navigation to enter screen
      }, (error)=> {
        this.message = error.message;
      }
    );
  }

  register() {
    AccountTools.register(this.credentials).then(
      (user)=>{
        // Login event will cause navigation to enter screen
      }, (error)=>{
        this.message = error.message;
      }
    );
  }

  tempUser() {
    AccountTools.createTempUser().then(
      (user)=>{
        // Login event will cause navigation to enter screen
      }, (error)=>{
        this.message = error.message;
      }
    );
  }

  setServer() {
    ConnectEvent.setServer();
  }
} 