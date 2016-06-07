/**
 * Created by kenono on 2016-05-04.
 */
import { Component, Input } from '@angular/core';

import { User } from '../api/models/user.model';
import { UserEvent, UserEventType }  from '../api/index';
import { Avatar } from './avatar';

@Component({
  selector: 'user-display',
  directives: [Avatar],
  template: `

<style>
  .box {
    position: relative;
    width:    100%; /* desired width */
  }

  .box:before {
    content:     "";
    display:     block;
    padding-top: 100%; /* initial ratio of 1:1*/
  }

  .content {
    position: absolute;
    top:      0;
    left:     0;
    bottom:   0;
    right:    0;
    width:100%
  }

</style>
<div class="box">
  <avatar class="content" [userId]="{{userId}}"></avatar>
  <p style="text-align: center">{{displayName}}</p>
</div>

`,
})

export class UserDisplay {
  private user:User;
  displayName:string;
  @Input() userId:string;
  constructor() {
    UserEvent.subscribe((userEvent:UserEvent)=>{
      if (userEvent.eventType===UserEventType.DISPLAY_NAME_UPDATE) {
        this.displayName = userEvent.displayName;
      }
    });
  }
}