/**
 * Created by kenono on 2016-05-03.
 */
import {User} from '../../api/models/user.model';
import {Subject } from 'rxjs';
import {AccountTools} from '../../api/services/account-tools';
import {_} from 'meteor/underscore'
import {Roles} from 'meteor/alanning:roles'
import {Meteor} from 'meteor/meteor'

export class AccountsModal  {
  static user:User;
  protected _error:string;
  private $scope:any;

  constructor($scope) {
    super();
    this.$scope = $scope;
  }

  protected static _open(user:User, me:any):Subject {
    AccountsModal.user = user;
    return me.open();
  }
  
  get error():string {
    return this._error;
  }
  
  allRoles():string[] {
    return _.pluck(Roles.getAllRoles().fetch(), "name");
  }

  displayName():string {
    return AccountTools.getDisplayName(AccountsModal.user._id);
  }

  timeoutApply():void {
    Meteor.setTimeout(()=>{this.$scope.$apply()}, 0)
  }
}
