/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Injectable, Inject } from '@angular/core';

import { ModalService  } from "../../common-app/ui-twbs-ng2";
import { GameConfig } from "../api";
import {DealModal} from "./deal-modal";

@Injectable()
export class DealModalService {
  open(gameConfig:GameConfig):Promise<GameConfig> {
    return ModalService.open(DealModal, "frc-deal-modal", {gameConfig: gameConfig});
  }
}
