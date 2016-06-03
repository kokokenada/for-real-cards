/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input } from '@angular/core';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { ModalService } from '../../common-app/ui-twbs-ng2';

import {Deck, DeckId, GameConfig, defaultGames, DeckLocation, UserCommand} from "../api";

@Component(
  {
    selector: 'frc-deal-modal',
    directives: [DROPDOWN_DIRECTIVES],
    providers: [ModalService],
    template: `

<form role="form" class="form-horizontal">
  <div class="panel-heading">
    <h3 class="panel-title">Deal</h3>
    <div class="form-group col-md-6">                    
      <button (click)="cancel()" class="btn btn-default pull-right">Never Mind</button> 
      <button (click)="deal()" class="btn btn-success pull-right">Deal</button> 
    </div>
  </div>
  <div class="panel-body">
  
    <div class="form-group">
      <label class="col-xs-6" for="game-dropdown">Preset Game</label>
      <div 
        class="col-xs-6 btn-group" 
        dropdown
        (click)="$event.preventDefault()"
        >
        <button 
          type="button" 
            id="game-dropdown"   
            class="btn btn-primary btn-sm btn-block" 
            dropdownToggle>{{getSelectedPreset()}}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="single-button">
          <li 
            *ngFor="let preset of getPresets(); let i = index" 
            (click)="selectPreset(i)" 
            role="menuitem">
            <a href="#">{{preset?.name}}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="form-group">
      <label class="col-xs-6" for="game-name">Game Name</label>
      <div class="col-xs-6">
        <input [(ngModel)]="gameConfig.name" type="text" class="form-control" id="game-name"/>
      </div>
    </div>
    
    <div class="form-group">
      <label class="col-xs-6" for="minimumNumberOfPlayers">Min & Max # of Players</label>
      <div class="col-xs-3">
        <input  
          [(ngModel)]="gameConfig.minimumNumberOfPlayers" 
          type="number" 
          class="form-control" 
          id="minimumNumberOfPlayers"/>
      </div>
      <div class="col-xs-3">
        <input  
          [(ngModel)]="gameConfig.maximumNumberOfPlayers" 
          type="number" 
          class="form-control" 
          id="maximumNumberOfPlayers"/>
      </div>
    </div>

    <div class="form-group">
      <label class="col-xs-6" for="deck-dropdown">Deck Type</label>
      <div class="col-xs-6 btn-group" dropdown (click)="$event.preventDefault()">
        <button type="button" id="deck-dropdown"   
            class="btn btn-primary btn-sm btn-block" dropdownToggle>{{selectedDeckName()}}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" dropdown-menu role="menu" aria-labelledby="single-button">
          <li 
            *ngFor="let deck of getDecks(); let i = index" 
            (click)="selectDeck(i)" 
            role="menuitem">
            <a href="#">{{deck?.name}}</a>
          </li>
        </ul>
      </div>
    </div>
                    
    <div class="form-group">
      <label class="col-xs-6" for="numberOfCardsToPlayer">Number of Cards to Players</label>
      <div class="col-xs-6">
        <input 
          [(ngModel)]="gameConfig.numberOfCardsToPlayer" 
          type="number" 
          class="form-control" 
          id="numberOfCardsToPlayer"/>
      </div>
    </div>

    <div class="form-group">
      <label class="col-xs-6" for="deck-location">Deck Location After Deal</label>
      <div class="col-xs-6 btn-group" dropdown (click)="$event.preventDefault()">
        <button type="button" id="deck-location"   
            class="btn btn-primary btn-sm btn-block" dropdownToggle>{{selectedLocationName()}}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" dropdown-menu role="menu" aria-labelledby="single-button">
          <li 
            *ngFor="let location of getLocations(); let i=index" 
            (click)="setLocation(i)" 
            role="menuitem">
            <a href="#">{{location}}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="form-group">
      <label class="col-xs-6" for="turn-up">Turn Up Card After Deal</label>
      <div class="col-xs-6 btn-group" dropdown (click)="$event.preventDefault()">
        <button type="button" id="turn-up"   
            class="btn btn-primary btn-sm btn-block" dropdownToggle>
            {{gameConfig?.turnCardUpAfterDeal ? "Yes" : "No"}}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" dropdown-menu role="menu" aria-labelledby="single-button">
          <li (click)="setTurnUp(true)" role="menuitem"><a href="#">Yes</a></li>
          <li (click)="setTurnUp(false)" role="menuitem"><a href="#">No</a></li>
        </ul>
      </div>
    </div>
    
    <div class="form-group">
      <label class="col-xs-6" for="has-tricks">Has Tricks</label>
      <div class="col-xs-6 btn-group" dropdown (click)="$event.preventDefault()">
        <button type="button" id="has-tricks"   
            class="btn btn-primary btn-sm btn-block" 
            dropdownToggle>{{gameConfig?.hasTricks ? "Yes" : "No"}}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" dropdown-menu role="menu" aria-labelledby="single-button">
          <li (click)="setHasTricks(true)" role="menuitem"><a href="#">Yes</a></li>
          <li (click)="setHasTricks(false)" role="menuitem"><a href="#">No</a></li>
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
            <tr *ngFor="let userCommand of getUserCommands(); let i = index">
             <td>{{userCommand?.fromDescription()}}</td>
             <td>{{userCommand?.toDescription()}}</td>
             
              <td dropdown (click)="$event.preventDefault()">
                <button type="button" [attr.id]='"userCommand" + i'
                    class="btn btn-primary btn-sm btn-block" 
                    dropdownToggle>{{userCommand?.countDescription()}}
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" 
                  dropdown-menu 
                  role="menu" 
                  aria-labelledby="single-button"> 
                  <li 
                    *ngFor="let desc of getCardCountAllowedOptions(); let j = index" 
                    (click)="setUserCommand(userCommand.from, userCommand.to, j)"
                    role="menuitem"
                    >
                    <a href="#">{{desc}}</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</form>
    `
  }
)
export class DealModal  {
  gameConfig: GameConfig;
  @Input() componentParameters:any;
  constructor(private modalService: ModalService) {

  }

  ngOnChanges(obj) {
    console.log('onchanges deal modal:');
       console.log(obj);
       console.log(this)
    if (obj.componentParameters && obj.componentParameters.currentValue && obj.componentParameters.currentValue.gameConfig)
      this.gameConfig = obj.componentParameters.currentValue.gameConfig;
  }
  private selectedPreset:string;

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
    return this.gameConfig && this.gameConfig.deck ? this.gameConfig.deck.name : "";
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
    ModalService.close(this.gameConfig);
  }
  cancel() {
    ModalService.close(undefined);
  }
}
