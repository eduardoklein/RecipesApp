import { waitFor, screen } from '@testing-library/react';
import App from '../App';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { mockFetch } from './helpers/mockDataRecipeDetails';

const MEAL_PATH = '/meals/52882/in-progress';
const DRINK_PATH = '/drinks/178319/in-progress';
const RECIPE_TITLE = 'recipe-title';
const FAVORITE_BTN = 'favorite-btn';
const START_RECIPE_BTN = 'start-recipe-btn';
const WHITE_HEART = 'http://localhost/whiteHeartIcon.svg';
const BLACK_HEART = 'http://localhost/blackHeartIcon.svg';
const COPIED_MSG = 'Link copied!';
const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

describe('Testando a Tela de receita em progresso', () => {
  beforeEach(() => jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  afterEach(() => jest.restoreAllMocks());

  it('testando se receita de meal é renderizada', async () => {
    renderWithRouterAndRedux(<App />, {}, MEAL_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(RECIPE_TITLE).textContent).toBe('Three Fish Pie');
    expect(screen.getAllByTestId(/-ingredient-step/i)).toHaveLength(14);
    expect(screen.getByTestId('recipe-category')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-photo')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
  });
  it('testando se receita de drink é renderizada', async () => {
    renderWithRouterAndRedux(<App />, {}, DRINK_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(RECIPE_TITLE).textContent).toBe('Aquamarine');
    expect(screen.getAllByTestId(/-ingredient-step/i)).toHaveLength(3);
    expect(screen.getByTestId('recipe-category')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-photo')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
  });
});
