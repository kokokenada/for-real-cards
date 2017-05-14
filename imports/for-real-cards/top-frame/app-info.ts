
import {Component} from '@angular/core';
import {select} from '@angular-redux/store';
import {
  CONNECT_PACKAGE_NAME,
  IConnectState,
  ILoginState,
  LOGIN_PACKAGE_NAME
} from 'common-app';

@Component({
  selector: 'app-info',
  template: `
<div>
  <h1>Application Info</h1>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Info</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Is Connected</td>
        <td>{{connectionState.connected }}</td>
      </tr>
      <tr>
        <td>Server URL</td>
        <td>{{connectionState.serverURL }}</td>
      </tr>
      <tr>
        <td>Logged In</td>
        <td>{{loginState.loggedIn }}</td>
      </tr>
      <tr>
        <td>User Id</td>
        <td>{{loginState.userId }}</td>
      </tr>
      <tr>
        <td>User Name</td>
      <td>{{loginState.displayName }}</td>
      </tr>
    </tbody>
  </table>
</div>
`
})
export class AppInfo {
  @select(LOGIN_PACKAGE_NAME) loginReducer$;
  @select(CONNECT_PACKAGE_NAME) connectReducer$;
  loginState: ILoginState;
  connectionState: IConnectState;


  ngOnInit() {
    this.loginReducer$.subscribe((state: ILoginState) => {  /// Hmm.  Is there a way of doing this automatically?
      console.log(state)
      this.loginState = state;
    });
    this.connectReducer$.subscribe((state: IConnectState) => {
      console.log(state)
      this.connectionState = state;
    });
  }
}