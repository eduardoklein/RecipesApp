import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Meals from '../components/Meals';
import Drinks from '../components/Drinks';

class Recipes extends Component {
  render() {
    const { location: { pathname } } = this.props;
    if (pathname === '/meals') {
      return (
        <div>
          <Meals />
        </div>
      );
    }
    return (
      <div>
        <Drinks />
      </div>
    );
  }
}

Recipes.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
  }).isRequired,
};

export default Recipes;
