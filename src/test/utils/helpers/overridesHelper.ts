import { StatusEffect } from "#app/data/status-effect";
import { Variant } from "#app/data/variant";
import { Weather, WeatherType } from "#app/data/weather";
import { Species } from "#app/enums/species";
import * as GameMode from "#app/game-mode";
import { GameModes, getGameMode } from "#app/game-mode";
import { ModifierOverride } from "#app/modifier/modifier-type";
import Overrides from "#app/overrides";
import { Abilities } from "#enums/abilities";
import { Biome } from "#enums/biome";
import { Moves } from "#enums/moves";
import { Unlockables } from "#app/system/unlockables";
import { Variant } from "#app/data/variant";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { PokeballType } from "#enums/pokeball";
import { GameManagerHelper } from "#test/utils/helpers/gameManagerHelper";
import { vi } from "vitest";

/**
 * Helper to handle overrides in tests
 */
export class OverridesHelper extends GameManagerHelper {
  /**
   * Override the starting biome
   * @warning Any event listeners that are attached to [NewArenaEvent](events\battle-scene.ts) may need to be handled down the line
   * @param biome The {@linkcode Biome} to set
   * @returns `this`
   */
  startingBiome(biome: Biome): this {
    this.game.scene.newArena(biome);
    this.log(`Starting biome set to ${Biome[biome]} (=${biome})!`);
    return this;
  }
  /**
   * Override the starting wave (index)
   * @param wave the wave (index) to set. Classic: `1`-`200`
   * @returns `this`
   */
  startingWave(wave: number): this {
    vi.spyOn(Overrides, "STARTING_WAVE_OVERRIDE", "get").mockReturnValue(wave);
    this.log(`Starting wave set to ${wave}!`);
    return this;
  }

  /**
   * Override the player pokemon's starting level
   * @param level the level to set
   * @returns `this`
   */
  startingLevel(level: Species | number): this {
    vi.spyOn(Overrides, "STARTING_LEVEL_OVERRIDE", "get").mockReturnValue(level);
    this.log(`Player Pokemon starting level set to ${level}!`);
    return this;
  }

  /**
   * Override the XP Multiplier
   * @param value the XP multiplier to set
   * @returns `this`
   */
  xpMultiplier(value: number): this {
    vi.spyOn(Overrides, "XP_MULTIPLIER_OVERRIDE", "get").mockReturnValue(value);
    this.log(`XP Multiplier set to ${value}!`);
    return this;
  }

  /**
   * Override the player pokemon's starting held items
   * @param items the {@linkcode ModifierOverride | items} to hold
   * @returns `this`
   */
  startingHeldItems(items: ModifierOverride[]): this {
    vi.spyOn(Overrides, "STARTING_HELD_ITEMS_OVERRIDE", "get").mockReturnValue(items);
    this.log("Player Pokemon starting held items set to:", items);
    return this;
  }

  /**
   * Override the player's pokeball inventory
   * @param pokeballs Array specifying the amount of each pokeball to set, or `null` if disabling the override
   * @param enable Whether to enable or disable the override, default `true`
   * @returns `this`
   */
  pokeballs(pokeballs: [number, number, number, number, number] | null, enable: boolean = true): this {
    if (!pokeballs) {
      pokeballs = [ 5, 0, 0, 0, 0 ];
    }
    pokeballs = pokeballs!;
    const pokeballOverride = {
      active: enable,
      pokeballs: {
        [PokeballType.POKEBALL]: pokeballs[0],
        [PokeballType.GREAT_BALL]: pokeballs[1],
        [PokeballType.ULTRA_BALL]: pokeballs[2],
        [PokeballType.ROGUE_BALL]: pokeballs[3],
        [PokeballType.MASTER_BALL]: pokeballs[4],
      },
    };
    vi.spyOn(Overrides, "POKEBALL_OVERRIDE", "get").mockReturnValue(pokeballOverride);
    this.log(`Pokeball override ${enable ? `set to [${pokeballs}]!` : "disabled!"}`);
    return this;
  }

  /**
   * Override the player pokemon's species.
   * It's preferred to use `startBattle([Species.PKMN1, Species.PKMN2, ...])` if possible.
   * @param species the {@linkcode Species} to set
   * @returns `this`
   */
  starterSpecies(species: Species | number): this {
    vi.spyOn(Overrides, "STARTER_SPECIES_OVERRIDE", "get").mockReturnValue(species);
    this.log(`Player Pokemon species set to ${Species[species]} (=${species})!`);
    return this;
  }

  /**
   * Override the player (pokemon) to be a random fusion
   * @returns this
   */
  enableStarterFusion(): this {
    vi.spyOn(Overrides, "STARTER_FUSION_OVERRIDE", "get").mockReturnValue(true);
    this.log("Player Pokemon is a random fusion!");
    return this;
  }

  /**
   * Override the player (pokemon) fusion species
   * @param species the fusion species to set
   * @returns this
   */
  starterFusionSpecies(species: Species | number): this {
    vi.spyOn(Overrides, "STARTER_FUSION_SPECIES_OVERRIDE", "get").mockReturnValue(species);
    this.log(`Player Pokemon fusion species set to ${Species[species]} (=${species})!`);
    return this;
  }

  /**
   * Override the player pokemons' forms
   * @param forms the forms to set
   * @example
   * ```ts
   * game.override.starterForms({
   *   [Species.KYOGRE]: 1,
   *   [Species.PIKACHU]: 3,
   * });
   * ```
   * @returns `this`
   */
  starterForms(forms: Partial<Record<Species, number>>): this {
    vi.spyOn(Overrides, "STARTER_FORM_OVERRIDES", "get").mockReturnValue(forms);
    const formsStr = Object.entries(forms)
      .map(([ speciesId, formIndex ]) => `${Species[speciesId]}=${formIndex}`)
      .join(", ");
    this.log(`Player Pokemon form set to: ${formsStr}!`);
    return this;
  }

  /**
   * Override the player's starting modifiers
   * @param modifiers the {@linkcode ModifierOverride | modifiers} to set
   * @returns `this`
   */
  startingModifier(modifiers: ModifierOverride[]): this {
    vi.spyOn(Overrides, "STARTING_MODIFIER_OVERRIDE", "get").mockReturnValue(modifiers);
    this.log(`Player starting modifiers set to: ${modifiers}`);
    return this;
  }

  /**
   * Override the player pokemon's ability
   * @param ability the {@linkcode Abilities | ability} to set
   * @returns `this`
   */
  ability(ability: Abilities): this {
    vi.spyOn(Overrides, "ABILITY_OVERRIDE", "get").mockReturnValue(ability);
    this.log(`Player Pokemon ability set to ${Abilities[ability]} (=${ability})!`);
    return this;
  }

  /**
   * Override the player pokemon's **passive** ability
   * @param passiveAbility the **passive** {@linkcode Abilities | ability} to set
   * @returns this
   */
  passiveAbility(passiveAbility: Abilities): this {
    vi.spyOn(Overrides, "PASSIVE_ABILITY_OVERRIDE", "get").mockReturnValue(passiveAbility);
    this.log(`Player Pokemon PASSIVE ability set to ${Abilities[passiveAbility]} (=${passiveAbility})!`);
    return this;
  }

  /**
   * Override the player pokemon's moveset
   * @param moveset the {@linkcode Moves | moveset} to set
   * @returns `this`
   */
  moveset(moveset: Moves | Moves[]): this {
    vi.spyOn(Overrides, "MOVESET_OVERRIDE", "get").mockReturnValue(moveset);
    if (!Array.isArray(moveset)) {
      moveset = [ moveset ];
    }
    const movesetStr = moveset.map((moveId) => Moves[moveId]).join(", ");
    this.log(`Player Pokemon moveset set to ${movesetStr} (=[${moveset.join(", ")}])!`);
    return this;
  }

  /**
   * Override the player pokemon's status effect
   * @param statusEffect the {@linkcode StatusEffect | status effect} to set
   * @returns `this`
   */
  statusEffect(statusEffect: StatusEffect): this {
    vi.spyOn(Overrides, "STATUS_OVERRIDE", "get").mockReturnValue(statusEffect);
    this.log(`Player Pokemon status-effect set to ${StatusEffect[statusEffect]} (=${statusEffect})!`);
    return this;
  }

  /**
   * Override each wave to not have standard trainer battles
   * @returns `this`
   */
  disableTrainerWaves(): this {
    const realFn = getGameMode;
    vi.spyOn(GameMode, "getGameMode").mockImplementation((gameMode: GameModes) => {
      const mode = realFn(gameMode);
      mode.hasTrainers = false;
      return mode;
    });
    this.log("Standard trainer waves are disabled!");
    return this;
  }

  /**
   * Override each wave to not have critical hits
   * @returns `this`
   */
  disableCrits(): this {
    vi.spyOn(Overrides, "NEVER_CRIT_OVERRIDE", "get").mockReturnValue(true);
    this.log("Critical hits are disabled!");
    return this;
  }

  /**
   * Override the weather
   * @param type The {@linkcode WeatherType} to set
   * @returns `this`
   */
  weather(type: WeatherType): this {
    vi.spyOn(Overrides, "WEATHER_OVERRIDE", "get").mockReturnValue(type);
    this.log(`Weather set to ${Weather[type]} (=${type})!`);
    return this;
  }

  /**
   * Override the seed
   * @param seed the seed to set
   * @returns `this`
   */
  seed(seed: string): this {
    vi.spyOn(this.game.scene, "resetSeed").mockImplementation(() => {
      this.game.scene.waveSeed = seed;
      Phaser.Math.RND.sow([ seed ]);
      this.game.scene.rngCounter = 0;
    });
    this.game.scene.resetSeed();
    this.log(`Seed set to "${seed}"!`);
    return this;
  }

  /**
   * Override the battle type
   * @param battleType battle type to set ("single" or "double"), `null` to disable
   * @returns `this`
   */
  battleType(battleType: "single" | "double" | null): this {
    vi.spyOn(Overrides, "BATTLE_TYPE_OVERRIDE", "get").mockReturnValue(battleType);
    this.log(`Battle type set to ${battleType} only!`);
    return this;
  }

  /**
   * Override the enemy pokemon's species
   * @param species the {@linkcode Species | species} to set
   * @returns `this`
   */
  enemySpecies(species: Species | number): this {
    vi.spyOn(Overrides, "OPP_SPECIES_OVERRIDE", "get").mockReturnValue(species);
    this.log(`Enemy Pokemon species set to ${Species[species]} (=${species})!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) to be a random fusion
   * @returns this
   */
  enableEnemyFusion(): this {
    vi.spyOn(Overrides, "OPP_FUSION_OVERRIDE", "get").mockReturnValue(true);
    this.log("Enemy Pokemon is a random fusion!");
    return this;
  }

  /**
   * Override the enemy (pokemon) fusion species
   * @param species the fusion species to set
   * @returns this
   */
  enemyFusionSpecies(species: Species | number): this {
    vi.spyOn(Overrides, "OPP_FUSION_SPECIES_OVERRIDE", "get").mockReturnValue(species);
    this.log(`Enemy Pokemon fusion species set to ${Species[species]} (=${species})!`);
    return this;
  }

  /**
   * Override the enemy pokemon's ability
   * @param ability the (pokemon) {@linkcode Abilities | ability} to set
   * @returns `this`
   */
  enemyAbility(ability: Abilities): this {
    vi.spyOn(Overrides, "OPP_ABILITY_OVERRIDE", "get").mockReturnValue(ability);
    this.log(`Enemy Pokemon ability set to ${Abilities[ability]} (=${ability})!`);
    return this;
  }

  /**
   * Override the enemy pokemon's **passive** ability
   * @param passiveAbility the **passive** {@linkcode Abilities | ability} to set
   * @returns `this`
   */
  enemyPassiveAbility(passiveAbility: Abilities): this {
    vi.spyOn(Overrides, "OPP_PASSIVE_ABILITY_OVERRIDE", "get").mockReturnValue(passiveAbility);
    this.log(`Enemy Pokemon PASSIVE ability set to ${Abilities[passiveAbility]} (=${passiveAbility})!`);
    return this;
  }

  /**
   * Override the enemy pokemon's moveset
   * @param moveset the {@linkcode Moves | moveset} to set
   * @returns `this`
   */
  enemyMoveset(moveset: Moves | Moves[]): this {
    vi.spyOn(Overrides, "OPP_MOVESET_OVERRIDE", "get").mockReturnValue(moveset);
    if (!Array.isArray(moveset)) {
      moveset = [ moveset ];
    }
    const movesetStr = moveset.map((moveId) => Moves[moveId]).join(", ");
    this.log(`Enemy Pokemon moveset set to ${movesetStr} (=[${moveset.join(", ")}])!`);
    return this;
  }

  /**
   * Override the enemy pokemon's level
   * @param level the level to set
   * @returns `this`
   */
  enemyLevel(level: number): this {
    vi.spyOn(Overrides, "OPP_LEVEL_OVERRIDE", "get").mockReturnValue(level);
    this.log(`Enemy Pokemon level set to ${level}!`);
    return this;
  }

  /**
   * Override the enemy pokemon's status effect
   * @param statusEffect the {@linkcode StatusEffect} to set
   * @returns
   */
  enemyStatusEffect(statusEffect: StatusEffect): this {
    vi.spyOn(Overrides, "OPP_STATUS_OVERRIDE", "get").mockReturnValue(statusEffect);
    this.log(`Enemy Pokemon status-effect set to ${StatusEffect[statusEffect]} (=${statusEffect})!`);
    return this;
  }

  /**
   * Override the enemy pokemon's held items
   * @param items the {@linkcode ModifierOverride items} to hold
   * @returns `this`
   */
  enemyHeldItems(items: ModifierOverride[]): this {
    vi.spyOn(Overrides, "OPP_HELD_ITEMS_OVERRIDE", "get").mockReturnValue(items);
    this.log("Enemy Pokemon held items set to:", items);
    return this;
  }

  /**
   * Gives the player access to an Unlockable.
   * @param unlockable The Unlockable(s) to enable.
   * @returns `this`
   */
  enableUnlockable(unlockable: Unlockables[]) {
    vi.spyOn(Overrides, "ITEM_UNLOCK_OVERRIDE", "get").mockReturnValue(unlockable);
    this.log("Temporarily unlocked the following content: ", unlockable);
    return this;
  }

  /**
   * Override the items rolled at the end of a battle
   * @param items the {@linkcode ModifierOverride items} to be rolled
   * @returns `this`
   */
  itemRewards(items: ModifierOverride[]): this {
    vi.spyOn(Overrides, "ITEM_REWARD_OVERRIDE", "get").mockReturnValue(items);
    this.log("Item rewards set to:", items);
    return this;
  }

  /**
   * Override player shininess
   * @param shininess Whether the player's Pokemon should be shiny.
   */
  shinyLevel(shininess: boolean): this {
    vi.spyOn(Overrides, "SHINY_OVERRIDE", "get").mockReturnValue(shininess);
    this.log(`Set player Pokemon as ${shininess ? "" : "not "}shiny!`);
    return this;
  }
  /**
   * Override player shiny variant
   * @param variant The player's shiny variant.
   */
  variantLevel(variant: Variant): this {
    vi.spyOn(Overrides, "VARIANT_OVERRIDE", "get").mockReturnValue(variant);
    this.log(`Set player Pokemon's shiny variant to ${variant}!`);
    return this;
  }

  /**
   * Override the enemy Pokemon to have the given amount of health segments
   * @param healthSegments the number of segments to give
   *  - default: `0`, the health segments will be handled like in the game based on wave, level and species
   *  - `1`: the Pokemon will not be a boss
   *  - `2`+: the Pokemon will be a boss with the given number of health segments
   * @returns `this`
   */
  enemyHealthSegments(healthSegments: number): this {
    vi.spyOn(Overrides, "OPP_HEALTH_SEGMENTS_OVERRIDE", "get").mockReturnValue(healthSegments);
    this.log("Enemy Pokemon health segments set to:", healthSegments);
    return this;
  }

  /**
   * Override the encounter chance for a mystery encounter.
   * @param percentage the encounter chance in %
   * @returns `this`
   */
  mysteryEncounterChance(percentage: number): this {
    const maxRate: number = 256; // 100%
    const rate = maxRate * (percentage / 100);
    vi.spyOn(Overrides, "MYSTERY_ENCOUNTER_RATE_OVERRIDE", "get").mockReturnValue(rate);
    this.log(`Mystery encounter chance set to ${percentage}% (=${rate})!`);
    return this;
  }

  /**
   * Override the encounter tier for a mystery encounter.
   * @param tier What {@linkcode MysteryEncounterTier | tier} of encounter to set
   * @returns `this`
   */
  mysteryEncounterTier(tier: MysteryEncounterTier): this {
    vi.spyOn(Overrides, "MYSTERY_ENCOUNTER_TIER_OVERRIDE", "get").mockReturnValue(tier);
    this.log(`Mystery encounter tier set to ${tier}!`);
    return this;
  }

  /**
   * Override the encounter that spawns for the scene
   * @param encounterType What {@linkcode MysteryEncounterType | type} of encounter to set
   * @returns `this`
   */
  mysteryEncounter(encounterType: MysteryEncounterType): this {
    vi.spyOn(Overrides, "MYSTERY_ENCOUNTER_OVERRIDE", "get").mockReturnValue(encounterType);
    this.log(`Mystery encounter override set to ${encounterType}!`);
    return this;
  }

  private log(...params: any[]) {
    console.log("Overrides:", ...params);
  }
}
