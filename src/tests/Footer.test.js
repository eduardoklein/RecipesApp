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

    // Verifica se a imagem drinks está presente na página
    const imgDrink = screen.getByTestId('drinks-bottom-btn');
    expect(imgDrink).toBeInTheDocument();

    // Verifica se imagem meals está presente na página
    const imgMeals = screen.getByTestId('meals-bottom-btn');
    expect(imgMeals).toBeInTheDocument();

    // verifica se é possível clicar na imagem "Drink"
    userEvent.click(imgDrink);

    // verifica se é possível clicar na imagem "Meals"
    userEvent.click(imgMeals);
  });
});
