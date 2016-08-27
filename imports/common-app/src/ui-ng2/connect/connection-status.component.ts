/*
import {
  Component,
  Input,
} from '@angular/core';

import {IConnectState, ConnectActions} from "../../api";

@Component({
  selector: 'ca-connection-status',
  template: `
<div 
  *ngIf="!connectState.connected" 
  class="alert alert-danger"
  (click)="setServer()"
>
  Not connected. Server URL = "{{connectState.serverURL}}".  Retry count={{connectState.retryCount}}
</div>
`
})
export class ConnectionStatus {
  @Input connectState:IConnectState;

  constructor(private connectActions:ConnectActions) {}

  // Set server to user specified value.  Not a real feature - just a back door for debugging
  setServer():void {
    let url:string = window.prompt("New server address", this.connectState.serverURL);
    if (url !== null) {
      localStorage.setItem('server_url', url);
      this.connectActions.setServerURL(url);
    }
  };
}
*/