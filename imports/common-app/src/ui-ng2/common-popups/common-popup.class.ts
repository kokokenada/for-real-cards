
import {CommonPopupParametersInterface} from "./common-popup-params.interface";
import {ModalBase} from "../modal/modal-base";
import {IModalState} from "../../ui/redux/modal/modal.types";

export class CommonPopupModal extends ModalBase<CommonPopupParametersInterface, boolean> {
  componentParameters:CommonPopupParametersInterface;
  titleText:string;
  messageText:string;
  cancelText:string;
  okText:string;

  ngOnInit() {
    this.modalReducer$.subscribe(
      (state:IModalState<CommonPopupParametersInterface, boolean>)=>{
        this.componentParameters = state.params;
        this.titleText = this.componentParameters.titleText;
        this.messageText = this.componentParameters.messageText;
        this.okText = this.componentParameters.okText;
        this.cancelText = this.componentParameters.cancelText;
      }
    );
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