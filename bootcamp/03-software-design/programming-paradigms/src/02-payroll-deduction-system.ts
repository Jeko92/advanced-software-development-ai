interface Deductible {
  apply(baseSalary: number): number;
  getDeductionName(): string;
}

abstract class BaseDeduction implements Deductible {
  private describe(baseSalary: number): string {
    return `Applying ${this.getDeductionName()} Deduction to $${baseSalary}`;
  }

  protected abstract calculateAmount(baseSalary: number): number;

  apply(baseSalary: number): number {
    console.log(this.describe(baseSalary));
    return baseSalary - this.calculateAmount(baseSalary);
  }

  abstract getDeductionName(): string;
}

class TaxDeduction extends BaseDeduction {
  override calculateAmount(remainingSalary: number): number {
    return remainingSalary * 0.1;
  }

  override getDeductionName(): string {
    return 'tax';
  }
}

class InsuranceDeduction extends BaseDeduction {
  override calculateAmount(): number {
    return 200;
  }

  override getDeductionName(): string {
    return 'insurance';
  }
}

class PayrollService {
  #deductibles: Deductible[];
  constructor(deductibles: Deductible[]) {
    this.#deductibles = deductibles;
  }

  runPayroll(remainingAmount: number): string {
    let reducedAmount: number = remainingAmount;
    for (const deductible of this.#deductibles) {
      reducedAmount = deductible.apply(reducedAmount);
    }

    console.log(`Take home amount ${reducedAmount}`);
    return `Take home amount ${reducedAmount}`;
  }
}

const baseSalary = 5000;

const payrollService = new PayrollService([
  new TaxDeduction(),
  new InsuranceDeduction(),
]);
payrollService.runPayroll(baseSalary);
