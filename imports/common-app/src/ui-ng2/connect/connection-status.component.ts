
import {
  Component,
  NgZone,
  OnInit
} from '@angular/core';

import { select } from 'ng2-redux';

import {IConnectState, ConnectActions} from "../../ui";

@Component({
  selector: 'ca-connection-status',
  template: `
<div 
  *ngIf="!connectState?.connected" 
  class="alert alert-danger"
  (click)="setServer()"
>
  Not connected. Server URL = "{{connectState?.serverURL}}".  Retry count={{connectState?.retryCount}}
</div>
`
})
export class ConnectionStatus implements OnInit {
  @select() connectReducer;
  connectState:IConnectState;
  constructor(private ngZone:NgZone, private connectActions:ConnectActions) {}

  ngOnInit() {
    this.connectActions.checkConnection();
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
      this.connectActions.setServerURL(url);
    }
  };
}
