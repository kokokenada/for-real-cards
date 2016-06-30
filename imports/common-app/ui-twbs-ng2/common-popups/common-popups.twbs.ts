import { ModalService } from '../../ui-ng2/modal/modal.service.ts';
import {ConfirmModal} from "./confirm.modal";
import {CommonPopupParametersInterface} from "../../ui-ng2/common-popups/common-popup-params.interface";
import {AlertModal} from "./alert.modal";
import {CommonPopupModal} from "../../ui-ng2/common-popups/common-popup.class";

export class CommonPopups {

  
  static alert(messageOrError:any, titleText:string="", okText:string="OK"):void {
    
    let message = CommonPopupModal.messageOrErrorToText(messageOrError);

    let params:CommonPopupParametersInterface = {
      titleText: titleText,
      messageText: message,
      okText: okText
    };
    ModalService.open(AlertModal, 'alert-modal', params);
  };

  static confirm(messageText:string, titleText:string="", okText:string="OK", cancelText:string="Cancel"):Promise<boolean>  {
    let params:CommonPopupParametersInterface = {
      titleText: titleText,
      messageText: messageText,
      cancelText: cancelText,
      okText: okText
    };
    return ModalService.open(ConfirmModal, 'confirm-modal', params);
  }
}


