import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Subject, Subscription } from 'rxjs'

declare let localStorage:any;
declare let window:any;
declare let navigator:any;

export enum ConnectEventType {
  CONNECTION_ATTEMPT,
  CONNECT_SUCCESS,
  USER_LOGIN // Might be automatic login based on cached credentials
}  
  
export class ConnectEvent {
  private static retryPromise:any;
  private static connectionAttempCount = 0;
  private static connectStatusSubject:Subject<ConnectEvent> = new Subject();
  private static computation:Tracker.Computation;

  eventType: ConnectEventType;
  message:string;
  retryCount: number;
  constructor(eventType:ConnectEventType, data:{message?:string, retryCount?:number}={}) {
    this.eventType = eventType;
    this.message = data.message;
    this.retryCount = data.retryCount;
  }

  static subscribe(onNext:(event:ConnectEvent)=>void, onError:(error:any)=>void=null, onComplete:()=>void=null):Subscription {
    return ConnectEvent.connectStatusSubject.subscribe(onNext, onError, onComplete);
  }

  private static pushEvent(event:ConnectEvent):void {
    return ConnectEvent.connectStatusSubject.next(event);
  }

  private static pushConnectionAttempt(message:string, retryCount:number):void {
    ConnectEvent.connectionAttempCount++;
    ConnectEvent.pushEvent(new ConnectEvent(
      ConnectEventType.CONNECTION_ATTEMPT,
      {message: message, retryCount: retryCount}
    ));
  }
  
  private static pushConnectionSuccess():void {
    ConnectEvent.pushEvent(
      new ConnectEvent(
        ConnectEventType.CONNECT_SUCCESS, {}
      )
    );
  }

  static isConnected():boolean {
    return Meteor.status().connected;
  }

  static getServerURL():string {
    return Meteor.absoluteUrl();
  }
  
  private static checkLoggedIn():void {
    Tracker.autorun((computation:Tracker.Computation)=> {
      ConnectEvent.computation = computation;
      let userId = Meteor.userId();
      if (userId!==null && ConnectEvent.isConnected()) {
        ConnectEvent.pushEvent(new ConnectEvent(ConnectEventType.USER_LOGIN))
      }
    });
  } 

  static checkConnection() {
    ConnectEvent.checkLoggedIn();
    if (!ConnectEvent.isConnected()) {
      ConnectEvent.pushConnectionAttempt(
        "Not connected. Server =" + ConnectEvent.getServerURL() + ". Retrying...",
        ConnectEvent.connectionAttempCount
      );
      ConnectEvent.retryPromise = Meteor.setInterval(()=> {
        if (ConnectEvent.isConnected()) {
          ConnectEvent.connectionAttempCount = 0;
          Meteor.clearInterval(ConnectEvent.retryPromise);
          ConnectEvent.retryPromise = null;
          ConnectEvent.pushConnectionSuccess();
        } else {
          ConnectEvent.pushConnectionAttempt(
            "Not connected. Server = " + Meteor.absoluteUrl() + ". Retry Count(" + ConnectEvent.connectionAttempCount + ")",
            ConnectEvent.connectionAttempCount
          );
          Meteor.reconnect();
        }
      }, 5000)
    }
  }

  static stopCheckingConnection() {
    if (ConnectEvent.retryPromise) {
      Meteor.clearInterval(ConnectEvent.retryPromise);
      ConnectEvent.retryPromise = null;
    }
    if (ConnectEvent.computation) {
      ConnectEvent.computation.stop();
      ConnectEvent.computation = null;
    }
  }

  static setServer():void {
    let url:string = window.prompt("New server address", ConnectEvent.getServerURL());
    if (url !== null) {
      localStorage.setItem('server_url', url);
      ConnectEvent.setServerTo(url);
    }
  };

  static setServerTo(app_url) {
    Meteor.connection = Meteor.connect(app_url);
    _.each(['subscribe', 'methods', 'call', 'apply', 'status','reconnect','disconnect'], function (name) {
      Meteor[name] = _.bind(Meteor.connection[name], Meteor.connection);
    });
    Package.reload = false;
    Accounts.connection = Meteor.connection;
  }
}

