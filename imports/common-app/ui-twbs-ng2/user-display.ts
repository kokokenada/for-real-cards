/**
 * Created by kenono on 2016-05-04.
 */
import {Component} from "./util";
import {Tracker, Computation} from 'meteor/tracker';
import {Meteor} from 'meteor/meteor';
import {User} from '../api/models/user.model';
import {AccountTools} from '../api/services/account-tools';
import {Avatar} from './avatar'; (Avatar)

@Component({
  module: 'common',
  selector: 'userDisplay',
  controllerAs: 'vm',
  controller: UserDisplay,
  bindings: {userId: '@'},
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
  <avatar class="content" user-id="{{vm.userId}}"></avatar>
  <p style="text-align: center">{{vm.displayName()}}</p>
</div>

`,
})

export class UserDisplay {
  private user:User;
  userId:string;
  private computation:Computation;
  $onChanges(changesObj) {
    this.computation.invalidate();
  }
  constructor() {
    Tracker.autorun((computation:Computation)=>{
      this.computation = computation;

      this.user = Meteor.users.findOne({_id: this.userId});
      console.log('udisp')
      console.log(this.user)
    })
  }
  displayName():string {
    return AccountTools.getDisplayNameNoLookup(this.user);
  }
}