
import {IConnectService} from 'common-app';
import * as firebase from 'firebase/app';
import App = firebase.app.App;

export class ConnectServiceFirebase implements IConnectService {

  constructor(private firebase: App) {
  }

  async isConnected(): Promise<boolean> {
    return new Promise<boolean>( (resolve)=>{
      this.firebase.database().ref().child('.info/connected').on('value',
        (connectedSnap) => {
          if (connectedSnap.val() === true) {
            /* we're connected! */
            resolve(true);
          } else {
            /* we're disconnected! */
            resolve(false);
          }
        })

    });
  }


  getServerURL(): string {
    return this.firebase.database().ref().toString();
  }

  setServerTo(app_url) {
    throw 'not implemented';
  }

  reconnect() {
    console.warn('firebase reconnect a no-op')
  }

  disconnect() {
  }

}