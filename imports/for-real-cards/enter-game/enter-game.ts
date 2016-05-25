import {NewGame} from './new-game'; (NewGame);
import {JoinGame} from './join-game'; (JoinGame);
import { Component } from '@angular/core';

@Component({
  selector: 'welcome',
  controllerAs: 'vm',
  template: `
      <new-game></new-game>
      <join-game></join-game>
      `
})
export class EnterGame {
}