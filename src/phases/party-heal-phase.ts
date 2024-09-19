import BattleScene from "#app/battle-scene";
import { applyChallenges, ChallengeType } from "#app/data/challenge";
import { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import { BooleanHolder, fixedInt } from "#app/utils";
import { BattlePhase } from "./battle-phase";

export class PartyHealPhase extends BattlePhase {
  private resumeBgm: boolean;

  constructor(scene: BattleScene, resumeBgm: boolean) {
    super(scene);

    this.resumeBgm = resumeBgm;
  }

  start() {
    super.start();

    const isHealPhaseActive = new BooleanHolder(true);
    applyChallenges(this.scene.gameMode, ChallengeType.NO_HEAL_PHASE, isHealPhaseActive);
    if (!isHealPhaseActive.value) {
      this.scene.unshiftPhase(new SelectModifierPhase(this.scene));
      this.end();
      return;
    }

    const bgmPlaying = this.scene.isBgmPlaying();
    if (bgmPlaying) {
      this.scene.fadeOutBgm(1000, false);
    }

    const canBeRevived = new BooleanHolder(true);
    this.scene.ui.fadeOut(1000).then(() => {
      for (const pokemon of this.scene.getParty()) {
        applyChallenges(this.scene.gameMode, ChallengeType.PREVENT_REVIVE, pokemon, canBeRevived);
        if (canBeRevived.value || !pokemon.isFainted()) {
          pokemon.hp = pokemon.getMaxHp();
          pokemon.resetStatus();
          for (const move of pokemon.moveset) {
            if (move) {
              move.ppUsed = 0;
            }
          }
          pokemon.updateInfo(true);
        }
      }
      const healSong = this.scene.playSoundWithoutBgm("heal");
      this.scene.time.delayedCall(fixedInt(healSong.totalDuration * 1000), () => {
        healSong.destroy();
        if (this.resumeBgm && bgmPlaying) {
          this.scene.playBgm();
        }
        this.scene.ui.fadeIn(500).then(() => this.end());
      });
    });
  }
}
