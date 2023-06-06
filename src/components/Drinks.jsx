import React, { Component } from 'react';
import { fetchDrinks } from '../services/api';

class Drinks extends Component {
  state = {
    drinks: [],
  };

  componentDidMount() {
    this.handleFetchDrinks();
  }

  handleFetchDrinks = async () => {
    const limitNumber = 12;
    const drinks = await fetchDrinks();
    const reducedDrinksArr = drinks.slice(0, limitNumber);

    this.setState({
      drinks: reducedDrinksArr,
    });
  };

  render() {
    const { drinks } = this.state;

    return (
      <div>
        <h2>Drinks</h2>
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
