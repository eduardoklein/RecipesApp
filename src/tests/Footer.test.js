import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import Footer from '../components/Footer';

describe('Teste do Footer', () => {
  it('Teste do componente Footer', () => {
    const history = createMemoryHistory();
    history.push('/meals'); // Adiciona a rota "/meals"

    render(
      <Router history={ history }>
        <Footer />
      </Router>,
    );

    const imgDrink = screen.getByTestId('drinks-bottom-btn');
    expect(imgDrink).toBeInTheDocument();

    const imgMeals = screen.getByTestId('meals-bottom-btn');
    expect(imgMeals).toBeInTheDocument();

    userEvent.click(imgDrink);

    userEvent.click(imgMeals);
  });
});
