import type { BattleScene } from "#app/battle-scene";
import { UiMode } from "#enums/ui-mode";
import { GameManager } from "#test/framework/game-manager";
import Phaser from "phaser";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

// TODO: these tests seems silly
describe("Phases", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  let scene: BattleScene;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    scene = game.scene;
  });

  describe("LoginPhase", () => {
    it("should start the login phase", async () => {
      scene.phaseManager.unshiftNew("LoginPhase");
      await game.phaseInterceptor.to("LoginPhase");
      expect(scene.ui.mode).toBe(UiMode.MESSAGE);
    });
  });

  describe("TitlePhase", () => {
    it("should start the title phase", async () => {
      scene.phaseManager["_unshiftNew"]("TitlePhase");
      await game.phaseInterceptor.to("TitlePhase");
      expect(scene.ui.mode).toBe(UiMode.TITLE);
    });
  });

  describe("UnavailablePhase", () => {
    it("should start the unavailable phase", async () => {
      scene.phaseManager.unshiftNew("UnavailablePhase");
      await game.phaseInterceptor.to("UnavailablePhase");
      expect(scene.ui.mode).toBe(UiMode.UNAVAILABLE);
    });
  });
});
