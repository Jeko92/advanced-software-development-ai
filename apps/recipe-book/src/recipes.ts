export type Ingredient = {
  name: string;
  amountGrams: number;
}

type Recipe = {
  name: string;
  servings: number;
  vegetarian: boolean;
  ingredients: Ingredient[];
}

const khachapuri: Recipe = {
  name: "Khachapuri",
  servings: 4,
  vegetarian: true,
  ingredients: [
    { name: "Flour", amountGrams: 500 },
    { name: "Mozzarella cheese", amountGrams: 300 },
    { name: "Egg", amountGrams: 50 },
    { name: "Butter", amountGrams: 30 },
  ],
};

const khinkali: Recipe = {
  name: "Khinkali",
  servings: 4,
  vegetarian: false,
  ingredients: [
    { name: "Flour", amountGrams: 500 },
    { name: "Ground beef", amountGrams: 400 },
    { name: "Onion", amountGrams: 100 },
    { name: "Water", amountGrams: 200 },
  ],
};

function summarize(recipe: Recipe): string {
  return `${recipe.name} (${recipe.servings} servings) - ${
    recipe.vegetarian ? "Vegetarian" : "Non-vegetarian"
  } - Ingredients: ${recipe.ingredients.length}`;
}

console.log(summarize(khachapuri));
// "Khachapuri (4 servings) - Vegetarian - Ingredients: 4"

console.log(summarize(khinkali));
// "Khinkali (4 servings) - Non-vegetarian - Ingredients: 4"
