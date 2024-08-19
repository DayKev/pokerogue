import { BattlerIndex } from "#app/battle.js";
import { Abilities } from "#app/enums/abilities.js";
import { Moves } from "#app/enums/moves.js";
import { Species } from "#app/enums/species.js";
import GameManager from "#test/utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { getMovePosition } from "../utils/gameManagerUtils";

const TIMEOUT = 20 * 1000;

describe("Moves - Revival Blessing", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);

    game.override
      .battleType("double")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Array(4).fill(Moves.REVIVAL_BLESSING))
      .starterSpecies(Species.FEEBAS)
      .ability(Abilities.BALL_FETCH)
      .moveset([Moves.SPLASH, Moves.REVIVAL_BLESSING, Moves.MEMENTO, Moves.THUNDERBOLT])
      .startingLevel(200);
  });

  it("shouldn't cause multiple pokemon to be sent out into the same field slot",async () => {
    game.override.startingWave(95);
    await game.startBattle();

    let field1 = 0;
    let field2 = 0;
    game.scene.getEnemyParty().forEach((p) => {
      if (p.fieldPosition === 0) {
        return;
      } else if (p.fieldPosition === 1) {
        field1 += 1;
      } else if (p.fieldPosition === 2) {
        field2 += 1;
      }
    });

    expect(field1).toBe(1);
    expect(field2).toBe(1);

    game.doAttack(getMovePosition(game.scene, 0, Moves.THUNDERBOLT));
    game.doSelectTarget(BattlerIndex.ENEMY);
    game.doAttack(getMovePosition(game.scene, 1, Moves.SPLASH));
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toNextTurn();

    field1 = 0;
    field2 = 0;
    game.scene.getEnemyParty().forEach((p) => {
      if (p.fieldPosition === 0) {
        return;
      } else if (p.fieldPosition === 1) {
        field1 += 1;
      } else if (p.fieldPosition === 2) {
        field2 += 1;
      }
    });

    expect(field1).toBe(1);
    expect(field2).toBe(1);
  }, TIMEOUT);
});
