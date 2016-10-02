import {Deck, GameConfig, defaultGames, DeckLocation, UserCommand} from "../api/index";
import {ModalBase} from '../../common-app/src/ui-ng2/modal/modal-base';
import {IModalState} from "../../common-app/src/ui/redux/modal/modal.types";

export class DealModalBase extends ModalBase {
  gameConfig: GameConfig;
  selectedPreset:string;

  ngOnInit() {
    this.modalReducer$.subscribe(
      (state:IModalState)=>{
        this.gameConfig = state.params.gameConfig;
      }
    );
  }
  getSelectedPreset():string {
    if (this.selectedPreset)
      return this.selectedPreset;
    return "Tap to select a game pre-set"
  }
  getPresets():GameConfig[] {
    return defaultGames;
  }
  selectPreset(presetIndex:number):void {
    let gameConfig = defaultGames[presetIndex];
    this.selectedPreset = gameConfig.name;
    this.gameConfig = _.extend(this.gameConfig, gameConfig);
  }
  getDecks() {
    return Deck.getDecks();
  }
  selectedDeckName():string {
    return this.gameConfig && this.gameConfig.deck ? this.gameConfig.deck.name : "";
  }
  selectDeck(index:number): void {
    this.gameConfig.deck = this.getDecks()[index];
    this.gameConfig._deck_id = this.gameConfig.deck.id;
  }
  selectedLocationName():string {
    return GameConfig.getLocationString(this.gameConfig.deckLocationAfterDeal);
  }
  getLocations():string[] {
    return [
      GameConfig.getLocationString(DeckLocation.CENTER),
      GameConfig.getLocationString(DeckLocation.OUT_OF_PLAY),
      GameConfig.getLocationString(DeckLocation.WITH_DEALER)
    ]
  }
  setLocation(index:number):void {
    for (let i=0; i<this.getLocations().length; i++) {
      if (GameConfig.getLocationString(index)===GameConfig.getLocationString(i)) {
        this.gameConfig.deckLocationAfterDeal = i;
        return
      }
    }
  }
  setTurnUp(value:boolean):void {
    this.gameConfig.turnCardUpAfterDeal = value;
  }
  setHasTricks(value:boolean):void {
    this.gameConfig.hasTricks = value;
  }
  getUserCommands():UserCommand[] {
    return this.gameConfig.getUserCommands();
  }
  setUserCommand(curFrom, curTo, index) {
    let userCommand:UserCommand = this.gameConfig.findCommand(curFrom, curTo);
    userCommand.cardCountAllowed = index;
  }
  getCardCountAllowedOptions():string[] {
    return GameConfig.getCardCountAllowedOptions();
  }
  deal() {
    this.gameConfig.pruneUserCommands();
    this.close(this.gameConfig);
  }
  cancel() {
    this.close(undefined);
  }
}
