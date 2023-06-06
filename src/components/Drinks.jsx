import React, { Component } from 'react';
import { fetchDrinks, fetchDrinksCategories, fetchFilteredDrinks } from '../services/api';

class Drinks extends Component {
  state = {
    drinks: [],
    drinksCategories: [],
  };

  componentDidMount() {
    this.handleFetchDrinks();
  }

  handleFetchDrinks = async () => {
    const limitNumbers = { categories: 5, drinks: 12 };

    const drinks = await fetchDrinks();
    const drinksCtg = await fetchDrinksCategories();
    const newDrinksArr = drinks.slice(0, limitNumbers.drinks);
    const newDrinksCtgArr = drinksCtg.slice(0, limitNumbers.categories);

    this.setState({
      drinks: newDrinksArr,
      drinksCategories: newDrinksCtgArr,
    });
  };

  handleClick = async (category) => {
    const limitNumber = 12;

    const filteredDrinks = await fetchFilteredDrinks(category);
    const newFilteredDrinks = filteredDrinks.slice(0, limitNumber);

    this.setState({
      drinks: newFilteredDrinks,
    });
  };

  render() {
    const { drinks, drinksCategories } = this.state;

    return (
      <div>
        <h2>Drinks</h2>

        {drinksCategories.map(({ strCategory }) => (
          <div key={ strCategory }>
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
          onClick={ this.handleFetchDrinks }
        >
          All
        </button>

        {drinks.map((drink, index) => (
          <div
            key={ drink.idDrink }
            data-testid={ `${index}-recipe-card` }
          >
            <p data-testid={ `${index}-card-name` }>
              {drink.strDrink}
            </p>
            <img
              src={ drink.strDrinkThumb }
              alt={ drink.strDrink }
              data-testid={ `${index}-card-img` }
            />
          </div>
        ))}
      </div>
    );
  }
}

export default Drinks;
