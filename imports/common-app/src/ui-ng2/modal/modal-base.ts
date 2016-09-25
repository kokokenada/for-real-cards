import {ModalActions} from "../../ui/redux/modal/modal-actions.class";

export abstract class ModalBase {
  modalActionsBase:ModalActions;
  constructor(modalActions:ModalActions) {
    this.modalActionsBase = modalActions;
  }

  close(payload:any=undefined) {
    this.modalActionsBase.resolve(payload);
  }
}
