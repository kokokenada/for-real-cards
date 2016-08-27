/**
 * Created by kenono on 2016-04-21.
 */
import { Meteor } from 'meteor/meteor';
import 'meteor/jalik:ufs'; declare let UploadFS:any;
import { Mongo } from 'meteor/mongo';
import * as log from 'loglevel'
declare let require;
declare let gm:any;

if (Meteor.isServer) {
  gm = require('gm');
}
export const AvatarOriginalCollection = new Mongo.Collection('avatar-original');
export const AvatarMediumCollection = new Mongo.Collection('avatar-medium');
export const AvatarThumbCollection = new Mongo.Collection('avatar-thumb');


function loggedIn(userId) {
  return !!userId;
}


export const AvatarMediumStore = new UploadFS.store.GridFS({
  collection: AvatarMediumCollection,
  name: 'avatar-medium',
  transformWrite(from, to, fileId, file) {
    gm(from, file.name)
      .resize(250, 250)
      .gravity('Center')
      .extent(250, 250)
      .quality(100)
      .stream()
      .pipe(to);
    console.log('finished(?) transform medium')
    console.log(file)
  },
  onFinishUpload: (file)=>{
    console.log('finished upload medium')
    console.log(file)
    Meteor.users.update({_id: file.userId}, {$set: {'profile.avatar-medium': file.url}})
  },

});
export const AvatarThumbsStore = new UploadFS.store.GridFS({
  collection: AvatarThumbCollection,
  name: 'avatar-thumbs',
  transformWrite(from, to, fileId, file) {
    gm(from, file.name)
      .resize(50, 50)
      .gravity('Center')
      .extent(50, 50)
      .quality(75)
      .stream()
      .pipe(to);
    console.log('finished(?) transform thumb')
    console.log(file)
  },
  onFinishUpload: (file)=>{
    console.log('finished upload thumb')
    console.log(file)
    Meteor.users.update({_id: file.userId}, {$set: {'profile.avatar-thumb': file.url}})
  },

});
export const AvatarOriginalStore = new UploadFS.store.GridFS({
  collection: AvatarOriginalCollection,
  name: 'avatar-original',
  onFinishUpload: (file)=>{
    console.log('finished upload original')
    console.log(file)
    Meteor.users.update({_id: file.userId}, {$set: {'profile.avatar-original': file.url}})
  },
  filter: new UploadFS.Filter({
    contentTypes: ['image/*']
  }),
  copyTo: [
    AvatarMediumStore,
    AvatarThumbsStore
  ]
});

if (Meteor.isServer) {
  AvatarOriginalCollection.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  });
  AvatarMediumCollection.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  });
  AvatarThumbCollection.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  });

  Meteor.publish('common-app.avatar-images', function (_id, counter) {
    if (!_.isArray(_id))
      _id = [_id];
    return [
      AvatarOriginalCollection.find({_id: {$in: _id}, userId: this.userId}),
      AvatarMediumCollection.find({_id: {$in: _id}, userId: this.userId}),
      AvatarThumbCollection.find({_id: {$in: _id}, userId: this.userId})
    ];
  });
}

/* Old CollectionFS code, incase it gets undepricated or ufs doesn't work out

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




 */