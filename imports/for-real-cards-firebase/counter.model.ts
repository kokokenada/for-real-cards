import {TopLevelNames} from './top-level-names';

export function getNextSequence(db:firebase.database.Database, counterType: string): Promise<string> {
  return new Promise( (resolve, reject) => {
    let databaseRef = db.ref(TopLevelNames.COUNTER).child(counterType).child('count');
    databaseRef.transaction(function(count) {
      if (count) {
        count = count + 1;
      } else {
        count = 1;
      }
      return count;
    }).then(
      (result) => {
        resolve(
          String(result.snapshot.val())
        );
      }
    ).catch(
      (error) => {
        reject(error);
      }
    );
  });
}


