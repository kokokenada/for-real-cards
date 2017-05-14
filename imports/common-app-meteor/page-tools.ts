/**
 * Created by kenono on 2016-05-02.
 */


export interface FilterDefinition {
  filter: string,
  skip: number,
  sort: SortDefinitionSingle
}

export interface SortDefinitionSingle {
  key: string;
  direction: number
}

export class PagingTools {

  /**
   * checks options, throws if not right
   * 
   * @param options:FilterDefinition
   */
  static check(options:FilterDefinition):void {

    let positiveInteger = Match.Where(function(x) {
      check(x, Match.Integer);
      return x >= 0;
    });

    check(options, Match.ObjectIncluding({
      filter: String,
      skip: Match.OneOf(positiveInteger, undefined, null),
      sort: Match.OneOf(Object, undefined, null)
      // sort: Match.OneOf(Match.ObjectIncluding({ direction: Match.OneOf(1, -1), key: String }), null, undefined)
    }));
  }  
}