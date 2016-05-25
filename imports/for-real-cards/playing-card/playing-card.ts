/**
 * Created by kenono on 2016-05-06.
 */

import {Meteor} from 'meteor/meteor';
import { Component, Input } from '@angular/core';
import {Card} from '../api/models/card.model'

@Component(
  {
    selector: 'playing-card',
    controllerAs: 'vm',
    template:
`
<img 
  src="{{vm.imageURL()}}"
  class="{{vm.imgClass}}"
  alt="{{vm.encodedCardId()}}"
  data-card-rank="{{vm.card.rank}}"
  data-card-suit="{{vm.card.suit}}"
/>
`
})
export class PlayingCard {
  @Input() private card:Card;
  @Input() imgClass:string;
  @Input() imageURL():string {
    if (this.card) {
//      return Meteor.absoluteUrl() + "decks/standard2/" + this.card.encode() + ".svg#svgView(preserveAspectRatio(none))";
      return Meteor.absoluteUrl() + "decks/default/" + this.card.encode() + ".jpg";
    }
  }
  encodedCardId():string {
    if (this.card)
      return this.card.encode();
    return "no card defined";
  }
}