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
  permissions: new UploadFS.StorePermissions(
    {
      insert: loggedIn,
      update: loggedIn,
      remove: loggedIn
    }
  )
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
  permissions: new UploadFS.StorePermissions(
    {
      insert: loggedIn,
      update: loggedIn,
      remove: loggedIn
    }
  )
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
  ],
  permissions: new UploadFS.StorePermissions(
    {
      insert: loggedIn,
      update: loggedIn,
      remove: loggedIn
    }
  )
});

if (Meteor.isServer) {

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

