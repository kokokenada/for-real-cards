
import { Card} from './card.class'

const enum SortSequence {
  SUIT,
  RANK
}

class HandBase {
  _id: string;
  gameId: string;
  userId: string;
  position: number;
  dateCreated: Date;
  cardsFaceDown:Card[] = []; // not persisted
  cardsFaceUp:Card[] = []; // not persisted
  cardsInHand:Card[] = []; // not persisted
  tricks:Card[][] = [];  // Not persisted
  handSortSequence:SortSequence = SortSequence.RANK; // Not persisted
}

export interface HandInterface extends HandBase {
}

export class Hand extends HandBase {

  constructor(hand:HandBase) {
    super();
    Object.assign(this, hand);
  }
  
  static indexOf(hands:Hand[], handIdToFind:string):number {
    for (let i = 0; i<hands.length; i++) {
      let handCheck:Hand = hands[i];
      if (handCheck._id===handIdToFind)
        return i;
    }
    return -1;
  }

  static indexOfUser(hands:Hand[], userId:string):number {
    for (let i=0; i<hands.length; i++) {
      if (hands[i].userId===userId) {
        return i;
      }
    }
    return -1;
  }
  
  static handForUser(hands:Hand[], userId:string):Hand {
    return hands[Hand.indexOfUser(hands, userId)];
  }

  sortHand():void {
    let compare;
    if (this.handSortSequence===SortSequence.RANK) {
      compare = (cardA:Card, cardB:Card)=> {
        if (cardA.rank === cardB.rank) {
          return cardA.suit - cardB.suit;
        }
        return cardA.rank - cardB.rank;
      };
      this.handSortSequence = SortSequence.SUIT; // Change for next time
    } else {
      compare = (cardA:Card, cardB:Card)=> {
        if (cardA.suit === cardB.suit) {
          return cardA.rank - cardB.rank;
        }
        return cardA.suit - cardB.suit;
      };
      this.handSortSequence = SortSequence.RANK; // Change for next time
    }
    this.cardsInHand.sort(compare);
  }
}
