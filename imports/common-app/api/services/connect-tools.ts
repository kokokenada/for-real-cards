/**
 * Created by kenono on 2016-05-17.
 */
import {Meteor} from 'meteor/meteor';
import {Observable, Subject, Subscription} from 'rxjs'

export enum ConnectEventType {
  CONNECTION_ATTEMPT,
  CONNECT_SUCCESS
}  
  
export class ConnectEvent {
  eventType: ConnectEventType;
  message:string;
  constructor(eventType:ConnectEventType, data:{message?:string}) {
    this.eventType = eventType;
    this.message = data.message;
  }
}
  
export class ConnectTools {
  private static retryPromise:any;
  private static connectionAttempCount = 0;
  private static connectStatusSubject:Subject = new Subject();
  
  static subscribe(onNext:(event:ConnectEvent)=>void, onError:(error:any)=>void=null, onComplete:()=>void=null):Subscription {
    return ConnectTools.connectStatusSubject.subscribe(onNext, onError, onComplete);
  }

  private static pushEvent(event:ConnectEvent):void {
    return ConnectTools.connectStatusSubject.next(event);
  }

  private static pushConnectionAttempt(message:string):void {
    ConnectTools.connectionAttempCount++;
    ConnectTools.pushEvent(new ConnectEvent(
      ConnectEventType.CONNECTION_ATTEMPT,
      {message: message}
    ));
  }
  
  private static pushConnectionSuccess():void {
    ConnectTools.pushEvent(
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

  static checkConnection() {
    if (!ConnectTools.isConnected()) {
      ConnectTools.pushConnectionAttempt("Not connected. Server =" + ConnectTools.getServerURL() + ". Retrying...");
      ConnectTools.retryPromise = Meteor.setInterval(()=> {
        if (ConnectTools.isConnected()) {
          ConnectTools.retryPromise = "";
          ConnectTools.connectionAttempCount = 0;
          Meteor.clearInterval(ConnectTools.retryPromise);
          ConnectTools.retryPromise = null;
          ConnectTools.pushConnectionSuccess();
        } else {
          ConnectTools.pushConnectionAttempt("Not connected. Server = " + Meteor.absoluteUrl() + ". Retry Count(" + ConnectTools.connectionAttempCount + ")");
          Meteor.reconnect();
        }
      }, 5000)
    }
  }

  static stopCheckingConnection() {
    if (ConnectTools.retryPromise)
      Meteor.clearInterval(ConnectTools.retryPromise);
  }

  static setServer():void {
    let url:string = window.prompt("New server address", ConnectTools.getServerURL());
    if (url !== null) {
      localStorage.setItem('server_url', url);
      if (navigator && navigator.app) {
        window.alert("The app will now exit. When you restart, it will use URL: " + url);
        navigator.app.exitApp();
      } else {
        window.alert("Exit the app, restart and then it will use the URL: " + url);
      }
    }
  };
}