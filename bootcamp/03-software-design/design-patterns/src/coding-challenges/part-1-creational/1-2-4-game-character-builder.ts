/**
 * Challenge 1.2.4 — Game Character Creator
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 1, Challenge 1.2.4)
 *
 * TODO:
 * - `CharacterBuilder` with fluent setters:
 *   - `setName(name: string)`
 *   - `setClass(role: 'Warrior' | 'Mage' | 'Rogue')`
 *   - `setStats(strength: number, agility: number, intelligence: number)`
 *   - `addAbility(ability: string)` (array, additive, max 4 total)
 *   - `equipItem(item: string)` (array, additive)
 * - `build()` validates:
 *   - `name` and `class` are both set
 *   - stat allocation points (`strength + agility + intelligence`) must equal exactly 30
 *   - class stat constraints: 'Mage' must have `intelligence >= 15`, 'Warrior' must have `strength >= 15`, 'Rogue' must have `agility >= 15`
 *   - ability count cannot exceed 4
 * - returns an immutable `Character` object
 *
 * Focus: Constrained point budgets, array caps, and class-dependent validation rules.
 */
type CharacterRole = 'Warrior' | 'Mage' | 'Rogue';

interface Character {
  name: string;
  role: CharacterRole;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
  };
  abilities: string[];
  items: string[];
}

class CharacterBuilder {
  private readonly properties: Partial<Character> = {
    abilities: [],
    items: [],
  };

  setName(name: string): this {
    this.properties.name = name;
    return this;
  }

  setClass(role: CharacterRole): this {
    this.properties.role = role;
    return this;
  }

  setStats(strength: number, agility: number, intelligence: number): this {
    this.properties.stats = { strength, agility, intelligence };
    return this;
  }

  addAbility(ability: string): this {
    if (!this.properties.abilities) {
      this.properties.abilities = [];
    }
    this.properties.abilities.push(ability);
    return this;
  }

  equipItem(item: string): this {
    if (!this.properties.items) {
      this.properties.items = [];
    }
    this.properties.items.push(item);
    return this;
  }

  build(): Character {
    const { name, role, stats, abilities = [], items = [] } = this.properties;

    if (!name) {
      throw new Error('Name is required.');
    }

    if (!role) {
      throw new Error('Class is required.');
    }

    if (!stats) {
      throw new Error('Stats must be set.');
    }

    const { strength, agility, intelligence } = stats;
    const totalStats = strength + agility + intelligence;

    if (totalStats !== 30) {
      throw new Error(
        `Total stat points must equal 30. Current total: ${totalStats}`,
      );
    }

    if (role === 'Warrior' && strength < 15) {
      throw new Error('Warrior requires at least 15 Strength.');
    }

    if (role === 'Mage' && intelligence < 15) {
      throw new Error('Mage requires at least 15 Intelligence.');
    }

    if (role === 'Rogue' && agility < 15) {
      throw new Error('Rogue requires at least 15 Agility.');
    }

    if (abilities.length > 4) {
      throw new Error('Abilities cannot exceed 4.');
    }

    return Object.freeze({
      name,
      role,
      stats: Object.freeze({ ...stats }),
      abilities: Object.freeze([...abilities]),
      items: Object.freeze([...items]),
    }) as Character;
  }
}

const character = new CharacterBuilder()
  .setName('Conan')
  .setClass('Warrior')
  .setStats(15, 10, 5) // Total: 30, Strength >= 15
  .addAbility('Slash')
  .equipItem('Iron Sword')
  .build();

console.log(character);

const mage = new CharacterBuilder()
  .setName('Gandalf')
  .setClass('Mage')
  .setStats(5, 10, 15) // Total: 30, Intelligence >= 15
  .addAbility('Fireball')
  .addAbility('Ice Bolt')
  .addAbility('Teleport')
  .addAbility('Shield')
  .build();

console.log(mage);
