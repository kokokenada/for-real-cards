import { Injectable } from '@angular/core';
//import { require } from 'meteor/modules'
declare var require:any;
import {PlatformTools} from "../platform-tools/platform-tools";
import {ModalActions} from "../../ui/redux/modal/modal-actions.class";
import {CommonPopupParametersInterface} from "./common-popup-params.interface";
import {CommonPopupModal} from "./common-popup.class";
import {ModalService} from "../../ui/redux/modal/modal.service";

@Injectable()
export class CommonPopups {
  constructor(private modalService:ModalService) {
    CommonPopups.init();
  }
  private static instance;
  private static init() {
    if (!CommonPopups.instance) {
      // This should happen at build time.  How to???
      if (PlatformTools.isIonic()) {
        CommonPopups.instance = require('../../ui-ionic/common-popups/common-popups.ionic');
      } else if (PlatformTools.isTWBS()) {
        CommonPopups.instance = require('../../ui-twbs-ng2/common-popups/common-popups.twbs');
      } else {
        throw "unsupported Platform in CommonPopups";
      }
    }
  }
  alert(messageOrError, titleText:string="", okText:string="OK"):void {
    let message = CommonPopupModal.messageOrErrorToText(messageOrError);

    let params:CommonPopupParametersInterface = {
      titleText: titleText,
      messageText: message,
      okText: okText
    };

    ModalActions.openRequest(CommonPopups.instance.AlertModal, params);
  }
  confirm(messageText:string, titleText:string="", okText:string="OK", cancelText:string="Cancel"):Promise<boolean> {
    let params:CommonPopupParametersInterface = {
      titleText: titleText,
      messageText: messageText,
      cancelText: cancelText,
      okText: okText
    };
    return this.modalService.asPromise(CommonPopups.instance.Confirm, params);
  }
}