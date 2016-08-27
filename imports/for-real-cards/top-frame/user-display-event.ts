/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Subscription } from 'rxjs';

import {AccountTools, UserEvent, UserEventType} from '/imports/common-app';

export class UserDisplayEvent {
  displayName:string;
  constructor(displayName:string) {
    this.displayName = displayName;
  }

  static subscribe(onNext:(userDisplayEvent:UserDisplayEvent)=>void):Subscription {
    return UserEvent.loginStatusSubject
    .filter((userEvent:UserEvent)=> {
      return (
        (
          userEvent.eventType === UserEventType.LOGOUT ||
          userEvent.eventType === UserEventType.LOGIN ||
          userEvent.eventType === UserEventType.DISPLAY_NAME_UPDATE
        )
        &&
        ( 
          userEvent.userId === AccountTools.userId()
        )
      );
    })
    .map( (userEvent:UserEvent)=>{
      if (userEvent.eventType === UserEventType.LOGOUT) {
        return new UserDisplayEvent("Not logged in");
      } else  if (userEvent.eventType === UserEventType.LOGIN) {
        return new UserDisplayEvent(AccountTools.getDisplayName(Meteor.user()));
      }
      return new UserDisplayEvent(userEvent.displayName);
    })
    .subscribe(onNext)
  }
}