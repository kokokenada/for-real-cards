# For Real Cards
An app for learning or demonstrating techniques and the start of a common collection of reusable components.  It uses Angular 2 and Meteor.
 
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
* Fix avatars not being displayed in mobile app and deployed
* Fix modal dialogs
* Use mobile camera for avatar
* Improve layout of Join Game dialog and use proper Ng approaches, error handling
* NgMaterial Styling
* Ionic Styling
* Re-use API's from React Native
 




 

