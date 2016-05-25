/**
 * Created by kenono on 2016-05-08.
 */

import {Component} from "../../common/ui-twbs_ng15/util";
import {RunGameHandAndTable} from "./run-game-hand-and-table"; (RunGameHandAndTable)
import {RunGameHand} from "./run-game-hand"; (RunGameHand)
import {RunGameTable} from "./run-game-table"; (RunGameTable);

@Component(
  {
    module: 'fastcards',
    selector: 'runGameTabs',
    template: `
  <uib-tabset active="active">
    <uib-tab index="0" heading="Hand and Table">
      <run-game-hand-and-table game-id="{{vm.gameId}}"></run-game-hand-and-table>
    </uib-tab>
    <uib-tab index="1" heading="Hand">
      <run-game-hand show-table-proxy game-id="{{vm.gameId}}"></run-game-hand>    
    </uib-tab>
    <uib-tab index="2" heading="Table">
      <run-game-table height="90vw" width="100hw" game-id="{{vm.gameId}}"></run-game-table>
    </uib-tab>
  </uib-tabset>
  
          `,
    controller: RunGameTabs,
    controllerAs: 'vm',
    bindings: {
      gameId: '@'
    }
  }
)

export class RunGameTabs {
  gameId:string;
  $routerOnActivate(next) {
    this.gameId = next.params.gameId;
  }
}


