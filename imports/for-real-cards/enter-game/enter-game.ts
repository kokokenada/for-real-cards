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