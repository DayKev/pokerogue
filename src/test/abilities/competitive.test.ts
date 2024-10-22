import { Stat } from "#enums/stat";
import { TurnInitPhase } from "#phases/turn-init-phase";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import GameManager from "#test/utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Competitive", () => {
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

    game.override.battleType("single")
      .enemySpecies(Species.BEEDRILL)
      .enemyMoveset(Moves.TICKLE)
      .startingLevel(1)
      .moveset([ Moves.SPLASH, Moves.CLOSE_COMBAT ])
      .ability(Abilities.COMPETITIVE);
  });

  it("lower atk and def by 1 via tickle, then increase spatk by 4 via competitive", async () => {
    await game.classicMode.startBattle([ Species.FLYGON ]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    game.move.select(Moves.SPLASH);
    await game.phaseInterceptor.to(TurnInitPhase);

    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(-1);
    expect(playerPokemon.getStatStage(Stat.DEF)).toBe(-1);
    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(4);
  });

  it("lowering your own stats should not trigger competitive", async () => {
    game.override.enemyMoveset(Moves.SPLASH);
    await game.classicMode.startBattle([ Species.FLYGON ]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    game.move.select(Moves.CLOSE_COMBAT);
    await game.phaseInterceptor.to(TurnInitPhase);

    expect(playerPokemon.getStatStage(Stat.SPDEF)).toBe(-1);
    expect(playerPokemon.getStatStage(Stat.DEF)).toBe(-1);
    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(0);
  });

  it("white herb should remove only the negative effects", async () => {
    game.override.startingHeldItems([{ name: "WHITE_HERB" }]);
    await game.classicMode.startBattle([ Species.FLYGON ]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    game.move.select(Moves.SPLASH);
    await game.phaseInterceptor.to(TurnInitPhase);

    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(0);
    expect(playerPokemon.getStatStage(Stat.DEF)).toBe(0);
    expect(playerPokemon.getStatStage(Stat.SPATK)).toBe(4);
  });
});
