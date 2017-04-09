import {Deck, GameConfig, defaultGames, DeckLocation, UserCommand} from "../api/index";
import {ModalBase} from '../../common-app/src/ui-ng2/modal/modal-base';
import {IModalState} from "../../common-app/src/ui/redux/modal/modal.types";
import {DealModalParam, DealModalResult} from "./deal-modal-params-and-result";
import {IGamePlayState} from '../ui/redux/game-play/game-play.types';
import {GamePlayFunctions} from '../ui/redux/game-play/game-play.functions';

export class DealModalBase extends ModalBase<DealModalParam, DealModalResult> {
  gameConfig: GameConfig;
  gameState: IGamePlayState;
  selectedPreset:string;

  ngOnInit() {
    this.modalReducer$.subscribe(
      (state:IModalState<DealModalParam, DealModalResult>)=>{
        this.gameState = state.params.gameState;
        this.gameConfig = this.gameState.currentGameConfig;
      }
    );
  }

  isMidSequence() : boolean {
    return GamePlayFunctions.isMidDealSequence(this.gameState);
  }

  nextDealStepDescription() : string {
    return GamePlayFunctions.nextDealStepDescription(this.gameState);
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
    this.close({gameConfig: this.gameConfig, nextStep: false});
  }
  nextStep() {
    this.close({nextStep: true});
  }
  cancel() {
    this.close(null);
  }
}
