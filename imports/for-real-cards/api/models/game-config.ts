/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import {Deck, DeckId} from "./deck.model";

export enum DeckLocation {
  CENTER,
  WITH_DEALER,
  OUT_OF_PLAY
}


export enum CardLocation {
  HAND, //0
  PILE, //1
  DECK, //2
  TABLE //3
}
const NUMBER_OF_LOCATIONS = 4;

export const enum CardCountAllowed {
  NONE,
  ONE,
  ALL
}
const NUMBER_OF_CARD_COUNT_OPTIONS = 3;

export class UserCommand {
  from:CardLocation;
  to:CardLocation;
  cardCountAllowed:CardCountAllowed;
  constructor(from:CardLocation, to:CardLocation, cardCountAllowed:CardCountAllowed) {
    this.from = from;
    this.to = to;
    this.cardCountAllowed = cardCountAllowed;
  }
  private static getCardLocationDescription(cardLocation:CardLocation):string {
    switch (cardLocation) {
      case CardLocation.DECK:
        return "Deck";
      case CardLocation.HAND:
        return "Hand";
      case CardLocation.PILE:
        return "Pile";
      case CardLocation.TABLE:
        return "Table";
      default:
        throw "Invalid CardLocation";
    }
  }
  fromDescription():string {
    return UserCommand.getCardLocationDescription(this.from); 
  }
  toDescription():string {
    return UserCommand.getCardLocationDescription(this.to);
  }
  countDescription():string {
    return GameConfig.getCardCountAllowedDescription(this.cardCountAllowed);
  }
}

export class GameConfig {
  name:string;
  minimumNumberOfPlayers:number;
  maximumNumberOfPlayers:number;
  deck:Deck; // Not persisted
  _deck_id:DeckId; // Persisted
  numberOfCardsToPlayer:number;
  numberOfCardsToPlayerFaceUp:number;
  deckLocationAfterDeal: DeckLocation;
  turnCardUpAfterDeal:boolean;
  hasTricks: boolean;
  userCommands:UserCommand[];
  constructor(attributes: {
    name:string,
    minimumNumberOfPlayers:number,
    maximumNumberOfPlayers:number,
    deck:Deck,
    numberOfCardsToPlayer:number,
    deckLocationAfterDeal:DeckLocation,
    hasTricks:boolean,
    userCommands:UserCommand[],
    turnCardUpAfterDeal?:boolean,
    numberOfCardsToPlayerFaceUp?:number,
    _deck_id?:DeckId
  }) {
    this.name=attributes.name;
    this.minimumNumberOfPlayers = attributes.minimumNumberOfPlayers;
    this.maximumNumberOfPlayers = attributes.maximumNumberOfPlayers;
    this.deck=attributes.deck;
    this._deck_id=attributes._deck_id;
    if (!this.deck && this._deck_id) {
      this.deck = Deck.getDeck(this._deck_id);
    }
    this.numberOfCardsToPlayer=attributes.numberOfCardsToPlayer;
    this.deckLocationAfterDeal=attributes.deckLocationAfterDeal;
    this.turnCardUpAfterDeal=attributes.turnCardUpAfterDeal;
    this.hasTricks=attributes.hasTricks;
    this.userCommands = attributes.userCommands;
    let returnValue:UserCommand[] = [];
    for (let i=0; i<NUMBER_OF_LOCATIONS; i++) {
      for (let j=0; j<NUMBER_OF_LOCATIONS; j++) {
        returnValue.push(
          new UserCommand(i, j, this.getCommandAbility(i, j))
        );
      }
    }
    this.userCommands = returnValue; // Need to keep the same array object so $digest loop doesn't freak out
    this.numberOfCardsToPlayerFaceUp =attributes.numberOfCardsToPlayerFaceUp ? attributes.numberOfCardsToPlayerFaceUp : 0;  
  }
  static getLocationString(deckLocation:DeckLocation):string {
    switch (deckLocation) {
      case DeckLocation.CENTER:
        return "Center";
      case DeckLocation.OUT_OF_PLAY:
        return "Out of Play";
      case DeckLocation.WITH_DEALER:
        return "With Dealer";
      default:
        throw "Enexpected deck locarion"
    }
  }
  getUserCommands():UserCommand[] {
    return this.userCommands;
  }

  static getDefaultUserCommands():UserCommand[] {
    let returnValue:UserCommand[] = [];
    for (let i=0; i<NUMBER_OF_LOCATIONS; i++) {
      for (let j=0; j<NUMBER_OF_LOCATIONS; j++) {
        if (i===j) {  // Same source & Target
          returnValue.push(
            new UserCommand(i, j, i===CardLocation.HAND ? CardCountAllowed.ONE : CardCountAllowed.NONE) // HAND TO HAND ALLOWED FOR SORT
          );
        } else {
          returnValue.push(
            new UserCommand(i, j, CardCountAllowed.ONE)
          );
        }
      }
    }
    return returnValue;
  }
  
  static getDefaultConfig():GameConfig {
    return new GameConfig({
      name: "",
      minimumNumberOfPlayers: 2,
      maximumNumberOfPlayers: 5,
      deck: Deck.getDeck(DeckId.STANDARD_ACE_HIGH),
      numberOfCardsToPlayer: 5,
      deckLocationAfterDeal: DeckLocation.CENTER,
      turnCardUpAfterDeal: true,
      hasTricks: false,
      userCommands: GameConfig.getDefaultUserCommands()
    })
  }

  findCommand(from:CardLocation, to:CardLocation):UserCommand {
    if (!this.userCommands)
      return null;
    for (let i=0; i<this.userCommands.length; i++) {
      let userCommand = this.userCommands[i];
      if (userCommand.from === from && userCommand.to === to) {
        return userCommand;
      }
    }
    return null;
  }

  getCommandAbility(from:CardLocation, to:CardLocation):CardCountAllowed {
    let userCommand = this.findCommand(from, to);
    if (!userCommand)
      return CardCountAllowed.NONE;
    return userCommand.cardCountAllowed;
  }
  
  pruneUserCommands():void {
    for (let i=0; i<this.userCommands; i ++) {
      if (this.userCommands[i].cardCountAllowed===CardCountAllowed.NONE) {
        this.userCommands.splice(i, 1);
      }
    }
  }
  
  static getCardCountAllowedDescription(cardCountAllowed:CardCountAllowed):string {
    switch (cardCountAllowed) {
      case CardCountAllowed.NONE:
        return "No";
      case CardCountAllowed.ONE:
        return "One";
      case CardCountAllowed.ALL:
        return "All";
      default:
        throw "Unexpected Card Count Option";
    }
  }

  static getCardCountAllowedOptions():string[] {
    let returnValue = [];
    for (let i=0; i<NUMBER_OF_CARD_COUNT_OPTIONS; i++) {
      returnValue.push(GameConfig.getCardCountAllowedDescription(i))
    }
    return returnValue;
  }

  isTarget(cardLocation:CardLocation):boolean {
    for (let i=0; i<this.userCommands.length; i ++) {
      let userCommand = this.userCommands[i];
      if (userCommand.to === cardLocation)
        return userCommand.cardCountAllowed!==CardCountAllowed.NONE;
    }
    return false;
  }
  isSource(cardLocation:CardLocation):boolean {
    for (let i=0; i<this.userCommands.length; i ++) {
      let userCommand = this.userCommands[i];
      if (userCommand.from === cardLocation)
        return userCommand.cardCountAllowed!==CardCountAllowed.NONE;
    }
    return false;
  }


}

export let defaultGames:GameConfig[] = [
  new GameConfig({
    name: "Crazy Eights",
    minimumNumberOfPlayers: 2,
    maximumNumberOfPlayers: 5,
    deck: Deck.getDeck(DeckId.STANDARD_ACE_HIGH),
    numberOfCardsToPlayer: 8,
    deckLocationAfterDeal: DeckLocation.CENTER,
    turnCardUpAfterDeal: true,
    hasTricks: false,
    userCommands: [
      new UserCommand(CardLocation.DECK, CardLocation.HAND, CardCountAllowed.ONE),  // Take a card from the deck
      new UserCommand(CardLocation.HAND, CardLocation.PILE, CardCountAllowed.ONE),  // Put a card onto pile
      new UserCommand(CardLocation.HAND, CardLocation.HAND, CardCountAllowed.ONE)   // Users can sort their hand
    ],
  }),
  new GameConfig({
    name: "Euchure",
    minimumNumberOfPlayers: 4,
    maximumNumberOfPlayers: 4,
    deck: Deck.getDeck(DeckId.EUCHURE),
    numberOfCardsToPlayer: 5,
    deckLocationAfterDeal: DeckLocation.CENTER,
    turnCardUpAfterDeal: true,
    hasTricks: true,
    userCommands: [
      new UserCommand(CardLocation.PILE, CardLocation.HAND, CardCountAllowed.ONE), // Pick up turned up card at start of the game
      new UserCommand(CardLocation.HAND, CardLocation.DECK, CardCountAllowed.ONE), // Put back a card after picking it up
      new UserCommand(CardLocation.PILE, CardLocation.DECK, CardCountAllowed.ONE), // Turn it down
      new UserCommand(CardLocation.HAND, CardLocation.TABLE, CardCountAllowed.ONE),  // Play a card into trick
      new UserCommand(CardLocation.HAND, CardLocation.HAND, CardCountAllowed.ONE)   // Users can sort their hand
    ],
  }),
  new GameConfig({
    name: "Gin",
    minimumNumberOfPlayers: 2,
    maximumNumberOfPlayers: 4,
    deck: Deck.getDeck(DeckId.STANDARD_ACE_HIGH),
    numberOfCardsToPlayer: 10,
    deckLocationAfterDeal: DeckLocation.CENTER,
    turnCardUpAfterDeal: true,
    hasTricks: false,
    userCommands: [
      new UserCommand(CardLocation.DECK, CardLocation.HAND, CardCountAllowed.ONE),  // Take a card from the deck
      new UserCommand(CardLocation.PILE, CardLocation.HAND, CardCountAllowed.ONE),  // Take a card form the pile
      new UserCommand(CardLocation.HAND, CardLocation.PILE, CardCountAllowed.ONE),  // Put a card onto pile
      new UserCommand(CardLocation.HAND, CardLocation.TABLE, CardCountAllowed.ALL), // Put your hand on the table when you have won
      new UserCommand(CardLocation.HAND, CardLocation.HAND, CardCountAllowed.ONE)   // Users can sort their hand
    ],
  })
];