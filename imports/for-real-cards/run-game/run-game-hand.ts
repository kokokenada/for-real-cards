import {RunGame} from './run-game.ts';
import {Component} from "../../common/ui-twbs_ng15/util";
import {DealModal} from "./deal-modal"
import * as log from 'loglevel';
import {CommonPopups} from "../../common/ui-twbs_ng15/common-popups";
import {PlayingCard} from "./playing-card"; {PlayingCard}
import {GameConfig, CardLocation, CardCountAllowed} from "../api/models/game-config";
import {DeckView} from "./deck-view"; (DeckView)
import {Tools} from "../../common/api/services/tools";
import {PileView} from "./pile-view"; (PileView)
import {Action, ActionFormatted} from "../api/models/action.model";
//import {timeoutApply} from "../../common/ui-twbs_ng15/util";
import {Card} from "../api/models/card.model";
import {Hand} from "../api/models/hand.model";

@Component(
  {
    module: 'fastcards',
    selector: 'runGameHand',
    template: `
  <div>
    <button class="btn btn-primary" ng-click="vm.deal()">Deal</button>
    <button ng-show="vm.canShowHand()" class="btn btn-primary" ng-click="vm.showHand()">Show Hand</button>
    <button ng-show="vm.shouldShowTakeTrick()" class="btn btn-primary" ng-click="vm.takeTrick()">Take Trick</button>
    <button ng-show="vm.shouldShowSort()" class="btn btn-primary" ng-click="vm.sort()">Sort Hand</button>
    <button ng-show="vm.shouldShowUndo()" class="btn btn-default pull-right" ng-click="vm.undo()">Undo</button>
  </div>
  <div ng-show="vm.shouldShowTableProxy()" 
        style="height:15vh" 
        class="row"
      >
      <!--transform:rotate(90deg) translate(-2.6vh, 0) !important;-->
    <style>
      .playing-card-landscape {
        transform-not:rotate(90deg) scale(0.5, 3.5) !important;
    
        height:100% !important;
        width:100% !important;
      }
    </style>
    <!-- DECK -->
    <deck-view 
      ng-show="vm.shouldShowDeck()" 
      class="drag-and-drop-container col-xs-{{vm.numberOfColumns()}}"
      style="height:15vh;"  
      data-drag-source="DECK"
      data-drop-target="DECK"
      img-class="playing-card-landscape"
      game-id="{{vm.gameId}}"
      >
    </deck-view>
    <!-- PILE -->
    <pile-view 
      ng-show="vm.shouldShowPile()" 
      class="drag-and-drop-container col-xs-{{vm.numberOfColumns()}}"
      style="height:15vh;"
      img-class="playing-card-landscape"
      card="vm.topCardInPile()" 
      game-id="{{vm.gameId}}"
      data-card-rank="{{vm.topCardInPile().rank}}"
      data-card-suit="{{vm.topCardInPile().suit}}"
      data-drag-source="PILE"
      data-drop-target="PILE"
    >
    </pile-view>      
    <!-- TABLE DROP -->
    <div ng-show="vm.shouldShowTableDrop()" 
          data-drop-target="TABLE"
          style="height:15vh;"
          class="well drag-and-drop-container col-xs-{{vm.numberOfColumns()}}" style="text-align: center">
          Drag here to place card on table
    </div>

  </div>


  <!-- HAND -->
  <div class="drag-and-drop-container" 
        style="padding-left: 20px; padding-right: 20px; overflow-y: scroll" 
         data-drop-target="HAND"
         data-drag-source="HAND"
    >
    <style>
.gu-transit, .gu-mirror {
  opacity: 0.2;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
  filter: alpha(opacity=20);
  display:inline-block ; width: 71px !important; height: 100px!important; padding-left: 1px; padding-right: 1px 
}
.playing-card-hand {
  width: 71px !important; height: 100px !important; 
}
    </style>
      <playing-card 
          
        img-class="playing-card-hand"
        style="display:inline-block ; width: 71px; height: 100px; padding-left: 1px; padding-right: 1px "
        card="card" 
        game-id="{{vm.gameId}}"
        ng-repeat="card in vm.getCardsInHand()"
        data-card-rank="{{card.rank}}"
        data-card-suit="{{card.suit}}"
        data-drag-source="HAND"
        data-drop-target="HAND"   
      </playing-card>
  </div>
  
          `,
//    templateUrl: '/imports/fastcards/ui/run-game-hand/run-game-hand.html',
    controller: RunGameHand,
    controllerAs: 'vm',
    bindings: {
      gameId: '@',
      showTableProxy: '@'
    },
    require: {topFrame: '^fastCardsTopFrame'}
  }
)
export class RunGameHand extends RunGame {
  gameId:string;
  showTableProxy:string;
  undoAction:Action;
  constructor($log, $scope) {
    super($log, $scope);
  }

  private showTableProxyBool():boolean {
    return Tools.stringToBool(this.showTableProxy);
  }

  shouldShowTableProxy():boolean {
    return this.showTableProxyBool() && (this.shouldShowDeck() || this.shouldShowPile() || this.shouldShowTableDrop());
  }

  shouldShowTakeTrick():boolean {
    return RunGame.gameStreams.currentGameConfig && RunGame.gameStreams.currentGameConfig.hasTricks && RunGame.gameStreams.trickReady();
  }
  
  numberOfColumns():string {
    let numberOfBoxes = 
      (this.shouldShowDeck() ? 1 : 0) +
      (this.shouldShowPile() ? 1 : 0) +
      (this.shouldShowTableDrop() ? 1 : 0);
    return (numberOfBoxes===0 ? "4" : (12/numberOfBoxes).toString());
  }
  
  takeTrick():void {
    RunGame.gameStreams.takeTrick();
  }
  
  shouldShowSort():boolean {
    return (
      RunGame.gameStreams.currentGameConfig &&
      RunGame.gameStreams.currentGameConfig.findCommand(CardLocation.HAND, CardLocation.HAND).cardCountAllowed!==CardCountAllowed.NONE
    );
  }
  
  sort():void {
    let cardOrder:Card[] = [];
    let hand:Hand = this.getHand();
    hand.sortHand();

    for (let i = 0; i < hand.cardsInHand.length; i++) {
      let card = hand.cardsInHand[i];
      cardOrder.push(card);
    }
    RunGame.gameStreams.sortHand(cardOrder);
  }

  deal() {
    let defaultGameConfig:GameConfig;
    if (RunGame.gameStreams)
      defaultGameConfig = RunGame.gameStreams.currentGameConfig;
    DealModal.openWithDefaults(defaultGameConfig).subscribe(
      (result:GameConfig)=> {
        if (result) {
          RunGame.gameStreams.deal(result);
        }
      },
      (error)=>{
        CommonPopups.alert(error);
      }
    );
  }

  shouldShowUndo():boolean {
    return RunGame.gameStreams.actionToUndo() ? true : false;
  }
  
  undo():void {
    
    let action:ActionFormatted  = new ActionFormatted( RunGame.gameStreams.actionToUndo() );

    let prompt:string = "Undo " + action.actionDescription() + " done by "
      + (action.action.creatorId === Meteor.userId() ? "yourself" : action.creator());
    CommonPopups.confirm(prompt).subscribe((result:boolean)=> {
      if (result) {
        RunGame.gameStreams.undo(action.action._id);
      }
    })
  }
}

