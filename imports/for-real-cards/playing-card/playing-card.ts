/**
 * Created by kenono on 2016-05-06.
 */
import 'angular';
import {Meteor} from 'meteor/meteor';
import {Component} from '../../common/ui-twbs_ng15/util';
import {Card} from '../api/models/card.model'
import {Tools} from "../../common/api/services/tools";

@Component(
  {
    module: 'fastcards',
    selector: 'playingCard',
    controller: PlayingCard,
    controllerAs: 'vm',
    bindings: {
      card: '<',
      gameId: '@',
      imgClass: '@'
    },
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
  private card:Card;
  imgClass:string;
  imageURL():string {
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