import { Meteor } from 'meteor/meteor';
declare let Package:any; // Couldn't find typings
import { Accounts } from 'meteor/accounts-base';

// Make an abstract parent and children that implement specific backend
// For now, this is Meteor specific
export class ConnectService {

  static isConnected():boolean {
    let status:any = Meteor.status(); // shut up WebStorm
    return status.connected;
  }
  static getServerURL():string {
    return Meteor.absoluteUrl();
  }

  static setServerTo(app_url) {
    Meteor.connection = Meteor.connect(app_url);
    _.each(['subscribe', 'methods', 'call', 'apply', 'status','reconnect','disconnect'], function (name) {
      Meteor[name] = _.bind(Meteor.connection[name], Meteor.connection);
    });
    Package.reload = false;
    Accounts.connection = Meteor.connection;
  }

  static reconnect() {
    Meteor.reconnect();
  }

  static disconnect() {
    Meteor.disconnect();
  }

}