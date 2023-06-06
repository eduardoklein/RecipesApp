import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RecipeDetailsCard from '../components/RecipeDetailsCard';
import { getMealDetailsById, getDrinkDetailsById } from '../services/api';
import { getIngredientsAndMeasure } from '../helpers/recipeFunctions';

class RecipeInProgress extends Component {
  state = {
    product: null,
    stepsCompleted: [],
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
    if (pathname.includes('/meals')) {
      product = await getMealDetailsById(id);
    } else {
      product = await getDrinkDetailsById(id);
    }
    const numberOfIngredients = getIngredientsAndMeasure(product).ingredients.length;
    const stepsCompleted = new Array(numberOfIngredients).fill(false);
    this.setState({ product, stepsCompleted }, this.checkRecipeProgress);
  };

  checkCompleted = () => {
    const { stepsCompleted } = this.state;
    const completed = stepsCompleted.every((step) => step);
    return completed;
  };

  checkRecipeProgress = () => {
    const { product, stepsCompleted } = this.state;
    let inProgressRecipes = { meals: {}, drinks: {} };
    inProgressRecipes = { ...inProgressRecipes,
      ...JSON.parse(localStorage.getItem('inProgressRecipes')),
    };
    const { idMeal } = product;
    let stepsCompletedIndex;
    if (idMeal) {
      stepsCompletedIndex = inProgressRecipes.meals[idMeal] || [];
    } else {
      const { idDrink } = product;
      stepsCompletedIndex = inProgressRecipes.drinks[idDrink] || [];
    }
    stepsCompletedIndex.forEach((step) => {
      stepsCompleted[step] = true;
    });
    this.setState({ stepsCompleted });
  };

  completeStep = (index) => {
    const { stepsCompleted, product } = this.state;
    stepsCompleted[index] = !stepsCompleted[index];
    this.setState({ stepsCompleted });
    const completedIndex = stepsCompleted.map((step, idx) => {
      if (step) return idx;
      return undefined;
    }).filter((item) => item !== undefined);
    const { idMeal } = product;
    let changedRecipeProgress = {};
    if (idMeal) {
      changedRecipeProgress = { meals: { [idMeal]: completedIndex } };
    } else {
      const { idDrink } = product;
      changedRecipeProgress = { drinks: { [idDrink]: completedIndex } };
    }
    const previousProgress = JSON
      .parse(localStorage.getItem('inProgressRecipes')) || {};
    localStorage.setItem(
      'inProgressRecipes',
      JSON.stringify({ ...previousProgress, ...changedRecipeProgress }),
    );
  };

  finishRecipe = () => {
    const { history } = this.props;
    const { product } = this.state;
    const tags = product.strTags ? product.strTags.split(',') : [];
    const recipe = {
      id: product.idMeal || product.idDrink,
      type: product.idMeal ? 'meal' : 'drink',
      nationality: product.strArea || '',
      category: product.strCategory,
      alcoholicOrNot: product.strAlcoholic || '',
      name: product.strDrink || product.strMeal,
      image: product.strDrinkThumb || product.strMealThumb,
      doneDate: new Date().toISOString(),
      tags,
    };
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    localStorage.setItem('doneRecipes', JSON.stringify([...doneRecipes, recipe]));
    history.push('/done-recipes');
  };

  render() {
    const { product, stepsCompleted } = this.state;
    if (!product) return (<div>Loading...</div>);
    const { ingredients, measures } = getIngredientsAndMeasure(product);
    const checkboxIngredientsAndMeasures = ingredients.map((ingredient, index) => (
      <li key={ index }>
        <label
          data-testid={ `${index}-ingredient-step` }
          className={ stepsCompleted[index] ? 'ingredient-step-completed' : '' }
        >
          <input
            type="checkbox"
            className="mx-1"
            checked={ stepsCompleted[index] || false }
            onChange={ () => { this.completeStep(index); } }
          />
          { `${ingredient} - ${measures[index]}` }
        </label>
      </li>
    ));
    return (
      <main>
        <RecipeDetailsCard product={ product } />
        <ol>
          {checkboxIngredientsAndMeasures}
        </ol>
        <button
          type="button"
          className="w-100 fixed-bottom py-3"
          data-testid="finish-recipe-btn"
          disabled={ !this.checkCompleted() }
          onClick={ this.finishRecipe }
        >
          Finish Recipe
        </button>
      </main>
    );
  }
}

RecipeInProgress.propTypes = {
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

export default RecipeInProgress;
