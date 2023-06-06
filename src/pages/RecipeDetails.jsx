import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import Carousel from 'react-bootstrap/Carousel';
import { getMealDetailsById, getDrinkDetailsById, fetchMeals,
  fetchDrinks } from '../services/api';

class RecipeDetails extends Component {
  state = {
    product: null,
    recommended: null,
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
    let recommended = null;
    if (pathname.includes('/meals')) {
      product = await getMealDetailsById(id);
      recommended = await fetchDrinks();
    } else {
      product = await getDrinkDetailsById(id);
      recommended = await fetchMeals();
    }
    recommended.length = 6;
    this.setState({ product, recommended });
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
    const { product, recommended } = this.state;
    if (!product) return (<div>Loading...</div>);
    const { ingredients, measures } = this.getIngredientsAndMeasure();
    const ingredientsAndMeasures = ingredients.map((ingredient, index) => (
      <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
        { `${ingredient} - ${measures[index]}` }
      </li>
    ));

    const recommendations = recommended.map((item, index) => (
      <Carousel.Item
        key={ index }
        data-testid={ `${index}-recommendation-card` }
      >
        <img
          src={ `${(item.strMealThumb || item.strDrinkThumb)}/preview` }
          className="d-block w-100"
          alt="recipe"
        />
        <Carousel.Caption>
          <h3 data-testid={ `${index}-recommendation-title` }>
            { item.strMeal || item.strDrink }
          </h3>
        </Carousel.Caption>
      </Carousel.Item>
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
          className="w-100"
          data-testid="recipe-photo"
        />
        <p data-testid="instructions">{ product.strInstructions }</p>
        <ol>
          {ingredientsAndMeasures}
        </ol>
        { product.strYoutube
        && (
          <div data-testid="video">
            <ReactPlayer url={ product.strYoutube } className="w-100" />
          </div>) }
        <Carousel variant="dark" interval={ null } slide={ false }>
          {recommendations}
        </Carousel>
        <button
          type="button"
          className="w-100 fixed-bottom py-3"
          data-testid="start-recipe-btn"
        >
          Start Recipe

        </button>
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
