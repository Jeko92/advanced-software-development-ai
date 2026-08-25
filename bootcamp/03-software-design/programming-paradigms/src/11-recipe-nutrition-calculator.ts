interface NutrientSource {
  getCalories(servings: number): number;
  getSourceName(): string;
}

abstract class BaseIngredient implements NutrientSource {
  abstract caloriesPerServing(): number;

  getCalories(servings: number): number {
    // console.log(this.describePortion(servings));
    return this.caloriesPerServing() * servings;
  }

  abstract getSourceName(): string;

  protected describePortion(servings: number): string {
    return `${servings} servings of ${this.getSourceName()}`;
  }
}

class ProteinIngredient extends BaseIngredient {
  constructor(
    private readonly name: string,
    private readonly calories: number,
  ) {
    super();
  }

  override caloriesPerServing(): number {
    return this.calories;
  }

  override getSourceName(): string {
    return this.name;
  }
}

class CarbIngredient extends BaseIngredient {
  constructor(
    private readonly name: string,
    private readonly calories: number,
  ) {
    super();
  }

  override caloriesPerServing(): number {
    return this.calories;
  }

  override getSourceName(): string {
    return this.name;
  }
}
class RecipeBuilder {
  #nutrients: NutrientSource[];
  #recipeName: string;

  constructor(recipeName: string, nutrients: NutrientSource[]) {
    this.#recipeName = recipeName;
    this.#nutrients = nutrients;
  }

  totalCalories(servings: number): number {
    let totalCalories = 0;

    console.log(this.#recipeName);
    console.log(
      `Ingredients: ${this.#nutrients
        .map((nutrient) => nutrient.getSourceName())
        .join(', ')}`,
    );

    for (const nutrient of this.#nutrients) {
      totalCalories += nutrient.getCalories(servings);
    }

    console.log(`${servings} servings — ${totalCalories} calories`);

    return totalCalories;
  }
}

const recipe = new RecipeBuilder('Pasta with Chicken', [
  new ProteinIngredient('Chicken Breast', 300),
  new ProteinIngredient('Salmon', 400),
  new ProteinIngredient('Eggs', 155),
  new CarbIngredient('Rice', 145),
  new CarbIngredient('Potatoes', 130),
  new CarbIngredient('Pasta', 350),
]);

console.log(recipe.totalCalories(3));
