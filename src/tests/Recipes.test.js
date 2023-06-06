import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';

import App from '../App';

beforeEach(() => {
  jest.spyOn(global, 'fetch');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Testa o componente Recipes', () => {
  it('Testa se as doze primeiras receitas de comidas são renderizadas', async () => {
    renderWithRouterAndRedux(<App />, {}, '/meals');

    const meals = await screen.findAllByTestId(/-recipe-card/i);
    expect(meals).toHaveLength(12);
  });

  it('Testa se as doze primeiras receitas de bebidas são renderizadas', async () => {
    renderWithRouterAndRedux(<App />, {}, '/drinks');

    const drinks = await screen.findAllByTestId(/-recipe-card/i);
    expect(drinks).toHaveLength(12);
  });
});
