import { Injectable } from '@angular/core';
import { IPayloadAction  } from '../action.interface';

import { ModalService } from "./modal.service";
import { ModalActions } from "./modal-actions.class";
import {IModalActionPayload, IModalState} from "./modal.types";

@Injectable()
export class ModalAsync {
  constructor(private actions: ModalActions, private modalService:ModalService) {
  }

  modalMiddleware = (state: IModalState) => next => (action: IPayloadAction) => {
    let payload: IModalActionPayload = action.payload;
    switch (action.type) {
      case ModalActions.MODAL_OPEN: {
        this.modalService.open(payload.component);
      }
    }
  }
}
