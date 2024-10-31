import { PokemonFormChangeItemModifier, TerastallizeModifier } from "#app/modifier/modifier";
import Pokemon from "#app/field/pokemon";
import { StatusEffect } from "#app/data/status-effect";
import { Type } from "#app/data/type";
import { Constructor, nil } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { WeatherType } from "#app/data/weather";
import { Challenges } from "#enums/challenges";
import { SpeciesFormKey } from "#enums/species-form-key";
import { FormChangeItem } from "#app/data/balance/form-change-items";
import { pokemonFormChanges } from "#app/data/balance/pokemon-forms";

export type SpeciesFormChangeConditionPredicate = (p: Pokemon) => boolean;
export type SpeciesFormChangeConditionEnforceFunc = (p: Pokemon) => void;

export class SpeciesFormChange {
  public speciesId: Species;
  public preFormKey: string;
  public formKey: string;
  public trigger: SpeciesFormChangeTrigger;
  public quiet: boolean;
  public readonly conditions: SpeciesFormChangeCondition[];

  constructor(speciesId: Species, preFormKey: string, evoFormKey: string, trigger: SpeciesFormChangeTrigger, quiet: boolean = false, ...conditions: SpeciesFormChangeCondition[]) {
    this.speciesId = speciesId;
    this.preFormKey = preFormKey;
    this.formKey = evoFormKey;
    this.trigger = trigger;
    this.quiet = quiet;
    this.conditions = conditions;
  }

  canChange(pokemon: Pokemon): boolean {
    if (pokemon.species.speciesId !== this.speciesId) {
      return false;
    }

    if (!pokemon.species.forms.length) {
      return false;
    }

    const formKeys = pokemon.species.forms.map(f => f.formKey);
    if (formKeys[pokemon.formIndex] !== this.preFormKey) {
      return false;
    }

    if (formKeys[pokemon.formIndex] === this.formKey) {
      return false;
    }

    for (const condition of this.conditions) {
      if (!condition.predicate(pokemon)) {
        return false;
      }
    }

    if (!this.trigger.canChange(pokemon)) {
      return false;
    }

    return true;
  }

  findTrigger(triggerType: Constructor<SpeciesFormChangeTrigger>): SpeciesFormChangeTrigger | nil {
    if (!this.trigger.hasTriggerType(triggerType)) {
      return null;
    }

    const trigger = this.trigger;

    if (trigger instanceof SpeciesFormChangeCompoundTrigger) {
      return trigger.triggers.find(t => t.hasTriggerType(triggerType));
    }

    return trigger;
  }
}

export class SpeciesFormChangeCondition {
  public predicate: SpeciesFormChangeConditionPredicate;
  public enforceFunc: SpeciesFormChangeConditionEnforceFunc | nil;

  constructor(predicate: SpeciesFormChangeConditionPredicate, enforceFunc?: SpeciesFormChangeConditionEnforceFunc) {
    this.predicate = predicate;
    this.enforceFunc = enforceFunc;
  }
}

export abstract class SpeciesFormChangeTrigger {
  canChange(pokemon: Pokemon): boolean {
    return true;
  }

  hasTriggerType(triggerType: Constructor<SpeciesFormChangeTrigger>): boolean {
    return this instanceof triggerType;
  }
}

export class SpeciesFormChangeManualTrigger extends SpeciesFormChangeTrigger {
  canChange(pokemon: Pokemon): boolean {
    return true;
  }
}

export class SpeciesFormChangeCompoundTrigger {
  public triggers: SpeciesFormChangeTrigger[];

  constructor(...triggers: SpeciesFormChangeTrigger[]) {
    this.triggers = triggers;
  }

  canChange(pokemon: Pokemon): boolean {
    for (const trigger of this.triggers) {
      if (!trigger.canChange(pokemon)) {
        return false;
      }
    }

    return true;
  }

  hasTriggerType(triggerType: Constructor<SpeciesFormChangeTrigger>): boolean {
    return !!this.triggers.find(t => t.hasTriggerType(triggerType));
  }
}

export class SpeciesFormChangeItemTrigger extends SpeciesFormChangeTrigger {
  public item: FormChangeItem;
  public active: boolean;

  constructor(item: FormChangeItem, active: boolean = true) {
    super();
    this.item = item;
    this.active = active;
  }

  canChange(pokemon: Pokemon): boolean {
    return !!pokemon.scene.findModifier(m => m instanceof PokemonFormChangeItemModifier && m.pokemonId === pokemon.id && m.formChangeItem === this.item && m.active === this.active);
  }
}

export class SpeciesFormChangeTimeOfDayTrigger extends SpeciesFormChangeTrigger {
  public timesOfDay: TimeOfDay[];

  constructor(...timesOfDay: TimeOfDay[]) {
    super();
    this.timesOfDay = timesOfDay;
  }

  canChange(pokemon: Pokemon): boolean {
    return this.timesOfDay.indexOf(pokemon.scene.arena.getTimeOfDay()) > -1;
  }
}

export class SpeciesFormChangeActiveTrigger extends SpeciesFormChangeTrigger {
  public active: boolean;

  constructor(active: boolean = false) {
    super();
    this.active = active;
  }

  canChange(pokemon: Pokemon): boolean {
    return pokemon.isActive(true) === this.active;
  }
}

export class SpeciesFormChangeStatusEffectTrigger extends SpeciesFormChangeTrigger {
  public statusEffects: StatusEffect[];
  public invert: boolean;

  constructor(statusEffects: StatusEffect | StatusEffect[], invert: boolean = false) {
    super();
    if (!Array.isArray(statusEffects)) {
      statusEffects = [ statusEffects ];
    }
    this.statusEffects = statusEffects;
    this.invert = invert;
  }

  canChange(pokemon: Pokemon): boolean {
    return (this.statusEffects.indexOf(pokemon.status?.effect || StatusEffect.NONE) > -1) !== this.invert;
  }
}

export class SpeciesFormChangeMoveLearnedTrigger extends SpeciesFormChangeTrigger {
  public move: Moves;
  public known: boolean;

  constructor(move: Moves, known: boolean = true) {
    super();
    this.move = move;
    this.known = known;
  }

  canChange(pokemon: Pokemon): boolean {
    return (!!pokemon.moveset.filter(m => m?.moveId === this.move).length) === this.known;
  }
}

export abstract class SpeciesFormChangeMoveTrigger extends SpeciesFormChangeTrigger {
  public movePredicate: (m: Moves) => boolean;
  public used: boolean;

  constructor(move: Moves | ((m: Moves) => boolean), used: boolean = true) {
    super();
    this.movePredicate = typeof move === "function" ? move : (m: Moves) => m === move;
    this.used = used;
  }
}

export class SpeciesFormChangePreMoveTrigger extends SpeciesFormChangeMoveTrigger {
  canChange(pokemon: Pokemon): boolean {
    const command = pokemon.scene.currentBattle.turnCommands[pokemon.getBattlerIndex()];
    return !!command?.move && this.movePredicate(command.move.move) === this.used;
  }
}

export class SpeciesFormChangePostMoveTrigger extends SpeciesFormChangeMoveTrigger {
  canChange(pokemon: Pokemon): boolean {
    return pokemon.summonData && !!pokemon.getLastXMoves(1).filter(m => this.movePredicate(m.move)).length === this.used;
  }
}

export class MeloettaFormChangePostMoveTrigger extends SpeciesFormChangePostMoveTrigger {
  override canChange(pokemon: Pokemon): boolean {
    // TODO: Use `applyChallenges()` instead of hardcoding this
    if (pokemon.scene.gameMode.hasChallenge(Challenges.SINGLE_TYPE)) {
      return false;
    } else {
      return super.canChange(pokemon);
    }
  }
}

export class SpeciesDefaultFormMatchTrigger extends SpeciesFormChangeTrigger {
  private formKey: string;

  constructor(formKey: string) {
    super();
    this.formKey = formKey;
  }

  canChange(pokemon: Pokemon): boolean {
    return this.formKey === pokemon.species.forms[pokemon.scene.getSpeciesFormIndex(pokemon.species, pokemon.gender, pokemon.getNature(), true)].formKey;
  }
}

/**
 * Class used for triggering form changes based on the user's Tera type.
 * Used by Ogerpon and Terapagos.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeTeraTrigger extends SpeciesFormChangeTrigger {
  /** The Tera type that triggers the form change */
  private teraType: Type;

  constructor(teraType: Type) {
    super();
    this.teraType = teraType;
  }

  /**
   * Checks if the associated Pokémon has the required Tera Shard that matches with the associated Tera type.
   * @param {Pokemon} pokemon the Pokémon that is trying to do the form change
   * @returns `true` if the Pokémon can change forms, `false` otherwise
   */
  canChange(pokemon: Pokemon): boolean {
    return !!pokemon.scene.findModifier(m => m instanceof TerastallizeModifier && m.pokemonId === pokemon.id && m.teraType === this.teraType);
  }
}

/**
 * Class used for triggering form changes based on the user's lapsed Tera type.
 * Used by Ogerpon and Terapagos.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeLapseTeraTrigger extends SpeciesFormChangeTrigger {
  canChange(pokemon: Pokemon): boolean {
    return !!pokemon.scene.findModifier(m => m instanceof TerastallizeModifier && m.pokemonId === pokemon.id);
  }
}

/**
 * Class used for triggering form changes based on weather.
 * Used by Castform and Cherrim.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeWeatherTrigger extends SpeciesFormChangeTrigger {
  /** The ability that  triggers the form change */
  public ability: Abilities;
  /** The list of weathers that trigger the form change */
  public weathers: WeatherType[];

  constructor(ability: Abilities, weathers: WeatherType[]) {
    super();
    this.ability = ability;
    this.weathers = weathers;
  }

  /**
   * Checks if the Pokemon has the required ability and is in the correct weather while
   * the weather or ability is also not suppressed.
   * @param {Pokemon} pokemon the pokemon that is trying to do the form change
   * @returns `true` if the Pokemon can change forms, `false` otherwise
   */
  canChange(pokemon: Pokemon): boolean {
    const currentWeather = pokemon.scene.arena.weather?.weatherType ?? WeatherType.NONE;
    const isWeatherSuppressed = pokemon.scene.arena.weather?.isEffectSuppressed(pokemon.scene);
    const isAbilitySuppressed = pokemon.summonData.abilitySuppressed;

    return !isAbilitySuppressed && !isWeatherSuppressed && (pokemon.hasAbility(this.ability) && this.weathers.includes(currentWeather));
  }
}

/**
 * Class used for reverting to the original form when the weather runs out
 * or when the user loses the ability/is suppressed.
 * Used by Castform and Cherrim.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeRevertWeatherFormTrigger extends SpeciesFormChangeTrigger {
  /** The ability that triggers the form change*/
  public ability: Abilities;
  /** The list of weathers that will also trigger a form change to original form */
  public weathers: WeatherType[];

  constructor(ability: Abilities, weathers: WeatherType[]) {
    super();
    this.ability = ability;
    this.weathers = weathers;
  }

  /**
   * Checks if the Pokemon has the required ability and the weather is one that will revert
   * the Pokemon to its original form or the weather or ability is suppressed
   * @param {Pokemon} pokemon the pokemon that is trying to do the form change
   * @returns `true` if the Pokemon will revert to its original form, `false` otherwise
   */
  canChange(pokemon: Pokemon): boolean {
    if (pokemon.hasAbility(this.ability, false, true)) {
      const currentWeather = pokemon.scene.arena.weather?.weatherType ?? WeatherType.NONE;
      const isWeatherSuppressed = pokemon.scene.arena.weather?.isEffectSuppressed(pokemon.scene);
      const isAbilitySuppressed = pokemon.summonData.abilitySuppressed;
      const summonDataAbility = pokemon.summonData.ability;
      const isAbilityChanged = summonDataAbility !== this.ability && summonDataAbility !== Abilities.NONE;

      if (this.weathers.includes(currentWeather) || isWeatherSuppressed || isAbilitySuppressed || isAbilityChanged) {
        return true;
      }
    }
    return false;
  }
}

export function getSpeciesFormChangeMessage(pokemon: Pokemon, formChange: SpeciesFormChange, preName: string): string {
  const isMega = formChange.formKey.indexOf(SpeciesFormKey.MEGA) > -1;
  const isGmax = formChange.formKey.indexOf(SpeciesFormKey.GIGANTAMAX) > -1;
  const isEmax = formChange.formKey.indexOf(SpeciesFormKey.ETERNAMAX) > -1;
  const isRevert = !isMega && formChange.formKey === pokemon.species.forms[0].formKey;
  if (isMega) {
    return i18next.t("battlePokemonForm:megaChange", { preName, pokemonName: pokemon.name });
  }
  if (isGmax) {
    return i18next.t("battlePokemonForm:gigantamaxChange", { preName, pokemonName: pokemon.name });
  }
  if (isEmax) {
    return i18next.t("battlePokemonForm:eternamaxChange", { preName, pokemonName: pokemon.name });
  }
  if (isRevert) {
    return i18next.t("battlePokemonForm:revertChange", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
  if (pokemon.getAbility().id === Abilities.DISGUISE) {
    return i18next.t("battlePokemonForm:disguiseChange");
  }
  return i18next.t("battlePokemonForm:formChange", { preName });
}

/**
 * Gives a condition for form changing checking if a species is registered as caught in the player's dex data.
 * Used for fusion forms such as Kyurem and Necrozma.
 * @param species {@linkcode Species}
 * @returns A {@linkcode SpeciesFormChangeCondition} checking if that species is registered as caught
 */
export function getSpeciesDependentFormChangeCondition(species: Species): SpeciesFormChangeCondition {
  return new SpeciesFormChangeCondition(p => !!p.scene.gameData.dexData[species].caughtAttr);
}

export function initPokemonForms() {
  const formChangeKeys = Object.keys(pokemonFormChanges);
  formChangeKeys.forEach(pk => {
    const formChanges = pokemonFormChanges[pk];
    const newFormChanges: SpeciesFormChange[] = [];
    for (const fc of formChanges) {
      const itemTrigger = fc.findTrigger(SpeciesFormChangeItemTrigger) as SpeciesFormChangeItemTrigger;
      if (itemTrigger && !formChanges.find(c => fc.formKey === c.preFormKey && fc.preFormKey === c.formKey)) {
        newFormChanges.push(new SpeciesFormChange(fc.speciesId, fc.formKey, fc.preFormKey, new SpeciesFormChangeItemTrigger(itemTrigger.item, false)));
      }
    }
    formChanges.push(...newFormChanges);
  });
}
