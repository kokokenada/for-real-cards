/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Injectable, Inject } from '@angular/core';
import { Subject } from "rxjs";

import { ModalService, MODAL_PROVIDERS } from "../../common-app/ui-twbs-ng2";
import { GameConfig } from "../api";
import {DealModal} from "./deal-modal";
import {ModalEvent} from "../../common-app/ui-ng2/modal/modal-event.class";


@Injectable()
export class DealModalService {
  constructor(private modalService:ModalService) {
    
  }
  open(gameConfig:GameConfig):Subject<ModalEvent> {
    return this.modalService.open(DealModal, "frc-deal-modal", {gameConfig: gameConfig});
  }
}

export let DEAL_MODAL_PROVIDERS:any[] = MODAL_PROVIDERS.concat([DealModalService]);
