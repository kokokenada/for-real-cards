import {ModalActions} from "../../ui/redux/modal/modal-actions.class";

export abstract class ModalBase {
  modalActionsBase:ModalActions;
  constructor(modalActions:ModalActions) { // TODO: Is there a way to get this automatically instead of making child classes pass it?
    this.modalActionsBase = modalActions;
  }

  close(payload:any=undefined) {
    this.modalActionsBase.resolve(payload);
  }
}
