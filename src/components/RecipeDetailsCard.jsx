import PropTypes from 'prop-types';
import React, { Component } from 'react';
import clipboardCopy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';

export default class RecipeDetailsCard extends Component {
  state = {
    msg: '',
    favorited: false,
  };

  componentDidMount() {
    this.checkRecipeFavorited();
  }

  checkRecipeFavorited = () => {
    const { product } = this.props;
    const id = product.idMeal || product.idDrink;
    const favorited = (JSON.parse(localStorage
      .getItem('favoriteRecipes')) || []).some((recipe) => (recipe.id === id));
    if (favorited) this.setState({ favorited: true });
  };

  favoriteRecipe = () => {
    const { product } = this.props;
    const { favorited } = this.state;
    if (!favorited) {
      const otherRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
      const id = product.idDrink || product.idMeal;
      const alcoholicOrNot = product.strAlcoholic || '';
      const type = product.idDrink ? 'drink' : 'meal';
      const nationality = product.strArea || '';
      const category = product.strCategory;
      const name = product.strDrink || product.strMeal;
      const image = product.strDrinkThumb || product.strMealThumb;
      localStorage.setItem('favoriteRecipes', JSON.stringify(
        [...otherRecipes,
          { id, type, nationality, category, alcoholicOrNot, name, image }],
      ));
      this.setState({ favorited: true });
    } else {
      const otherRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')).filter(
        (recipe) => recipe.id !== (product.idDrink || product.idMeal),
      );
      localStorage.setItem('favoriteRecipes', JSON.stringify(otherRecipes));
      this.setState({ favorited: false });
    }
  };

  shareRecipe = () => {
    clipboardCopy(window.location.href);
    this.setState({ msg: 'Link copied!' });
  };

  render() {
    const { product } = this.props;
    const { msg, favorited } = this.state;
    return (
      <>
        <h2 data-testid="recipe-title">{product.strMeal || product.strDrink}</h2>
        <button type="button" data-testid="share-btn" onClick={ this.shareRecipe }>
          <img src={ shareIcon } alt="share" />
          Compartilhar
        </button>
        <input
          className="favorite-btn"
          type="image"
          alt="favorite"
          data-testid="favorite-btn"
          onClick={ this.favoriteRecipe }
          src={ favorited ? blackHeartIcon : whiteHeartIcon }
        />
        <span>{ msg }</span>
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
      </>
    );
  }
}

RecipeDetailsCard.propTypes = {
  product: PropTypes.shape({
    strAlcoholic: PropTypes.string,
    strCategory: PropTypes.string,
    strDrink: PropTypes.string,
    strDrinkThumb: PropTypes.string,
    strInstructions: PropTypes.string,
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
  }),
}.isRequired;
