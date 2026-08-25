/**
 * Summoning Circle — Factory pattern
 *
 * Source: docs/learning/03-software-design/software-design-patterns/challenges.md
 *         ("Summoning Circle")
 *
 * A summoning feature for a fantasy game: the player feeds an ingredient
 * type into a summoning circle, which creates a matching creature.
 *
 * TODO:
 * - `Creature` interface — `name: string`, `useAbility(): void` (prints
 *   what the creature does)
 * - a few classes implementing it, e.g. `Dragon` (breathes fire),
 *   `Phoenix` (Reborn), `Unicorn` (Dancing on rainbow)
 * - `SummoningCircle` factory class with `summon(ingredientType: string): Creature`
 *   — different ingredient types (`fire`, `air`, `sparkles`, ...) return
 *   different creature classes
 * - summon a few creatures with different ingredients and call
 *   `useAbility()` on each
 */
import assert from 'node:assert';

interface Creature {
  name: string;
  useAbility(): void;
}

class Dragon implements Creature {
  name = 'Dragon';

  useAbility(): void {
    console.log(`${this.name} breathes fire!`);
  }
}

class Phoenix implements Creature {
  name = 'Phoenix';

  useAbility(): void {
    console.log(`${this.name} is Reborn!`);
  }
}

class Unicorn implements Creature {
  name = 'Unicorn';

  useAbility(): void {
    console.log(`${this.name} is Dancing on rainbow!`);
  }
}

class SummoningCircle {
  summon(ingredientType: string): Creature {
    switch (ingredientType) {
      case 'fire':
        return new Dragon();
      case 'air':
        return new Phoenix();
      case 'sparkles':
        return new Unicorn();
      default:
        throw new Error(`Unknown ingredient type: ${ingredientType}`);
    }
  }
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const circle = new SummoningCircle();

  console.log('--- Summoning creatures ---');
  const dragon = circle.summon('fire');
  dragon.useAbility();
  assert.ok(dragon instanceof Dragon);

  const phoenix = circle.summon('air');
  phoenix.useAbility();
  assert.ok(phoenix instanceof Phoenix);

  const unicorn = circle.summon('sparkles');
  unicorn.useAbility();
  assert.ok(unicorn instanceof Unicorn);

  console.log(
    '\nTest passed: each ingredient type summoned the right creature',
  );

  assert.throws(() => circle.summon('mud'), /Unknown ingredient type: mud/);
  console.log(
    'Test passed: an unknown ingredient throws instead of summoning silently',
  );

  console.log(
    '🎉 The summoning circle creates the right creature for each ingredient',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
