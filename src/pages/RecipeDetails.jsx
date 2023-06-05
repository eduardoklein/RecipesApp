import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getMealDetailsById, getDrinkDetailsById } from '../services/api';

class RecipeDetails extends Component {
  state = {
    product: {},
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

    let product = {};
    if (pathname.includes('/meals')) product = await getMealDetailsById(id);
    else product = await getDrinkDetailsById(id);
    this.setState({ product });
  };

  render() {
    const { product } = this.state;
    return (
      <>
        <div>RecipeDetails</div>
        <div>{product.idMeal}</div>
      </>
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
