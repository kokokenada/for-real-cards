import 'reflect-metadata';
import {INITIAL_STATE_GAME_PLAY} from './game-play.reducer';
import {gamePlayReducer} from './game-play.reducer';
import {GamePlayActions} from './game-play-actions.class';

import 'mocha';
import * as chai from "chai";
import {IPayloadAction} from 'redux-package';
import {IGamePlayState} from './game-play.types';
import {GamePlayAction, GamePlayActionType} from '../../../api/models/action.model';

describe('gamePlayReducer reducer', () => {
  describe('game sequence 1', () => {
    it('has expected stae during sequence', () => {
      const prevState = INITIAL_STATE_GAME_PLAY;

      // START GAME
      let action: IPayloadAction = {
        type: GamePlayActions.GAME_PLAY_INITIALIZE,
        payload: {gameId: '3'}
      };
      let nextState = gamePlayReducer(prevState, action);
      let gameState: IGamePlayState = nextState.toJS();
      let obj: any = gameState;

      chai.expect(obj.hands.length).to.be.equal(0);
      chai.expect(obj.tableFaceDown.length).to.be.equal(0);
      chai.expect(obj.tablePile.length).to.be.equal(0);

      // NEW GAME
      action = {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          "gamePlayAction": new GamePlayAction({
            gameId: '3',
            creatorId: 'ken',
            actionType: GamePlayActionType.NEW_GAME
          })
        }
      };
      nextState = gamePlayReducer(nextState, action);

      // ADD FIRST PLAYER
      action = {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            "_id": "newhand:gmPEbtsMiCWwHGzou",
            "gameId": "3",
            "creatorId": "535ooJRmaopqdapEv",
            "actionType": GamePlayActionType.NEW_HAND,
            "sequencePosition": 0
          },
          newHand: {
            "gameId": "3",
            "position": 0,
            "userId": "535ooJRmaopqdapEv",
            "dateCreated": "2017-03-25T01:43:29.173Z",
            "_id": "gmPEbtsMiCWwHGzou"
          }
        }
      };

      nextState = gamePlayReducer(nextState, action);
      obj = nextState.toJS();

      chai.expect(JSON.parse(JSON.stringify(obj.hands[0]))).to.deep.equal(
        {
          "cardsFaceDown": [],
          "cardsFaceUp": [],
          "cardsInHand": [],
          "tricks": [],
          "handSortSequence": 1,
          "gameId": "3",
          "position": 0,
          "userId": "535ooJRmaopqdapEv",
          "dateCreated": "2017-03-25T01:43:29.173Z",
          "_id": "gmPEbtsMiCWwHGzou"
        }
      );

      // ADD SECOND PLAYER PLAYER
      action = {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            "_id": "newhand:spE2L5zZ6HnrYQqJi",
            "gameId": "3",
            "creatorId": "535ooJRmaopqdapEv",
            "actionType": GamePlayActionType.NEW_HAND,
            "sequencePosition": 1
          },
          newHand: {
            "gameId": "3",
            "position": 1,
            "userId": "jrertmPJ5uW39cqmD",
            "dateCreated": "2017-03-25T22:44:17.285Z",
            "_id": "spE2L5zZ6HnrYQqJi"
          }
        }
      };

      nextState = gamePlayReducer(nextState, action);
      obj = nextState.toJS();
      chai.expect(JSON.parse(JSON.stringify(obj.hands))).to.deep.equal(
        [
          {
            "cardsFaceDown": [],
            "cardsFaceUp": [],
            "cardsInHand": [],
            "tricks": [],
            "handSortSequence": 1,
            "gameId": "3",
            "position": 0,
            "userId": "535ooJRmaopqdapEv",
            "dateCreated": "2017-03-25T01:43:29.173Z",
            "_id": "gmPEbtsMiCWwHGzou"
          },
          {
            "cardsFaceDown": [],
            "cardsFaceUp": [],
            "cardsInHand": [],
            "tricks": [],
            "handSortSequence": 1,
            "gameId": "3",
            "position": 1,
            "userId": "jrertmPJ5uW39cqmD",
            "dateCreated": "2017-03-25T22:44:17.285Z",
            "_id": "spE2L5zZ6HnrYQqJi"
          }
        ]
      );

      // RESET
      action = {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            "gameId": "3",
            "creatorId": "535ooJRmaopqdapEv",
            "actionType": GamePlayActionType.RESET,
            "dateCreated": "2017-03-25T22:50:28.910Z",
            "_id": "JFcEFkHcXeicqNA9E",
            "cards": [],
            "sequencePosition": 2
          }
        }
      };
      nextState = gamePlayReducer(nextState, action);

      // DEAL
      action = {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            "gameId": "3",
            "creatorId": "535ooJRmaopqdapEv",
            "actionType": GamePlayActionType.DEAL,
            "gameConfig": {
              "name": "Crazy Eights",
              "minimumNumberOfPlayers": 2,
              "maximumNumberOfPlayers": 5,
              "deck": {
                "id": 2,
                "name": "Standard - Ace High",
                "cards": [
                  {
                    "suit": 0,
                    "rank": 2
                  },
                  {
                    "suit": 1,
                    "rank": 2
                  },
                  {
                    "suit": 2,
                    "rank": 2
                  },
                  {
                    "suit": 3,
                    "rank": 2
                  },
                  {
                    "suit": 0,
                    "rank": 3
                  },
                  {
                    "suit": 1,
                    "rank": 3
                  },
                  {
                    "suit": 2,
                    "rank": 3
                  },
                  {
                    "suit": 3,
                    "rank": 3
                  },
                  {
                    "suit": 0,
                    "rank": 4
                  },
                  {
                    "suit": 1,
                    "rank": 4
                  },
                  {
                    "suit": 2,
                    "rank": 4
                  },
                  {
                    "suit": 3,
                    "rank": 4
                  },
                  {
                    "suit": 0,
                    "rank": 5
                  },
                  {
                    "suit": 1,
                    "rank": 5
                  },
                  {
                    "suit": 2,
                    "rank": 5
                  },
                  {
                    "suit": 3,
                    "rank": 5
                  },
                  {
                    "suit": 0,
                    "rank": 6
                  },
                  {
                    "suit": 1,
                    "rank": 6
                  },
                  {
                    "suit": 2,
                    "rank": 6
                  },
                  {
                    "suit": 3,
                    "rank": 6
                  },
                  {
                    "suit": 0,
                    "rank": 7
                  },
                  {
                    "suit": 1,
                    "rank": 7
                  },
                  {
                    "suit": 2,
                    "rank": 7
                  },
                  {
                    "suit": 3,
                    "rank": 7
                  },
                  {
                    "suit": 0,
                    "rank": 8
                  },
                  {
                    "suit": 1,
                    "rank": 8
                  },
                  {
                    "suit": 2,
                    "rank": 8
                  },
                  {
                    "suit": 3,
                    "rank": 8
                  },
                  {
                    "suit": 0,
                    "rank": 9
                  },
                  {
                    "suit": 1,
                    "rank": 9
                  },
                  {
                    "suit": 2,
                    "rank": 9
                  },
                  {
                    "suit": 3,
                    "rank": 9
                  },
                  {
                    "suit": 0,
                    "rank": 10
                  },
                  {
                    "suit": 1,
                    "rank": 10
                  },
                  {
                    "suit": 2,
                    "rank": 10
                  },
                  {
                    "suit": 3,
                    "rank": 10
                  },
                  {
                    "suit": 0,
                    "rank": 11
                  },
                  {
                    "suit": 1,
                    "rank": 11
                  },
                  {
                    "suit": 2,
                    "rank": 11
                  },
                  {
                    "suit": 3,
                    "rank": 11
                  },
                  {
                    "suit": 0,
                    "rank": 12
                  },
                  {
                    "suit": 1,
                    "rank": 12
                  },
                  {
                    "suit": 2,
                    "rank": 12
                  },
                  {
                    "suit": 3,
                    "rank": 12
                  },
                  {
                    "suit": 0,
                    "rank": 13
                  },
                  {
                    "suit": 1,
                    "rank": 13
                  },
                  {
                    "suit": 2,
                    "rank": 13
                  },
                  {
                    "suit": 3,
                    "rank": 13
                  },
                  {
                    "suit": 0,
                    "rank": 1
                  },
                  {
                    "suit": 1,
                    "rank": 1
                  },
                  {
                    "suit": 2,
                    "rank": 1
                  },
                  {
                    "suit": 3,
                    "rank": 1
                  }
                ]
              },
              "_deck_id": 2,
              "dealSequence": [
                {
                  "dealLocation": 0,
                  "minimumNumberOfCards": 8,
                  "maximumNumberOfCards": 8
                }
              ],
              "deckLocationAfterDeal": 0,
              "turnCardUpAfterDeal": true,
              "hasTricks": false,
              "userCommands": [
                {
                  "from": 0,
                  "to": 0,
                  "cardCountAllowed": 1
                },
                {
                  "from": 0,
                  "to": 1,
                  "cardCountAllowed": 1
                },
                {
                  "from": 0,
                  "to": 2,
                  "cardCountAllowed": 0
                },
                {
                  "from": 0,
                  "to": 3,
                  "cardCountAllowed": 0
                },
                {
                  "from": 1,
                  "to": 0,
                  "cardCountAllowed": 0
                },
                {
                  "from": 1,
                  "to": 1,
                  "cardCountAllowed": 0
                },
                {
                  "from": 1,
                  "to": 2,
                  "cardCountAllowed": 0
                },
                {
                  "from": 1,
                  "to": 3,
                  "cardCountAllowed": 0
                },
                {
                  "from": 2,
                  "to": 0,
                  "cardCountAllowed": 1
                },
                {
                  "from": 2,
                  "to": 1,
                  "cardCountAllowed": 0
                },
                {
                  "from": 2,
                  "to": 2,
                  "cardCountAllowed": 0
                },
                {
                  "from": 2,
                  "to": 3,
                  "cardCountAllowed": 0
                },
                {
                  "from": 3,
                  "to": 0,
                  "cardCountAllowed": 0
                },
                {
                  "from": 3,
                  "to": 1,
                  "cardCountAllowed": 0
                },
                {
                  "from": 3,
                  "to": 2,
                  "cardCountAllowed": 0
                },
                {
                  "from": 3,
                  "to": 3,
                  "cardCountAllowed": 0
                }
              ]
            },
            "cardsEncoded": "6D5D4C7S2D8C6C9HjC9D9SaC8H2S3HjS5C5H3C7H8D6SqHkDaDtCtHtS8SjD3S2C7DaHqC4S2H4H3D5S9CjHqSkSaSqDkC6H7C4DkHtD",
            "dateCreated": "2017-03-25T22:50:35.423Z",
            "_id": "KYEqfnnQAbbmTDMS5",
            "cards": [
              {
                "rank": 6,
                "suit": 3
              },
              {
                "rank": 5,
                "suit": 3
              },
              {
                "rank": 4,
                "suit": 0
              },
              {
                "rank": 7,
                "suit": 1
              },
              {
                "rank": 2,
                "suit": 3
              },
              {
                "rank": 8,
                "suit": 0
              },
              {
                "rank": 6,
                "suit": 0
              },
              {
                "rank": 9,
                "suit": 2
              },
              {
                "rank": 11,
                "suit": 0
              },
              {
                "rank": 9,
                "suit": 3
              },
              {
                "rank": 9,
                "suit": 1
              },
              {
                "rank": 1,
                "suit": 0
              },
              {
                "rank": 8,
                "suit": 2
              },
              {
                "rank": 2,
                "suit": 1
              },
              {
                "rank": 3,
                "suit": 2
              },
              {
                "rank": 11,
                "suit": 1
              },
              {
                "rank": 5,
                "suit": 0
              },
              {
                "rank": 5,
                "suit": 2
              },
              {
                "rank": 3,
                "suit": 0
              },
              {
                "rank": 7,
                "suit": 2
              },
              {
                "rank": 8,
                "suit": 3
              },
              {
                "rank": 6,
                "suit": 1
              },
              {
                "rank": 12,
                "suit": 2
              },
              {
                "rank": 13,
                "suit": 3
              },
              {
                "rank": 1,
                "suit": 3
              },
              {
                "rank": 10,
                "suit": 0
              },
              {
                "rank": 10,
                "suit": 2
              },
              {
                "rank": 10,
                "suit": 1
              },
              {
                "rank": 8,
                "suit": 1
              },
              {
                "rank": 11,
                "suit": 3
              },
              {
                "rank": 3,
                "suit": 1
              },
              {
                "rank": 2,
                "suit": 0
              },
              {
                "rank": 7,
                "suit": 3
              },
              {
                "rank": 1,
                "suit": 2
              },
              {
                "rank": 12,
                "suit": 0
              },
              {
                "rank": 4,
                "suit": 1
              },
              {
                "rank": 2,
                "suit": 2
              },
              {
                "rank": 4,
                "suit": 2
              },
              {
                "rank": 3,
                "suit": 3
              },
              {
                "rank": 5,
                "suit": 1
              },
              {
                "rank": 9,
                "suit": 0
              },
              {
                "rank": 11,
                "suit": 2
              },
              {
                "rank": 12,
                "suit": 1
              },
              {
                "rank": 13,
                "suit": 1
              },
              {
                "rank": 1,
                "suit": 1
              },
              {
                "rank": 12,
                "suit": 3
              },
              {
                "rank": 13,
                "suit": 0
              },
              {
                "rank": 6,
                "suit": 2
              },
              {
                "rank": 7,
                "suit": 0
              },
              {
                "rank": 4,
                "suit": 3
              },
              {
                "rank": 13,
                "suit": 2
              },
              {
                "rank": 10,
                "suit": 3
              }
            ],
            "sequencePosition": 3
          }
        }
      };
      nextState = gamePlayReducer(nextState, action);

      action = {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            "gameId": "3",
            "creatorId": "535ooJRmaopqdapEv",
            "actionType": GamePlayActionType.DECK_TO_HAND,
            "toPlayerId": "535ooJRmaopqdapEv",
            "visibilityType": 2,
            "relatedActionId": "KYEqfnnQAbbmTDMS5",
            "cardsEncoded": "6D5D4C7S2D8C6C9H",
            "dateCreated": "2017-03-25T22:50:35.433Z",
            "_id": "FXEdeGA33x8q9tETB",
            "cards": [
              {
                "rank": 6,
                "suit": 3
              },
              {
                "rank": 5,
                "suit": 3
              },
              {
                "rank": 4,
                "suit": 0
              },
              {
                "rank": 7,
                "suit": 1
              },
              {
                "rank": 2,
                "suit": 3
              },
              {
                "rank": 8,
                "suit": 0
              },
              {
                "rank": 6,
                "suit": 0
              },
              {
                "rank": 9,
                "suit": 2
              }
            ],
            "sequencePosition": 4
          }
        }
      };
      nextState = gamePlayReducer(nextState, action);


      action = {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            "gameId": "3",
            "creatorId": "535ooJRmaopqdapEv",
            "actionType": GamePlayActionType.DECK_TO_HAND,
            "toPlayerId": "jrertmPJ5uW39cqmD",
            "visibilityType": 2,
            "relatedActionId": "KYEqfnnQAbbmTDMS5",
            "cardsEncoded": "jC9D9SaC8H2S3HjS",
            "dateCreated": "2017-03-25T22:50:35.444Z",
            "_id": "qHvYsqrczbLNXs99z",
            "cards": [
              {
                "rank": 11,
                "suit": 0
              },
              {
                "rank": 9,
                "suit": 3
              },
              {
                "rank": 9,
                "suit": 1
              },
              {
                "rank": 1,
                "suit": 0
              },
              {
                "rank": 8,
                "suit": 2
              },
              {
                "rank": 2,
                "suit": 1
              },
              {
                "rank": 3,
                "suit": 2
              },
              {
                "rank": 11,
                "suit": 1
              }
            ],
            "sequencePosition": 5
          }
        }
      };

      nextState = gamePlayReducer(nextState, action);


      action = {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            "gameId": "3",
            "creatorId": "535ooJRmaopqdapEv",
            "actionType": GamePlayActionType.DECK_TO_PILE,
            "relatedActionId": "KYEqfnnQAbbmTDMS5",
            "dateCreated": "2017-03-25T22:50:35.447Z",
            "_id": "sJsAZmoi4buykYM8C",
            "cards": [],
            "sequencePosition": 6
          }
        }
      };

      nextState = gamePlayReducer(nextState, action);


      obj = nextState.toJS();
      chai.expect(JSON.parse(JSON.stringify(obj.hands))).to.deep.equal(
        [
          {
            "cardsFaceDown": [],
            "cardsFaceUp": [],
            "cardsInHand": [
              {
                "rank": 6,
                "suit": 3
              },
              {
                "rank": 5,
                "suit": 3
              },
              {
                "rank": 4,
                "suit": 0
              },
              {
                "rank": 7,
                "suit": 1
              },
              {
                "rank": 2,
                "suit": 3
              },
              {
                "rank": 8,
                "suit": 0
              },
              {
                "rank": 6,
                "suit": 0
              },
              {
                "rank": 9,
                "suit": 2
              }
            ],
            "tricks": [],
            "handSortSequence": 1,
            "gameId": "3",
            "position": 0,
            "userId": "535ooJRmaopqdapEv",
            "dateCreated": "2017-03-25T01:43:29.173Z",
            "_id": "gmPEbtsMiCWwHGzou"
          },
          {
            "cardsFaceDown": [],
            "cardsFaceUp": [],
            "cardsInHand": [
              {
                "rank": 11,
                "suit": 0
              },
              {
                "rank": 9,
                "suit": 3
              },
              {
                "rank": 9,
                "suit": 1
              },
              {
                "rank": 1,
                "suit": 0
              },
              {
                "rank": 8,
                "suit": 2
              },
              {
                "rank": 2,
                "suit": 1
              },
              {
                "rank": 3,
                "suit": 2
              },
              {
                "rank": 11,
                "suit": 1
              }
            ],
            "tricks": [],
            "handSortSequence": 1,
            "gameId": "3",
            "position": 1,
            "userId": "jrertmPJ5uW39cqmD",
            "dateCreated": "2017-03-25T22:44:17.285Z",
            "_id": "spE2L5zZ6HnrYQqJi"
          }
        ]
      );

      chai.expect(JSON.parse(JSON.stringify(obj.tableFaceDown))).to.deep.equal(
        [
          {
            "rank": 5,
            "suit": 2
          },
          {
            "rank": 3,
            "suit": 0
          },
          {
            "rank": 7,
            "suit": 2
          },
          {
            "rank": 8,
            "suit": 3
          },
          {
            "rank": 6,
            "suit": 1
          },
          {
            "rank": 12,
            "suit": 2
          },
          {
            "rank": 13,
            "suit": 3
          },
          {
            "rank": 1,
            "suit": 3
          },
          {
            "rank": 10,
            "suit": 0
          },
          {
            "rank": 10,
            "suit": 2
          },
          {
            "rank": 10,
            "suit": 1
          },
          {
            "rank": 8,
            "suit": 1
          },
          {
            "rank": 11,
            "suit": 3
          },
          {
            "rank": 3,
            "suit": 1
          },
          {
            "rank": 2,
            "suit": 0
          },
          {
            "rank": 7,
            "suit": 3
          },
          {
            "rank": 1,
            "suit": 2
          },
          {
            "rank": 12,
            "suit": 0
          },
          {
            "rank": 4,
            "suit": 1
          },
          {
            "rank": 2,
            "suit": 2
          },
          {
            "rank": 4,
            "suit": 2
          },
          {
            "rank": 3,
            "suit": 3
          },
          {
            "rank": 5,
            "suit": 1
          },
          {
            "rank": 9,
            "suit": 0
          },
          {
            "rank": 11,
            "suit": 2
          },
          {
            "rank": 12,
            "suit": 1
          },
          {
            "rank": 13,
            "suit": 1
          },
          {
            "rank": 1,
            "suit": 1
          },
          {
            "rank": 12,
            "suit": 3
          },
          {
            "rank": 13,
            "suit": 0
          },
          {
            "rank": 6,
            "suit": 2
          },
          {
            "rank": 7,
            "suit": 0
          },
          {
            "rank": 4,
            "suit": 3
          },
          {
            "rank": 13,
            "suit": 2
          },
          {
            "rank": 10,
            "suit": 3
          }
        ]
      );

      chai.expect(JSON.parse(JSON.stringify(obj.tablePile))).to.deep.equal(
        [
          {
            "rank": 5,
            "suit": 0
          }
        ]
      );

    });
  });
});
