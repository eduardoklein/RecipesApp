import '../style/Footer.css';
import React from 'react';
import { useHistory } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';

export default function Footer() {
  const history = useHistory();

  const handleDrinksClick = () => {
    history.push('/drinks');
  };

  const handleMealsClick = () => {
    history.push('/meals');
  };

  return (
    <div className="footer" data-testid="footer">
      <input
        type="image"
        src={ drinkIcon }
        data-testid="drinks-bottom-btn"
        alt="imagem de drink"
        onClick={ handleDrinksClick }
      />
      <input
        type="image"
        src={ mealIcon }
        data-testid="meals-bottom-btn"
        alt="imagem de talheres"
        onClick={ handleMealsClick }
      />
    </div>
  );
}
