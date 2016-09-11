# For Real Cards
An app for learning or demonstrating techniques and the start of a common collection of reusable components.  It uses Angular 2 and Meteor.

I am blogging about my experiences here [www.fabrica.tech](http://www.fabrica.tech)
 
## Common-app
Reusable commponents to serve a startting point for other apps.  Will be broken off into a seperate repository.

## For real cards
A sample app that demonstrates Meteor's real time capabilities in the form of a card game.  The game engine knows no card game rules and tries to emulate playing cards for real. 
 A fair amount of game specific configuration was required in order to control the allowed actions. (E.g. should user's be able to pull a card from the top of the deck or place cards 
 face up on the table.)
  
## Directory structures

* Follows Meteor 1.3 approaches

* api/* should be free of any presentation tier specifics to allow a mixing progression to UI styling techniques.  E.g. iterations of an app might use Bootstrap for 
web and mobile progress, to Ionic or React Native on mobile, while preserving all the logic in api/


# LICENSE

Common-app components are MIT
For Real Cards are Creative Common Attribution-NonCommercial
All files under import/for-real-cards are released in GPL 3.0.  All other files are MIT.

## To Do
### Framework
* Fix styling of edit profile
* Change Password
* Password recovery
* Fix modal dialogs
* Login with Facebook (etc)
* Automatic deletion of tmp users
* Welcome page with links to apps
* Upgrades (Angular rc6 or final)
* Get pagination working (ng2-paginate)
* Fix null in login field bug
* Fix delayed paint on user admin
* Add croping in avatar upload
* Add cropping of Avatar
* NgMaterial Styling
* Ionic Styling
* Re-use API's for native app (Reactive Native Script???)

### Gameplay
* Refresh or deep linking with game ID in URL should work (wait until Angular 2 upgraded to final and use correct router) 
* Leave game, boot a player from a game
* More game templates
  * Hearts
  * Poker
  * Texas Hold em
  * Wizard
 




 

