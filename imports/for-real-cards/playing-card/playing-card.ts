import { Component, Input } from '@angular/core';
import {Card} from '../../for-real-cards-lib'
import {CardImageStyle} from "../../for-real-cards-web/card-image-style.interface";
import {StaticResources} from '../../for-real-cards-lib';

@Component(
  {
    selector: 'playing-card',
    template:
`
<img 
  [src]="imageURL()"
  [ngStyle]="imgStyle"
  [alt]="encodedCardId()"
  [attr.data-card-rank]="card?.rank"
  [attr.data-card-suit]="card?.suit"
/>
`
})
export class PlayingCard {
  @Input() private card:Card;
  @Input() imgStyle:CardImageStyle;

  private static encode(card:any):string {
/*    if (card.encode)
      return card.encode();
    let cardObj:Card = new Card(card);*/
    return card.encode();
  }

  imageURL():string {
    if (this.card) {
//      return Meteor.absoluteUrl() + "decks/standard2/" + this.card.encode() + ".svg#svgView(preserveAspectRatio(none))";

      return StaticResources.instance.getURL("decks/default/" + PlayingCard.encode(this.card) + ".jpg");
    }
  }
  encodedCardId():string {
    if (this.card)
      return PlayingCard.encode(this.card);
    return "no card defined";
  }
}