/**
 * Created by kenono on 2016-04-23.
 */
import { Component, Input } from '@angular/core';
import {  UserEvent, UserEventType } from "../api"
import { Subscription } from 'rxjs'
import * as log from 'loglevel';

@Component({
  selector: 'avatar',
  template: `
    <img [src]="getImageUrl()" [ngStyle]="getImageStyles()"/>
`,
})

export class Avatar {
  @Input() private userId:string;
  @Input() private size:string = 'medium';
  @Input() private shape:string = 'round';
  private imageURL:string;
  disposable:Subscription;

  constructor() {
  }

  ngOnInit() {
    this.disposable = UserEvent.startObserving((event:UserEvent)=>{
      if (event.eventType===UserEventType.AVATAR_UPDATE && event.userId===this.userId) {
        this.imageURL = event.imageURL;
      }
    });
  }
  ngOnDestroy() {
    if (this.disposable) {
      this.disposable.unsubscribe();
    }
  }
  
  getImageUrl():string {
    return this.imageURL;
  }

  getImageStyles():any {
    if (this.shape==='round') {
      return {'border-radius': '50%', height: '100%', width: '100%', 'object-fit': 'contain'};
    } else if (this.shape==="rectangle") {
      return {height: '100%', width: '100%', 'object-fit': 'contain'};
    }
    return {width: '100%'};
  }

  // Get the initials of the user (from https://github.com/meteor-utilities/avatar/)

  private getInitials(user):string {
    var initials = '';
    var name = '';
    var parts = [];

    if (user && user.profile && user.profile.firstName) {
      initials = user.profile.firstName.charAt(0).toUpperCase();

      if (user.profile.lastName) {
        initials += user.profile.lastName.charAt(0).toUpperCase();
      }
      else if (user.profile.familyName) {
        initials += user.profile.familyName.charAt(0).toUpperCase();
      }
      else if (user.profile.secondName) {
        initials += user.profile.secondName.charAt(0).toUpperCase();
      }
    }
    else {
      if (user && user.profile && user.profile.name) {
        name = user.profile.name;
      }
      else if (user && user.username) {
        name = user.username;
      }

      parts = name.split(' ');
      // Limit getInitials to first and last initial to avoid problems with
      // very long multi-part names (e.g. "Jose Manuel Garcia Galvez")
      initials = _.first(parts).charAt(0).toUpperCase();
      if (parts.length > 1) {
        initials += _.last(parts).charAt(0).toUpperCase();
      }
    }

    return initials;
  }

}