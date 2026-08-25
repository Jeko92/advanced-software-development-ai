interface Attacker {
  attack(targetName: string): void;
  getWeaponName(): string;
}

abstract class BaseWeapon implements Attacker {
  protected abstract formatAttackMessage(targetName: string): string;

  attack(targetName: string): void {
    const formattedMessage = this.formatAttackMessage(targetName);
    console.log(`${formattedMessage}. Dealt ${this.computeDamage()} damage`);
  }

  protected abstract computeDamage(): number;
  abstract getWeaponName(): string;
}

class Sword extends BaseWeapon {
  override formatAttackMessage(targetName: string): string {
    return `You slash ${targetName} with ${this.getWeaponName()} in melee combat!`;
  }

  override computeDamage(): number {
    return 200;
  }

  override getWeaponName() {
    return 'sword';
  }
}

class Bow extends BaseWeapon {
  override formatAttackMessage(targetName: string): string {
    return `You shoot ${targetName} with ${this.getWeaponName()} from range!`;
  }

  override computeDamage(): number {
    return Math.floor(Math.random() * 150 + 1);
  }

  override getWeaponName() {
    return 'bow';
  }
}

class Battle {
  #attackers: Attacker[];

  constructor(attackers: Attacker[]) {
    this.#attackers = attackers;
  }

  attackAll(targetName: string): void {
    this.#attackers.forEach((attacker) => attacker.attack(targetName));
  }
}

const battle = new Battle([new Sword(), new Bow()]);
battle.attackAll('Goblin');
battle.attackAll('Cyclops');
