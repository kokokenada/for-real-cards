import * as log from 'loglevel';

import "/imports/for-real-cards/api/index.ts"

declare var BrowserPolicy;

log.setLevel(0, true)

Meteor.startup(function() {
  console.log('Configuring content-security-policy');
  BrowserPolicy.content.allowSameOriginForAll();
  BrowserPolicy.content.allowOriginForAll('http://192.168.0.92');
  BrowserPolicy.content.allowOriginForAll('http://fonts.googleapis.com');
  BrowserPolicy.content.allowOriginForAll('http://fonts.gstatic.com');
  BrowserPolicy.content.allowOriginForAll('https://maxcdn.bootstrapcdn.com');
  BrowserPolicy.content.allowOriginForAll('https://for-real-cards.scalingo.io');
  BrowserPolicy.content.allowOriginForAll('https://for-real-cards.fabrica.tech');
  BrowserPolicy.content.allowOriginForAll('http://for-real-cards.scalingo.io');
  BrowserPolicy.content.allowOriginForAll('http://for-real-cards.fabrica.tech');
  BrowserPolicy.content.allowEval();
  BrowserPolicy.framing.disallow();
});