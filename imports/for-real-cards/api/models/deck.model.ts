import 'seedrandom';
import { List } from "immutable";

import {Card, CardRank, CardSuit} from './card.model.ts';

let decks: Deck[] = [];

export enum DeckId {
  STANDARD_ACE_LOW=1,
  STANDARD_ACE_HIGH,
  EUCHURE,
  WIZARD
}

function initiatize() {
  decks.push(
    new Deck(
      DeckId.STANDARD_ACE_LOW,
      `Standard - Ace Low`,
      [
        CardRank.Two,
        CardRank.Three,
        CardRank.Four,
        CardRank.Five,
        CardRank.Six,
        CardRank.Seven,
        CardRank.Eight,
        CardRank.Nine,
        CardRank.Ten,
        CardRank.Jack,
        CardRank.Queen,
        CardRank.King,
        CardRank.AceHigh
      ]
    ),

    new Deck(
      DeckId.STANDARD_ACE_HIGH,
      `Standard - Ace High`,
      [
        CardRank.Two,
        CardRank.Three,
        CardRank.Four,
        CardRank.Five,
        CardRank.Six,
        CardRank.Seven,
        CardRank.Eight,
        CardRank.Nine,
        CardRank.Ten,
        CardRank.Jack,
        CardRank.Queen,
        CardRank.King,
        CardRank.AceLow
      ]
    ),

    new Deck(
      DeckId.EUCHURE,
      `Euchre`,
      [
        CardRank.Nine,
        CardRank.Ten,
        CardRank.Jack,
        CardRank.Queen,
        CardRank.King,
        CardRank.AceLow
      ]
    ),

    new Deck(
    DeckId.WIZARD,
    `Wizard`,
    [
      CardRank.Jester,
      CardRank.Jester,
      CardRank.Jester,
      CardRank.Jester,
      CardRank.Two,
      CardRank.Three,
      CardRank.Four,
      CardRank.Five,
      CardRank.Six,
      CardRank.Seven,
      CardRank.Eight,
      CardRank.Nine,
      CardRank.Ten,
      CardRank.Jack,
      CardRank.Queen,
      CardRank.King,
      CardRank.AceHigh,
      CardRank.Wizard,
      CardRank.Wizard,
      CardRank.Wizard,
      CardRank.Wizard
    ]
  )
  )
}

export class Deck{
  id: DeckId;
  name: string;
  cards: Card[];
  constructor(id:DeckId, name: string, ranks: [CardRank]) {
    this.id = id;
    this.name = name;
    this.cards = [];
    for (let i=0; i<ranks.length; i++) {
      let rank = ranks[i];
      if (Card.isSuited(rank)) {
        for (let j=0; j<4; j++) {
          this.cards.push(new Card({
            suit: j,
            rank: rank
          }))
        }
      } else {
        this.cards.push(new Card({
          rank: rank,
          suit: CardSuit.nil
        }));
      }
    }
  }
  static getDecks():Deck[] {
    if (decks.length===0) {
      initiatize();
    }
    return decks;
  }
  static indexOf(cards:List<Card>, cardToFind:Card):number
  static indexOf(cards:Card[], cardToFind:Card):number
  static indexOf(cards:any, cardToFind:Card):number {
    return cards.findIndex( (deckCard:Card)=> {
      return deckCard.rank===cardToFind.rank && deckCard.suit===cardToFind.suit;
    });
  }
  static shuffle(seed:string, cards:Card[]): void {
    Math.seedrandom(seed); // Important for UNDO/rebuild, or cards get shuffled in different order
    for (let i=0; i<cards.length; i++) {
      let random =  Math.random();
      let randomIndex: number = Math.floor(random * cards.length);
      let tmp: Card = cards[randomIndex];
      cards[randomIndex] = cards[i];
      cards[i] = tmp;
    }
  }
  static getDeck(id:DeckId):Deck {
    if (decks.length===0) {
      initiatize();
    }
    return decks[id-1];
  }
}


