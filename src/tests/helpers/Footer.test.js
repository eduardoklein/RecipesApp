import React from 'react';
import { screen } from '@testing-library/react';
import { renderWhithRouterAndRedux } from './renderWithRouterAndRedux';
import App from './.App';

describe('Testes do componente Footer', () => {
  it('Verifica se o Footer está sendo renderizado corretamente', () => {
    renderWithRouter(
      <App />,
      { initialEntries: ['/meals'] },
    );

    const profileIcon = screen.getByRole('img', {
      name: /perfil/i,
    });

    expect(profileIcon).toBeInTheDocument();
  });

  it('Verifica se, ao clicar no ícone de busca, é exibido um input', () => {
    renderWithRouter(
      <App />,
      { initialEntries: ['/meals'] },
    );

    const drinkIcon = screen.getByRole('img', {
      name: /bebida/i,
    });

    const mealsIcon = screen.getByRole('img', {
      name: /comida/i,
    });

    expect(drinkIcon).toBeInTheDocument();
    expect(mealsIcon).toBeInTheDocument();
  });
});
