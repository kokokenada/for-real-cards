App.info({
  id: 'com.fabrica.forrealcards1',
  name: 'For Real Cards',
  version: "0.0.2",
  author: "Ken Ono, Fabrica Technology",
  email: "ken@fabrica.tech",
  website:"http://fabrica.tech"
});
App.setPreference('android-versionCode', '2');
App.accessRule("*");
App.accessRule("https://for-real-cards.scalingo.io");
App.accessRule("https://for-real-cards.fabrica.tech");
App.accessRule('data:*', { type: 'navigation' });