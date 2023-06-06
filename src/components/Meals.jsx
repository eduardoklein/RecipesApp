import React, { Component } from 'react';
import { fetchMealsCategories, fetchMeals, fetchFilteredMeals } from '../services/api';

class Meals extends Component {
  state = {
    meals: [],
    mealsCategories: [],
    click: false,
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

  handleClick = async (category) => {
    const { click } = this.state;
    const limitNumber = 12;

    const filteredMeals = await fetchFilteredMeals(category);
    const newFilteredMeals = filteredMeals.slice(0, limitNumber);

    if (!click) {
      this.setState({
        meals: newFilteredMeals,
        click: true,
      });
    } else {
      this.handleFetchMeals();
      this.setState({
        click: false,
      });
    }
  };

  render() {
    const { meals, mealsCategories } = this.state;
    return (
      <div>
        <h2>Meals</h2>
        {mealsCategories.map(({ strCategory }, index) => (
          <div key={ index }>
            <button
              data-testid={ `${strCategory}-category-filter` }
              onClick={ () => this.handleClick(strCategory) }
            >
              {strCategory}
            </button>
          </div>
        ))}
        <button
          data-testid="All-category-filter"
          onClick={ this.handleFetchMeals }
        >
          All
        </button>

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
