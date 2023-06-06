import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import Carousel from 'react-bootstrap/Carousel';
import { getMealDetailsById, getDrinkDetailsById, fetchMeals,
  fetchDrinks } from '../services/api';
import RecipeDetailsCard from '../components/RecipeDetailsCard';
import { getIngredientsAndMeasure } from '../helpers/recipeFunctions';

class RecipeDetails extends Component {
  state = {
    product: null,
    recommended: null,
    status: 'new',
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
    this.setState({ product, recommended }, this.checkRecipeStatus);
  };

  checkRecipeStatus = () => {
    const { product } = this.state;
    const id = product.idMeal || product.idDrink;
    const done = (JSON.parse(localStorage
      .getItem('doneRecipes')) || []).some((recipe) => (recipe.id === id));
    if (done) this.setState({ status: 'done' });
    else {
      let inProgress = { meals: {}, drinks: {} };
      inProgress = { ...inProgress,
        ...JSON.parse(localStorage.getItem('inProgressRecipes')),
      };
      if (inProgress.meals[id] || inProgress.drinks[id]) {
        this.setState({ status: 'inProgress' });
      }
    }
  };

  startRecipe = () => {
    const { history } = this.props;
    const { location: { pathname } } = history;
    history.push(`${pathname}/in-progress`);
  };

  buttonRender = () => {
    const { status } = this.state;
    let func;
    let text;
    switch (status) {
    case 'done':
      return null;
    case 'inProgress':
      func = this.startRecipe;
      text = 'Continue Recipe';
      break;
    default:
      func = this.startRecipe;
      text = 'Start Recipe';
    }
    return (
      <button
        type="button"
        className="w-100 fixed-bottom py-3"
        data-testid="start-recipe-btn"
        onClick={ func }
      >
        {text}

      </button>
    );
  };

  render() {
    const { product, recommended } = this.state;
    if (!product) return (<div>Loading...</div>);
    const { ingredients, measures } = getIngredientsAndMeasure(product);
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
        <RecipeDetailsCard product={ product } />
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
        { this.buttonRender() }
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
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default RecipeDetails;
