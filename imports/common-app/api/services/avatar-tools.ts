/**
 * Created by kenono on 2016-05-16.
 */
import { User } from "../models/user.model";
import {Meteor} from 'meteor/meteor';

export class AvatarTools {

  static getAvatarURL(user:User, size:string="thumb"):string {
    if (!user) {
      return AvatarTools.defaultAvatarUrl();
    }
    let profile = user.profile;
    if (!profile)
      return AvatarTools.defaultAvatarUrl();
    
    let file = profile['avatar-' + size];
    if (!file) {
      file = profile['avatar-medium'];
    }
    if (!file) {
      return AvatarTools.defaultAvatarUrl();
    }
    return file;
  }

  static defaultAvatarUrl() {
    return Meteor.absoluteUrl('default-avatar.png');
  };

}