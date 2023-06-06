import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import meals from '../../cypress/mocks/meals';

import App from '../App';

beforeEach(() => {
  jest.spyOn(global, 'fetch');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Testa o componente Recipes', () => {
  it('Testa se as doze primeiras receitas de comidas são renderizadas', async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(meals),
    });

    renderWithRouterAndRedux(<App />, {}, '/meals');

    const allMeals = await screen.findAllByTestId(/-recipe-card/i);
    expect(allMeals).toHaveLength(12);
  });

  it('Testa se as doze primeiras receitas de bebidas são renderizadas', async () => {
    renderWithRouterAndRedux(<App />, {}, '/drinks');

    const drinks = await screen.findAllByTestId(/-recipe-card/i);
    expect(drinks).toHaveLength(12);
  });
});
