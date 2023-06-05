// arquivo para requisições a API

export async function getMealDetailsById(id) {
  const endpointMeal = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const response = await fetch(endpointMeal);
  const data = await response.json();
  return data.meals[0];
}

export async function getDrinkDetailsById(id) {
  const endpointDrink = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
  const response = await fetch(endpointDrink);
  const data = await response.json();
  return data.drinks[0];
}

export async function getRecommendedDrinks() {
  const endpointRecDrink = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
  const response = await fetch(endpointRecDrink);
  const data = await response.json();
  return data.drinks;
}

export async function getRecommendedMeals() {
  const endpointRecMeal = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  const response = await fetch(endpointRecMeal);
  const data = await response.json();
  return data.meals;
}
