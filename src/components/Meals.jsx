import React, { Component } from 'react';
import { fetchMealsCategories, fetchMeals } from '../services/api';

class Meals extends Component {
  state = {
    meals: [],
    mealsCategories: [],
  };

  componentDidMount() {
    this.handleFetchMeals();
  }

  handleFetchMeals = async () => {
    const limitNumbers = { categories: 5, meals: 12 };

    const meals = await fetchMeals();
    const mealsCtg = await fetchMealsCategories();
    const newMealsArr = meals.slice(0, limitNumbers.meals);
    const newMealsCtgArr = mealsCtg.slice(0, limitNumbers.categories);

    this.setState({
      meals: newMealsArr,
      mealsCategories: newMealsCtgArr,
    });
  };

  render() {
    const { meals, mealsCategories } = this.state;
    return (
      <div>
        <h2>Meals</h2>
        {mealsCategories.map(({ strCategory }, index) => (
          <div key={ index }>
            <button data-testid={ `${strCategory}-category-filter` }>
              {strCategory}
            </button>
          </div>
        ))}

        {meals.map((meal, index) => (
          <div
            key={ meal.idMeal }
            data-testid={ `${index}-recipe-card` }
          >
            <p data-testid={ `${index}-card-name` }>
              {meal.strMeal}
            </p>
            <img
              src={ meal.strMealThumb }
              alt={ meal.strMeal }
              data-testid={ `${index}-card-img` }
            />
          </div>
        ))}
      </div>
    );
  }
}

export default Meals;
