/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Observable } from 'rxjs';
import { Component } from '@angular/core';

import {AccountTools, Credentials, ConnectTools, ConnectEvent, ConnectEventType} from "../../common-app/api";
import {CommonPopups} from "../../common-app/ui-twbs-ng2";

@Component({
  template: `
        <div class='xs-col-12'>
          <div [hidden]="message ? false : true" (click)="setServer()" class="alert alert-danger" role="alert">
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            {{message}} 
            <br/>
            Tap to change server.
          </div>
          <button type="button" (click)="registerOpenClose()" class="btn btn-default btn-block">
            Sign Up
          </button>
           
            <form role="form" [hidden]='!registering'>
              <div class="panel-heading">
                <h3 class="panel-title">Register</h3>
              </div>
              <div class="panel-body">
                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="username">Username:</label>
                    <input [(ngModel)]="credentials.username" type="text" class="form-control" id="username">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="email">Email</label><span> (optional)</span>
                    <input [(ngModel)]="credentials.email" type="text" class="form-control" id="email">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="password">Password</label><span> (optional)</span>
                    <input [(ngModel)]="credentials.password" type="password" class="form-control" id="password">
                  </div>
                  <div class="form-group col-md-6">                    
                    <button (click)="register()" class="btn btn-primary pull-right">OK, Let's Play</button> 
                  </div>
                </div>
              </div>
            </form>

          <button type="button" (click)="loginOpenClose()" class="btn btn-default btn-block">
            Login
          </button>
          
            <form role="form" [hidden]='!loggingIn'>
              <div class="panel-heading">
                <h3 class="panel-title">Login</h3>
              </div>
              <div class="panel-body">
                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="username">Username:</label>
                    <input [(ngModel)]="credentials.username" type="text" class="form-control" id="username">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="email">Email</label><span> (optional)</span>
                    <input [(ngModel)]="credentials.email" type="text" class="form-control" id="email">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="password">Password</label><span> (optional)</span>
                    <input [(ngModel)]="credentials.password" type="password" class="form-control" id="password">
                  </div>
                  <div class="form-group col-md-6">                    
                    <button (click)="login()" class="btn btn-primary pull-right">OK, Let's Play</button> 
                  </div>

                </div>
              </div>
            </form>

          
          <button type="button" (click)="tempUser()" class="btn btn-default btn-block">
            Nah, Just Play
          </button>
        </div>
      `
})
export class Start {
  message:string;
  loggingIn:boolean = false;
  registering:boolean = false;
  credentials:Credentials;

  constructor() {
    this.credentials = Credentials.getLastCredentials();
    ConnectTools.subscribe(
      (event:ConnectEvent)=>{
        this.message = event.message;
      }
    );
    ConnectTools.checkConnection();
//    $scope.$on('$destroy', function () {
//      ConnectTools.stopCheckingConnection();
//    });
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
    let observable:Observable = AccountTools.login(this.credentials);
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