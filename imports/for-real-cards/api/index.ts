/**
 * Created by kenono on 2016-05-25.
 */

import {initServerGameMethods} from "./models/game.methods";

export * from "./interfaces/card-image-style.interface";

export * from "./models/action.model";
export * from "./models/card.model";
export * from "./models/coordinates.class";
export * from "./models/deck.model";
export * from "./models/game.methods";
export * from "./models/game.model";
export * from "./models/game.publications";
export * from "./models/game-config";
export * from "./models/hand.model";

export * from "./services/drag-and-drop";
export * from "./services/game-rendering-tools";
export * from "./services/game-state";

export function initServer():void{
  initServerGameMethods();
}