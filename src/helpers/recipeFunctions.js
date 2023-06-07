export const getIngredientsAndMeasure = (product) => {
  const ingredients = Object.entries(product).filter((entry) => {
    const [key, value] = entry;
    return key.includes('strIngredient') && value;
  }).map((entry) => entry[1]);
  const measures = Object.entries(product).filter((entry) => {
    const [key, value] = entry;
    return key.includes('strMeasure') && value;
  }).map((entry) => entry[1]);
  return { ingredients, measures };
};
