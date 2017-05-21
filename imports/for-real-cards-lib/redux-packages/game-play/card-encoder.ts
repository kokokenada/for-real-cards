import {GamePlayAction} from './action.class';
import {Card} from './card.class';
import {GameConfig} from './game-config.class';

export class CardEncoder {
  static decode(action:GamePlayAction):GamePlayAction {
    action.cards = [];
    let cardsEncoded:string = action.cardsEncoded;
    if (cardsEncoded) {
      for (let i = 0; i < cardsEncoded.length; i = i + 2) {
        let cardCode = cardsEncoded.substr(i, 2);
        let card:Card = new Card({code: cardCode});
        action.cards.push(card);
      }
    }
    if (action.gameConfig) {
      action.gameConfig = new GameConfig(action.gameConfig);
    }
    return action;
  }

  static encodeCards(cards:Card[]):string {
    let returnValue:string = '';
    cards.forEach((card:Card)=>{
      if (!card) {
        console.error(cards);
        console.trace();
        throw new Meteor.Error('internal-error', 'Card in action is empty');
      }
      returnValue += new Card({rank: card.rank, suit: card.suit}).encode();
    });
    return returnValue;
  }

}