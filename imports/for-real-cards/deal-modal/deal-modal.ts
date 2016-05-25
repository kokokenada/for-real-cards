/**
 * Created by kenono on 2016-04-23.
 */
import { Component } from '@angular/core';
import {Subject} from 'rxjs';

import {Modal} from '../../common-app/ui-twbs-ng2/modal';

import {Deck, DeckId, GameConfig, defaultGames, DeckLocation, UserCommand} from "../api";

@Component(
  {
    selector: 'deal-modal',
    controller: DealModal,
    controllerAs: 'vm',
    template: `

          <form role="form" class="form-horizontal">
              <div class="panel-heading">
                <h3 class="panel-title">Deal</h3>
                <div class="form-group col-md-6">                    
                  <button ng-click="vm.cancel()" class="btn btn-default pull-right">Never Mind</button> 
                  <button ng-click="vm.deal()" class="btn btn-success pull-right">Deal</button> 
                </div>
              </div>
              <div class="panel-body">
              
                <div class="form-group">
                  <label class="col-xs-6" for="game-dropdown">Preset Game</label>
                  <div class="col-xs-6 btn-group" uib-dropdown>
                    <button type="button" id="game-dropdown"   
                        class="btn btn-primary btn-sm btn-block" uib-dropdown-toggle>{{vm.getSelectedPreset()}}
                      <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                      <li ng-repeat="preset in vm.getPresets()" ng-click="vm.selectPreset($index)" role="menuitem"><a href="#">{{preset.name}}</a></li>
                    </ul>
                  </div>
                </div>

                <div class="form-group">
                  <label class="col-xs-6" for="game-name">Game Name</label>
                  <div class="col-xs-6">
                    <input ng-model="vm.gameConfig.name" type="text" class="form-control" id="game-name"/>
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="col-xs-6" for="minimumNumberOfPlayers">Min & Max # of Players</label>
                  <div class="col-xs-3">
                    <input  ng-model="vm.gameConfig.minimumNumberOfPlayers" type="number" class="form-control" id="minimumNumberOfPlayers"/>
                  </div>
                  <div class="col-xs-3">
                    <input  ng-model="vm.gameConfig.maximumNumberOfPlayers" type="number" class="form-control" id="maximumNumberOfPlayers"/>
                  </div>
                </div>

                <div class="form-group">
                  <label class="col-xs-6" for="deck-dropdown">Deck Type</label>
                  <div class="col-xs-6 btn-group" uib-dropdown>
                    <button type="button" id="deck-dropdown"   
                        class="btn btn-primary btn-sm btn-block" uib-dropdown-toggle>{{vm.selectedDeckName()}}
                      <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                      <li ng-repeat="deck in vm.getDecks()" ng-click="vm.selectDeck($index)" role="menuitem"><a href="#">{{deck.name}}</a></li>
                    </ul>
                  </div>
                </div>
                                
                <div class="form-group">
                  <label class="col-xs-6" for="numberOfCardsToPlayer">Number of Cards to Players</label>
                  <div class="col-xs-6">
                    <input  ng-model="vm.gameConfig.numberOfCardsToPlayer" type="number" class="form-control" id="numberOfCardsToPlayer"/>
                  </div>
                </div>

                <div class="form-group">
                  <label class="col-xs-6" for="deck-location">Deck Location After Deal</label>
                  <div class="col-xs-6 btn-group" uib-dropdown>
                    <button type="button" id="deck-location"   
                        class="btn btn-primary btn-sm btn-block" uib-dropdown-toggle>{{vm.selectedLocationName()}}
                      <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                      <li ng-repeat="location in vm.getLocations()" ng-click="vm.setLocation($index)" role="menuitem"><a href="#">{{location}}</a></li>
                    </ul>
                  </div>
                </div>

                
                <div class="form-group">
                  <label class="col-xs-6" for="turn-up">Turn Up Card After Deal</label>
                  <div class="col-xs-6 btn-group" uib-dropdown>
                    <button type="button" id="turn-up"   
                        class="btn btn-primary btn-sm btn-block" uib-dropdown-toggle>{{vm.gameConfig.turnCardUpAfterDeal ? "Yes" : "No"}}
                      <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                      <li ng-click="vm.setTurnUp(true)" role="menuitem"><a href="#">Yes</a></li>
                      <li ng-click="vm.setTurnUp(false)" role="menuitem"><a href="#">No</a></li>
                    </ul>
                  </div>
                </div>
                

                <div class="form-group">
                  <label class="col-xs-6" for="has-tricks">Has Tricks</label>
                  <div class="col-xs-6 btn-group" uib-dropdown>
                    <button type="button" id="has-tricks"   
                        class="btn btn-primary btn-sm btn-block" uib-dropdown-toggle>{{vm.gameConfig.hasTricks ? "Yes" : "No"}}
                      <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                      <li ng-click="vm.setHasTricks(true)" role="menuitem"><a href="#">Yes</a></li>
                      <li ng-click="vm.setHasTricks(false)" role="menuitem"><a href="#">No</a></li>
                    </ul>
                  </div>
                </div>
                
                <label>Users can move cards:</label>
                <div class="row">
                  <div class="col-xs-1"></div>
                  <div class="col-xs-11">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>From</th>
                          <th>To</th>
                          <th>Allowed</th>
                        <tr>
                      </thead>
                      <tbody>
                        <tr ng-repeat="userCommand in vm.getUserCommands()">
                         <td>{{userCommand.fromDescription()}}</td>
                         <td>{{userCommand.toDescription()}}</td>
                         
                          <td uib-dropdown>
                            <button type="button" id="userCommand{{$index}}"
                                class="btn btn-primary btn-sm btn-block" uib-dropdown-toggle>{{userCommand.countDescription()}}<span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button" ng-init="curFrom=userCommand.from;curTo=userCommand.to">
                              <li ng-repeat="desc in vm.getCardCountAllowedOptions()" ng-click="vm.setUserCommand(curFrom, curTo, $index)" role="menuitem"><a href="#">{{desc}}</a></li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </form>

<!--
    seeLastCardOnlyOnFaceUpPile: false,
-->

    `
  }
)
export class DealModal extends Modal {
  private static defaultConfig:GameConfig;
  gameConfig: GameConfig;
  private selectedPreset:string;
  constructor() {
    super();
    if (DealModal.defaultConfig) {
      this.gameConfig = DealModal.defaultConfig
    } else {
      this.gameConfig = new GameConfig({
        name: "",
        minimumNumberOfPlayers: 2,
        maximumNumberOfPlayers: 5,
        deck: Deck.getDeck(DeckId.STANDARD_ACE_HIGH),
        numberOfCardsToPlayer: 5,
        deckLocationAfterDeal: DeckLocation.CENTER,
        turnCardUpAfterDeal: true,
        hasTricks: false,
        seeLastCardOnlyOnFaceUpPile: false,
        userCommands: GameConfig.getDefaultUserCommands()
      })
    }
  }
  static openWithDefaults(gameConfig:GameConfig):Subject {
    DealModal.defaultConfig = gameConfig;
    return DealModal.open();
  }
  getSelectedPreset():string {
    if (this.selectedPreset)
      return this.selectedPreset;
    return "Tap to select a game pre-set"
  }
  getPresets():GameConfig[] {
    return defaultGames;
  }
  selectPreset(presetIndex:number):void {
    let gameConfig = defaultGames[presetIndex];
    this.selectedPreset = gameConfig.name;
    this.gameConfig = _.extend(this.gameConfig, gameConfig);
  }
  getDecks() {
    return Deck.getDecks();
  }
  selectedDeckName():string {
    return this.gameConfig.deck ? this.gameConfig.deck.name : "";
  }
  selectDeck(index:number): void {
    this.gameConfig.deck = this.getDecks()[index];
    this.gameConfig._deck_id = this.gameConfig.deck.id;
  }
  selectedLocationName():string {
    return GameConfig.getLocationString(this.gameConfig.deckLocationAfterDeal);
  }
  getLocations():string[] {
    return [
      GameConfig.getLocationString(DeckLocation.CENTER),
      GameConfig.getLocationString(DeckLocation.OUT_OF_PLAY),
      GameConfig.getLocationString(DeckLocation.WITH_DEALER)
    ]
  }
  setLocation(index:number):void {
    for (let i=0; i<this.getLocations().length; i++) {
      if (GameConfig.getLocationString(index)===GameConfig.getLocationString(i)) {
        this.gameConfig.deckLocationAfterDeal = i;
        return
      }
    }
  }
  setTurnUp(value:boolean):void {
    this.gameConfig.turnCardUpAfterDeal = value;
  }
  setHasTricks(value:boolean):void {
    this.gameConfig.hasTricks = value;
  }
  getUserCommands():UserCommand[] {
    return this.gameConfig.getUserCommands();
  }
  setUserCommand(curFrom, curTo, index) {
    let userCommand:UserCommand = this.gameConfig.findCommand(curFrom, curTo);
    userCommand.cardCountAllowed = index;
  }
  getCardCountAllowedOptions():string[] {
    return GameConfig.getCardCountAllowedOptions();
  }
  deal() {
    this.gameConfig.pruneUserCommands();
    super.complete(this.gameConfig);
  }
  cancel() {
    super.complete(undefined);
  }
}
