/**
 * Challenge 3.4 — Strategy: Validation Rules
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 3, Challenge 3.4)
 *
 * TODO:
 * - `PasswordValidator` interface — `validate(password: string): boolean`
 * - `LengthValidator` (minimum length), `ComplexityValidator` (requires
 *   letters, numbers, symbols), `CommonPasswordValidator` (rejects a small
 *   deny-list like `['password', '123456']`)
 * - `PasswordChecker` that accepts an array of strategies and runs them all
 *   in order
 * - show a registration form switching between "strict" and "lenient"
 *   presets by passing different strategy arrays
 *
 * Focus: strategies are small, interchangeable, and composable.
 */
import assert from 'node:assert';

interface PasswordValidator {
  validate(password: string): boolean;
}

class LengthValidator implements PasswordValidator {
  constructor(private readonly minLength: number) {}

  validate(password: string): boolean {
    return password.length >= this.minLength;
  }
}

class ComplexityValidator implements PasswordValidator {
  validate(password: string): boolean {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    return hasLetter && hasNumber && hasSymbol;
  }
}

class CommonPasswordValidator implements PasswordValidator {
  constructor(private readonly denyList: string[] = ['password', '123456']) {}

  validate(password: string): boolean {
    return !this.denyList.includes(password.toLowerCase());
  }
}

// PasswordChecker just runs whatever strategies it was given, in order —
// it has no idea which rules those are or how many there are.
class PasswordChecker {
  constructor(private readonly validators: PasswordValidator[]) {}

  check(password: string): boolean {
    return this.validators.every((validator) => validator.validate(password));
  }
}

// ---- Presets: same PasswordChecker shape, different strategy arrays -------

const strictPreset: PasswordValidator[] = [
  new LengthValidator(10),
  new ComplexityValidator(),
  new CommonPasswordValidator(),
];

const lenientPreset: PasswordValidator[] = [
  new LengthValidator(6),
  new CommonPasswordValidator(),
];

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const strictChecker = new PasswordChecker(strictPreset);
  const lenientChecker = new PasswordChecker(lenientPreset);

  // 7 chars, no symbol: too short and not complex enough for strict, but
  // long enough and not on the deny-list for lenient.
  const candidate = 'hunter2';

  console.log(
    `Strict check of "${candidate}" ->`,
    strictChecker.check(candidate),
  );
  assert.strictEqual(strictChecker.check(candidate), false);

  console.log(
    `Lenient check of "${candidate}" ->`,
    lenientChecker.check(candidate),
  );
  assert.strictEqual(lenientChecker.check(candidate), true);

  const strongPassword = 'C0rrect!Horse';
  console.log(
    `Strict check of "${strongPassword}" ->`,
    strictChecker.check(strongPassword),
  );
  assert.strictEqual(strictChecker.check(strongPassword), true);

  console.log(
    `Lenient check of "password" ->`,
    lenientChecker.check('password'),
  );
  assert.strictEqual(lenientChecker.check('password'), false);

  console.log(
    '🎉 Same PasswordChecker, different strategy arrays -> different rules enforced',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
