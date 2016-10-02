/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import {Card, CardSuit, CardRank} from "../../api/models/card.model";
import {GameConfig, CardLocation, CardCountAllowed} from "../../api/models/game-config";
import {VisibilityType} from "../../api/models/action.model";
import {GamePlayActions} from '../redux';
import {IGamePlayState} from "../redux/game-play/game-play.types";
  
export class DragAndDrop {
  suit:CardSuit;
  rank:CardRank;
  target:CardLocation;
  source:CardLocation;
  valid:boolean;
  gameState: IGamePlayState;
  gameConfig:GameConfig;
  el:any;
  targetElement:any;
  sourceElement:any;
  sibling:any;

  constructor(el, target, source, sibling, gameState: IGamePlayState) {
    this.gameConfig = gameState.currentGameConfig;
    this.gameState = gameState;
    this.valid = true;
    if (el.dataset) {
      if (!(el.dataset.cardSuit) || !(el.dataset.cardRank)) {
        // When dragging from DECK, no card is known

//        this.logError('Element is missing dataset.cardRank or dataset.cardSuit');
//        this.valid = false;
      } else {
        this.suit = Number(el.dataset.cardSuit);
        this.rank = Number(el.dataset.cardRank);
      }
    } else {
      this.valid = false;
      this.logError('Element is missing dataset');
    }
    if (target && target.dataset) {
      this.target = CardLocation[<string>target.dataset.dropTarget];
    } else {
      this.valid = false;
      this.logError('target is missing or is missing dataset');
    }
    if (source && source.dataset) {
      this.source = CardLocation[<string>source.dataset.dragSource];
    } else {
      this.valid = false;
      this.logError('source is missing or is missing dataset');
    }
    this.el = el;
    this.targetElement = target;
    this.sourceElement = source;
    this.sibling = sibling;
//    console.log('dd cons')
//    console.log(this)
  }

  isDropAllowed():CardCountAllowed {
    return (this.valid && this.gameConfig.getCommandAbility(this.source, this.target));
  }

  getCard():Card {
    return new Card({rank: this.rank, suit: this.suit});
  }

  logError(error:string):void {
    console.error(error);
    console.log(this);
  }
  
  
  runActions() {
    switch (this.source) {
      case CardLocation.HAND: {
        switch (this.target) {
          case CardLocation.HAND: {
            //Not sure if sort should be pushed through actions or not

            // User is manually sorting
            let cardOrder:Card[] = [];
            for (let i = 0; i < this.targetElement.childElementCount; i++) {
              let node:any = this.targetElement.children[i];
              if (node.tagName.toLowerCase()==="playing-card") {
                let card:Card = new Card({suit: node.dataset.cardSuit, rank: node.dataset.cardRank});
                cardOrder.push(card);
              }
            }
            GamePlayActions.sortHand(this.gameState, cardOrder);
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.DECK: {
            GamePlayActions.handToDeck(this.gameState, this.suit, this.rank);
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.PILE: {
            GamePlayActions.handToPile(this.gameState, this.suit, this.rank);
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.TABLE: {
            GamePlayActions.cardToTable(this.gameState, this.suit, this.rank, VisibilityType.ALL);
            this.el.remove(); // Let actions observable update
            break;
          }
          default:
            this.logError('Unexpected target for source HAND');
        }
        break;
      }
      case CardLocation.DECK: {
        switch (this.target) {
          case CardLocation.HAND: {
            GamePlayActions.deckToHand(this.gameState, VisibilityType.PLAYER);
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.DECK: {
            this.logError('DECK to DECK (sorting) not implemented');
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.PILE: {
            this.logError('DECK to PILE not implemented');
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.TABLE: {
            this.logError('DECK to TABLE not implemented');
            this.el.remove(); // Let actions observable update
            break;
          }
          default:
            this.logError('Unexpected target for source DECK');
        }
        break;
      }
      case CardLocation.PILE: {
        switch (this.target) {
          case CardLocation.HAND: {
            GamePlayActions.pileToHand(this.gameState, this.suit, this.rank);
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.DECK: {
            GamePlayActions.pileToDeck(this.gameState, [this.getCard()]);
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.PILE: {
            this.logError('PILE to PILE (sorting) not implemented');
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.TABLE: {
            this.logError('PILE to TABLE not implemented');
            this.el.remove(); // Let actions observable update
            break;
          }
          default:
            this.logError('Unexpected target for source PILE');
        }
        break;
      }
      case CardLocation.TABLE: {
        switch (this.target) {
          case CardLocation.HAND: {
            GamePlayActions.tableToHand(this.gameState, this.suit, this.rank);
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.DECK: {
            this.logError('TABLE to DECK not implemented');
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.PILE: {
            this.logError('TABLE to PILE not implemented');
            this.el.remove(); // Let actions observable update
            break;
          }
          case CardLocation.TABLE: {
            this.logError('TABLE to TABLE (sorting) not implemented');
            this.el.remove(); // Let actions observable update
            break;
          }
          default:
            this.logError('Unexpected target for source TABLE');
        }
        break;
      }
      default: {
        this.logError('Unexpected source');
      }
    }
  }
}

