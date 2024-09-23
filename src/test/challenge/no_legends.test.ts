import { Challenges } from "#enums/challenges";
import GameManager from "#test/utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

const TIMEOUT = 20 * 1000;

describe("No Legends", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);

    game.challengeMode.addChallenge(Challenges.NO_LEGENDS);
  });

  // TODO: Figure out how to check this.
  it.todo("removes legends/sub-legends/mythicals from the starter select screen", async () => {
    await game.runToTitle();
    expect(1);
  }, TIMEOUT);
});
