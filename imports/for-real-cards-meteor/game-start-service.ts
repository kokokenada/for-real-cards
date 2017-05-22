import {IDocumentChange, IException, IUser} from 'common-app';
import {IGameStartService} from '../for-real-cards-lib';
import {Observable} from 'rxjs/Observable';


export class GamePlayStartMeteor implements IGameStartService {
  newGame(password: string): Promise<string> {
    return new Promise( (resolve, reject)=> {

      Meteor.call('ForRealCardsNewGame', password, (error, gameId)=> {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(gameId);
        }
      });

    });
  }

  joinGame(gameId: string, password: string): Promise <boolean> {
    return new Promise( (resolve, reject)=> {
      Meteor.call('ForRealCardsJoinGame', gameId, password, (error, result) => {
        if (error) {
          console.error('ForRealCardsJoinGame returned error');
          console.error(error);
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

  loadGame(gameId: string, password: string): Promise <boolean> {
    return new Promise( (resolve, reject)=> {
      Meteor.call('ForRealCardsViewGameCheck', gameId, password, (error, result) => {
        if (error) {
          console.error('ForRealCardsViewGameCheck returned error');
          console.error(error);
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

  watchRelatedUsers(gameId: string): Promise<Observable<IDocumentChange<IUser>>> {
    return new Promise((resolve, reject) => {
      resolve(Observable.never()); // This happens with a server side publication.  No implementation needed
    });
  }
}