import * as log from 'loglevel';


export const enum CardSuit {
  Clubs=0,
  Spades,
  Hearts,
  Diamonds,
  nil
}


export const SUITED_YES = 0x01;
export const SUITED_NO = 0x00;

export const enum CardRank {          // LSB is Suited flag
  Jester = 0,
  AceLow,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
  AceHigh,
  Wizard,
  Joker
}

export class Card {
  private static rankCodes = [
    '0',
    'a',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    't',
    'j',
    'q',
    'k',
    'e',
    'w',
    'k'
  ];
  private static suitCodes = [
    'C',
    'S',
    'H',
    'D',
    'n'
  ];
  suit:CardSuit;
  rank:CardRank;

  constructor(card:{code?:string, suit?:CardSuit, rank?:CardRank}) {
    if (card) {
      if (card.code) {
        this.decode(card.code)
      } else {
        this.suit = card.suit;
        this.rank = card.rank;
      }
    } else {
      log.error('argument to card constuctor is empty')
      console.trace();
    }
  }

  static isSuited(rank:CardRank):boolean {
    return !(CardRank.Jester === rank ||
    CardRank.Wizard === rank ||
    CardRank.Joker === rank)
  }

  private rankCode():string {
    return Card.rankCodes[this.rank];
  }
  private suitCode():string {
    return Card.suitCodes[this.suit];
  }

  encode():string {
    return this.rankCode()+this.suitCode();
  }

  decode(coded:string) {
    this.rank = Card.rankCodes.indexOf(coded[0]);
    this.suit = Card.suitCodes.indexOf(coded[1]);
  }
}
