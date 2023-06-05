import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { getMealDetailsById, getDrinkDetailsById } from '../services/api';

class RecipeDetails extends Component {
  state = {
    product: null,
  };

  componentDidMount() {
    this.fetchProduct();
  }

  fetchProduct = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const {
      history: {
        location: { pathname },
      },
    } = this.props;

    let product = null;
    if (pathname.includes('/meals')) product = await getMealDetailsById(id);
    else product = await getDrinkDetailsById(id);
    this.setState({ product });
  };

  getIngredientsAndMeasure = () => {
    const { product } = this.state;
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

  render() {
    const { product } = this.state;
    if (!product) return (<div>Loading...</div>);
    const { ingredients, measures } = this.getIngredientsAndMeasure();
    const ingredientsAndMeasures = ingredients.map((ingredient, index) => (
      <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
        { `${ingredient} - ${measures[index]}` }
      </li>
    ));

    return (
      <div>
        <h2 data-testid="recipe-title">{product.strMeal || product.strDrink}</h2>
        <p data-testid="recipe-category">
          { product.strAlcoholic || product.strCategory }
        </p>
        <img
          src={ product.strMealThumb || product.strDrinkThumb }
          alt="recipe"
          data-testid="recipe-photo"
        />
        <p data-testid="instructions">{ product.strInstructions }</p>
        <ol>
          {ingredientsAndMeasures}
        </ol>
        { product.strYoutube
        && (
          <div data-testid="video">
            <ReactPlayer url={ product.strYoutube } />
          </div>) }

      </div>
    );
  }
}

RecipeDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default RecipeDetails;
