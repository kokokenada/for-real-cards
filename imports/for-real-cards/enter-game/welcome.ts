import 'angular';
import {NewGame} from './new-game'; (NewGame);
import {JoinGame} from './join-game'; (JoinGame);
import {Component} from '../../common/ui-twbs_ng15/util';

@Component({
  module: 'fastcards',
  selector: 'welcome',
  controller: Welcome,
  controllerAs: 'vm',
  template: `
      <new-game></new-game>
      <join-game></join-game>
      `
})
export class Welcome {
}