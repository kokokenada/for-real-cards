/**
 * Created by kenono on 2016-04-23.
 */
import { Component, Input, NgZone } from '@angular/core';
import { select } from '@angular-redux/store';
import {ILoginState, IUser, LOGIN_PACKAGE_NAME, LoginFunctions} from 'common-app';
import { IUsersState } from "../../ui/redux/users/users.types";

@Component({
  selector: 'avatar',
  template: `
    <img [src]="getImageUrl()" [ngStyle]="getImageStyles()"/>
`,
})

export class Avatar {
  @select() usersReducer;
  @select(LOGIN_PACKAGE_NAME) loginState$;
  loginState:ILoginState;
  @Input() private userId:string;
  @Input() private size:string = 'medium';
  @Input() private shape:string = 'round';

  constructor(private ngZone:NgZone){}

  private imageURL:string;

  ngOnInit() {
    this.loginState$.subscribe ( (newLoginState: ILoginState) => {
      this.loginState = newLoginState;
    });

    this.usersReducer.subscribe( (usersState:IUsersState)=>{
      this.ngZone.run(()=>{
        let user = usersState.users.get(this.userId);
        this.imageURL = LoginFunctions.getAvatarURL(user, this.loginState.defaultAvatar);
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