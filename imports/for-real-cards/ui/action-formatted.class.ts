import * as moment from 'moment';
import {AccountTools} from '../../common-app/src/ui/services/account-tools';

import {GamePlayAction, GamePlayActionType, VisibilityType} from "../../for-real-cards-lib";

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
    return AccountTools.getDisplayName(this.creatorId);
  }
  toPlayer():string {
    if (this.toPlayerId)
      return AccountTools.getDisplayName(this.toPlayerId);
  }
  fromPlayer():string {
    if (this.fromPlayerId)
      return AccountTools.getDisplayName(this.fromPlayerId);
  }
  visibilityTypeDescription():string {
    if (this.visibilityType)
      return VisibilityType[this.visibilityType];
  }
}

