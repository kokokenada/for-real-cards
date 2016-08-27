import * as moment from 'moment';
import {AccountTools} from '/imports/common-app';



import {Action, ActionType, VisibilityType} from "../api/models/action.model";

export class ActionFormatted extends Action {

  actionDescription():string {
    return ActionType[this.actionType];
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

