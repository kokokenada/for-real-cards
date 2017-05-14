
import {
  Component,
  NgZone,
  OnInit
} from '@angular/core';

import { select } from '@angular-redux/store';

import {IConnectState, ConnectActions, CONNECT_PACKAGE_NAME} from 'common-app'
declare const window: any;
declare const localStorage: any;

@Component({
  selector: 'ca-connection-status',
  template: `
<div 
  *ngIf="!connectState?.connected && connectState?.connecting && connectState?.retryCount>1" 
  class="alert alert-danger"
  (click)="setServer()"
>
  Not connected. Server URL = "{{connectState?.serverURL}}".  Retry count={{connectState?.retryCount}}
</div>
`
})
export class ConnectionStatus implements OnInit {
  @select(CONNECT_PACKAGE_NAME) connectReducer;
  connectState:IConnectState;
  constructor(private ngZone:NgZone) {}

  ngOnInit() {
    ConnectActions.checkConnection();
    this.connectReducer.subscribe( (state:IConnectState)=>{
      this.ngZone.run( ()=> {
        this.connectState = state;
      });
    });
  }


  // Set server to user specified value.  Not a real feature - just a back door for debugging
  setServer():void {
    let url:string = window.prompt("New server address", this.connectState.serverURL);
    if (url !== null) {
      localStorage.setItem('server_url', url);
      ConnectActions.setServerURL(url);
    }
  };
}
