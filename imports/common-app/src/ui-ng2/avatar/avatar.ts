/**
 * Created by kenono on 2016-04-23.
 */
import { Component, Input, NgZone } from '@angular/core';
import { select } from '@angular-redux/store';
import { User } from "../../../../common-app-api/src/api/models/user.model";
import { IUsersState } from "../../ui/redux/users/users.types";

@Component({
  selector: 'avatar',
  template: `
    <img [src]="getImageUrl()" [ngStyle]="getImageStyles()"/>
`,
})

export class Avatar {
  @select() usersReducer;
  @Input() private userId:string;
  @Input() private size:string = 'medium';
  @Input() private shape:string = 'round';

  constructor(private ngZone:NgZone){}

  private imageURL:string;

  ngOnInit() {
    this.usersReducer.subscribe( (usersState:IUsersState)=>{
      this.ngZone.run(()=>{
        this.imageURL = User.getAvatarURL( usersState.users.get(this.userId) );
      });
    } );

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

}