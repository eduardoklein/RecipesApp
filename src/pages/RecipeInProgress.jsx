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
    this.setState({ product }, this.checkRecipeProgress);
  };

  checkRecipeProgress = () => {
    const { product } = this.state;
    console.log(product);
  };

  completeStep = (index) => {
    const { stepsCompleted } = this.state;
    stepsCompleted[index] = !stepsCompleted[index];
    this.setState({ stepsCompleted });
  };

  render() {
    const { product, stepsCompleted } = this.state;
    if (!product) return (<div>Loading...</div>);
    const { ingredients, measures } = getIngredientsAndMeasure(product);
    const checkboxIngredientsAndMeasures = ingredients.map((ingredient, index) => (
      <li key={ index }>
        <label
          data-testid={ `${index}-ingredient-step` }
          className={ stepsCompleted[index] && 'ingredient-step-completed' }
        >
          <input
            type="checkbox"
            className="mx-1"
            checked={ stepsCompleted[index] || false }
            onClick={ () => { this.completeStep(index); } }
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
