import { ModalService } from '../../ui-ng2/modal/modal.service.ts';
import {ConfirmModal} from "./confirm.modal";
import {CommonPopupParametersInterface} from "./common-popup-params.interface";
import {AlertModal} from "./alert.modal";

export class CommonPopups {

  
  static alert(messageOrError:any, titleText:string="", okText:string="OK"):void {

    if (typeof messageOrError === 'undefined') {
      messageOrError = {message: "undefined message"};
    }
    
    let message:string;

    if (typeof messageOrError === 'string') {
      message = messageOrError;
    } else {
      if (typeof messageOrError === 'object' && messageOrError.message) {
        message = messageOrError.message;
      } else {
        message = JSON.stringify(messageOrError);
      }
    }

    let params:CommonPopupParametersInterface = {
      titleText: titleText,
      messageText: message,
      okText: okText
    };
    ModalService.open(AlertModal, 'alert-modal', params);
  };

  static confirm(messageText:string, titleText:string="", okText:string="OK", cancelText:string="Cancel"):Promise  {
    let params:CommonPopupParametersInterface = {
      titleText: titleText,
      messageText: messageText,
      cancelText: cancelText,
      okText: okText
    };
    return ModalService.open(ConfirmModal, 'confirm-modal', params);
  }
}


