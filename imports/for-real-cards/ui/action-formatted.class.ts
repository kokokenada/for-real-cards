import * as moment from 'moment';

import {GamePlayAction, GamePlayActionType, VisibilityType} from "../../for-real-cards-lib";
import {UsersFunctions} from '../../common-app/src/ui/redux/users/users-functions';

export class ActionFormatted extends GamePlayAction {

  actionDescription():string {
    return GamePlayActionType[this.actionType];
  }
  actionTime():string {
    if (!this.dateCreated)
      return "";
    return moment(this.dateCreated).format("HH:mm:ss:SSS");
  }
  creator():string {
    return UsersFunctions.displayName(this.creatorId);
  }
  toPlayer():string {
    if (this.toPlayerId)
      return UsersFunctions.displayName(this.toPlayerId);
  }
  fromPlayer():string {
    if (this.fromPlayerId)
      return UsersFunctions.displayName(this.fromPlayerId);
  }
  visibilityTypeDescription():string {
    if (this.visibilityType)
      return VisibilityType[this.visibilityType];
  }
}

