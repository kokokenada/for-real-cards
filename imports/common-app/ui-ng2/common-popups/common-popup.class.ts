
import {CommonPopupParametersInterface} from "./common-popup-params.interface";
import {ModalBase} from "../modal/modal-base.class";

export class CommonPopupModal extends ModalBase {
  componentParameters:CommonPopupParametersInterface;
  titleText:string;
  messageText:string;
  cancelText:string;
  okText:string;

  onModalInit(componentParameters:CommonPopupParametersInterface) {
    this.componentParameters = componentParameters;
    this.titleText = this.componentParameters.titleText;
    this.messageText = this.componentParameters.messageText;
    this.okText = this.componentParameters.okText;
    this.cancelText = this.componentParameters.cancelText;
  }
  
  ok() {
    this.close(true);
  }

  cancel() {
    this.close(null);
  }

  no() {
    this.close(false);
  }
  
  static messageOrErrorToText(messageOrError:any):string {
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
    return message;
  }
}