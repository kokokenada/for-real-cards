import {Deck, GameConfig, defaultGames, DeckLocation, UserCommand} from "../api/index";
import {ModalBase} from '../../common-app/src/ui-ng2/modal/modal-base';
import {IModalState} from "../../common-app/src/ui/redux/modal/modal.types";
import {DealModalParamAndResult} from "./deal-modal-params-and-result";

export class DealModalBase extends ModalBase<DealModalParamAndResult, DealModalParamAndResult> {
  gameConfig: GameConfig;
  selectedPreset:string;

  ngOnInit() {
    this.modalReducer$.subscribe(
      (state:IModalState<DealModalParamAndResult, DealModalParamAndResult>)=>{
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
    this.gameConfig =  _.extend(this.gameConfig, gameConfig);
  }
  deal() {
    this.gameConfig.pruneUserCommands();
    this.close({gameConfig: this.gameConfig});
  }
  cancel() {
    this.close(null);
  }
}
