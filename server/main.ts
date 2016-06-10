import * as log from 'loglevel';

import "/imports/common-app/api/index.ts"
import "/imports/for-real-cards/api/index.ts"

declare var BrowserPolicy;

log.setLevel(0, true)
// server/BroswerPolicyAndCORS.js
Meteor.startup(function() {
  console.log('Configuring content-security-policy');
  BrowserPolicy.content.allowSameOriginForAll();
  BrowserPolicy.content.allowOriginForAll('http://192.168.0.92');
  BrowserPolicy.content.allowOriginForAll('https://for-real-cards.scalingo.io');
  BrowserPolicy.content.allowOriginForAll('https://fabrica.scalingo.io');
  BrowserPolicy.content.allowOriginForAll('http://for-real-cards.scalingo.io');
  BrowserPolicy.content.allowOriginForAll('http://fabrica.scalingo.io');
  BrowserPolicy.content.allowEval();
  BrowserPolicy.framing.disallow();
});
