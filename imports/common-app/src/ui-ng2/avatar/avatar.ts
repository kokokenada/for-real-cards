/**
 * Created by kenono on 2016-04-23.
 */
import { Component, Input, NgZone } from '@angular/core';
import { select } from '@angular-redux/store';
import {ILoginState, IUsersState, LOGIN_PACKAGE_NAME, LoginFunctions, USERS_PACKAGE_NAME} from 'common-app';
import {StaticResources} from '../../../../for-real-cards-lib/services/static-resources';

@Component({
  selector: 'avatar',
  template: `
    <img [src]="getImageUrl()" [ngStyle]="getImageStyles()"/>
`,
})

export class Avatar {
  @select(USERS_PACKAGE_NAME) usersReducer;
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
        this.imageURL = LoginFunctions.getAvatarURL(user, StaticResources.instance.getURL('default-avatar.png'));
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