import React, { Component } from 'react';
import { fetchMeals } from '../services/api';

class Meals extends Component {
  state = {
    meals: [],
  };

  componentDidMount() {
    this.handleFetchMeals();
  }

  handleFetchMeals = async () => {
    const limitNumber = 12;
    const meals = await fetchMeals();
    const newMealsArr = meals.slice(0, limitNumber);

    this.setState({
      meals: newMealsArr,
    });
  };

  render() {
    const { meals } = this.state;
    return (
      <div>
        <h2>Meals</h2>
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
