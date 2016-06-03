
import {CommonPopupParametersInterface} from "./common-popup-params.interface";
import {ModalService} from "../../ui-ng2/modal/modal.service";

export class CommonPopupModal {
  componentParameters:CommonPopupParametersInterface;
  titleText:string;
  messageText:string;
  cancelText:string;
  okText:string;

  ngOnChanges(obj) {
    if (this.componentParameters) {
      this.titleText = this.componentParameters.titleText;
      this.messageText = this.componentParameters.messageText;
      this.okText = this.componentParameters.okText;
      this.cancelText = this.componentParameters.cancelText;
    }
  }
  
  ok() {
    ModalService.close(true);
  }

  cancel() {
    ModalService.close(null);
  }

  no() {
    ModalService.close(false);
  }
}