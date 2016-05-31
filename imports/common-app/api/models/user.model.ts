/**
 * Created by kenono on 2016-04-21.
 */
import { Meteor } from 'meteor/meteor';
import  'meteor/aldeed:simple-schema';
import * as log from 'loglevel';

export class User {
  _id: string;
  username: string;
  emails: {
    address:string;
    verified:boolean;
  }[];
  profile: {
    name: string;
    avatar_id: string;
    firstName: string;
    lastName: string;
    birthday: Date;
    gender: string;
    organization: string;
    website: string;
    bio: string;
    country: {
      name: string;
      code: string;
    }
  };
  // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
  registered_emails: any;
  createdAt: Date;
  services: any;
  roles:string[];
  heartbeat: Date;
  presence: string;
}

// Taken from: https://github.com/aldeed/meteor-collection2
let Schema:any = {};

Schema.UserCountry = new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String,
    regEx: /^[A-Z]{2}$/
  }
});

Schema.UserProfile = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  avatar_id: {
    type: String,
    optional: true
  },
  firstName: {
    type: String,
    optional: true
  },
  lastName: {
    type: String,
    optional: true
  },
  birthday: {
    type: Date,
    optional: true
  },
  gender: {
    type: String,
    allowedValues: ['Male', 'Female'],
    optional: true
  },
  organization: {
    type: String,
    optional: true
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  bio: {
    type: String,
    optional: true
  },
  country: {
    type: Schema.UserCountry,
    optional: true
  }
});

Schema.User = new SimpleSchema({
  username: {
    type: String, // Halo will use as display name in forums/social if real name not desired
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true
  },
  emails: {
    type: Array,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
  registered_emails: {
    type: [Object],
    optional: true,
    blackbox: true
  },
  createdAt: {
    type: Date,
      autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    },
    denyUpdate: true
  },
  profile: {
    type: Schema.UserProfile,
    optional: true
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  //roles: {
  //  type: Object,
  // optional: true,
  // blackbox: true
  //},
  // Option 2: [String] type
  // If you are sure you will never need to use role groups, then
  // you can specify [String] as the type
  roles: {
    type: [String],
    optional: true
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  },
  presence: {
    type: String,
    optional: true
  }
});

Meteor.users.attachSchema(Schema.User);

function addTestUser(username:string, email:string, role:string) {
  let existsUser:any = Accounts.findUserByEmail(email) ? true : false;
  if (existsUser) {
    Meteor.users.remove({_id: existsUser._id});
  }
  const password = "1234";
  var user = Accounts.createUser({username: username, email: email, password: password});
  Roles.addUsersToRoles(user, [role]);
  log.info("Created Username:" + username + ", email: " + email +", password:" + password + ", role:" + role );
}

function checkOrCreateRole(roleName) {
  let roles:{}[] = Meteor.roles.find().fetch();
  let roleIndex:number = _.find(roles, (role)=>{
    return roleName===role;
  }) ;

  if (roleIndex===-1) {
    Roles.createRole(roleName);
  }
}

function addTestUsers() {

  checkOrCreateRole('admin');
  checkOrCreateRole('user');

  addTestUser("admin", "admin@app.com", 'admin');
  addTestUser("ann", "ann@app.com", 'user');
  addTestUser("bob", "bob@app.com", 'user');
  addTestUser("fred", "fred@app.com", 'user');
  addTestUser("sue", "sue@app.com", 'user');
}

if (Meteor.isServer) {

  Meteor.publish("user-edit", function (options) {
    if (!this.userId) {
      return this.ready();
    }
    return Meteor.users.find(
      {_id: this.userId},
      {
        fields: {
          username: true,
          profile: true,
          emails: true
        }
      }
    );
  });

  Meteor.startup(function () {
    if (Meteor.users.find().count() === 0) {
      log.info("Seeding database");
      addTestUsers();
    }
  });
}