/**
 * Created by kenono on 2016-04-21.
 */
import { Meteor } from 'meteor/meteor';
import 'meteor/cfs:standard-packages'
import * as log from 'loglevel'

import { AccountTools } from "../services/account-tools";



export let AvatarCollection:any = {};
AvatarCollection = new FS.Collection("avatars", {
  stores: [
    new FS.Store.GridFS("avatar-upload",
      {
        beforeWrite: function (fileObj) {
          return {
            extension: 'png',
            type: 'image/png'
          };
        },
        transformWrite: function (fileObj, readStream, writeStream) {

          gm(readStream).size({bufferStream: true},
            Meteor.bindEnvironment(
              function (error, value) {
                if (error) {
                  log.error("Error reading size of image:");
                  log.error(error);
                } else {
                  Meteor.setTimeout( () => {
                    AvatarCollection.update(
                      {_id: fileObj._id},
                      {
                        $set: {
                          width: value.width,
                          height: value.height,
                          imageReady: true
                        }
                      }
                    );
                  }, 1000); // Wait for file to be put in database
                }
              }
            )
            )
            .stream('PNG').pipe(writeStream);
        }
      }),
    new FS.Store.GridFS("avatar-thumb", {
      beforeWrite: function (fileObj) {
        return {
          extension: 'png',
          type: 'image/png'
        };
      },
      transformWrite: function (fileObj, readStream, writeStream) {
        gm(readStream).resize(50).stream('PNG').pipe(writeStream);
      }
    }),
    new FS.Store.GridFS("avatar-medium", {
      beforeWrite: function (fileObj) {
        return {
          extension: 'png',
          type: 'image/png'
        };
      },
      transformWrite: function (fileObj, readStream, writeStream) {
        gm(readStream).resize(250).stream('PNG').pipe(writeStream);
      }
    })

  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});
if (Meteor.isServer) {
  AvatarCollection.allow({
    insert: function (userId, doc) {
      return (userId ? doc.userId === userId : false);
    },
    remove: function (userId, doc) {
      return (userId ? doc.userId === userId : false);
    },
    download: function (userId) {
      return (userId ? true : false);
    },
    update: function (userId, doc) {
      return (userId ? doc.userId === userId : false);
    }
  });

  Meteor.publish('common.avatar-images', function (_id, counter) {
    if (!_.isArray(_id))
      _id = [_id];
    return AvatarCollection.find({_id: {$in: _id}, userId: this.userId});
  });
}

AvatarCollection.imageURL = (image_id:string, size:string) => {

  let store:string;
  if (size==='medium' || !size)
    store = 'avatar-medium';
  else if (size ==='thumb')
    store = 'avatar-thumb';
  else if (size === 'original')
    store = 'avatar-original';
  else {
    log.error('Unsupported size: ' + size + '. Using avatar-medium');
    store = 'avatar-medium';
  }
  var queryString = "?store=" + store;
  var token = AccountTools.getToken();
  if (token!=="")
    queryString += '&token=' + token;
  return Meteor.absoluteUrl('cfs/files/avatars/' + image_id + queryString);

};
AvatarCollection.defaultAvatarUrl = ()=> {
  return Meteor.absoluteUrl('/default-avatar.png');
};