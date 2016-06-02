/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component } from '@angular/core';

import {NewGame} from './new-game';
import {JoinGame} from './join-game';

@Component({
  selector: 'enter-game',
  directives: [NewGame, JoinGame],
  template: `
      <new-game></new-game>
      <join-game></join-game>
      `
})
export class EnterGame {
}