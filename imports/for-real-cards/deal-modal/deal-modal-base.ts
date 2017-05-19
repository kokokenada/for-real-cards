import {GameConfig, defaultGames, GamePlayFunctions, IGamePlayState} from "../../for-real-cards-lib";
import {ModalBase, IModalState} from '../../common-app/src';
import {DealModalParam, DealModalResult} from "./deal-modal-params-and-result";


export class DealModalBase extends ModalBase<DealModalParam, DealModalResult> {
  gameConfig: GameConfig;
  gameState: IGamePlayState;
  selectedPreset: string;
  numberOfCards: number;
  currentGameName: string;
  static defaultNumberOfCards = 0;

  ngOnInit() {
    this.modalReducer$.subscribe(
      (state: IModalState<DealModalParam, DealModalResult>) => {
        this.gameState = state.params.gameState;
        this.gameConfig = Object.assign({}, this.gameState ? this.gameState.currentGameConfig : defaultGames[0]);
        if (this.gameConfig.name) {
          this.selectedPreset = this.gameConfig.name;
          this.currentGameName = this.gameConfig.name;
        }
        this.numberOfCards = DealModalBase.defaultNumberOfCards; // default to last
        const dealSequence = GamePlayFunctions.currentDealStep(this.gameState);
        if (this.numberOfCards < dealSequence.minimumNumberOfCards)
          this.numberOfCards = dealSequence.minimumNumberOfCards;
        if (this.numberOfCards > dealSequence.maximumNumberOfCards)
          this.numberOfCards = dealSequence.maximumNumberOfCards
      }
    );
  }

  isMidSequence(): boolean {
    return GamePlayFunctions.isMidDealSequence(this.gameState);
  }

  nextDealStepDescription(): string {
    return GamePlayFunctions.nextDealStepDescription(this.gameState);
  }

  getSelectedPreset(): string {
    if (this.selectedPreset)
      return this.selectedPreset;
    return "Tap to select"
  }

  dealerCanSelectNumberOfCards(): boolean {
    if (this.selectedPreset===this.currentGameName)
      return GamePlayFunctions.dealerCanSelectNumberOfCards(this.gameState);
    else {
      const gameConfig : GameConfig = defaultGames.find( (gameConfig: GameConfig) => {
        return (gameConfig.name === this.selectedPreset);
      } );
      return GameConfig.dealerCanSelectNumberOfCards(gameConfig.dealSequence[0]);
    }
  }

  getPresets(): GameConfig[] {
    return defaultGames;
  }

  selectPreset(presetIndex: number): void {
    let gameConfig = defaultGames[presetIndex];
    this.selectedPreset = gameConfig.name;
    this.gameConfig = _.extend(this.gameConfig, gameConfig);
  }

  changeNumberOfCards(change: number): void {
    this.numberOfCards = this.numberOfCards + change;
  }

  deal() {
    DealModalBase.defaultNumberOfCards = this.numberOfCards;
    this.close({
      gameConfig: this.gameConfig,
      nextStep: false,
      numberOfCards: this.numberOfCards
    });
  }

  nextStep() {
    if (GamePlayFunctions.areBetsEven(this.gameState))
      this.close({nextStep: true});
    else
      console.error("BETS NOT EVEN")
  }

  cancel() {
    this.close(null);
  }
}
