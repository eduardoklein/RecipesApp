import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import { mockFetch } from './helpers/mockDataRecipeDetails';

const MEAL_PATH = '/meals/52882';
const DRINK_PATH = '/drinks/178319';
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

describe('Testando a Tela de detalhes de uma receita', () => {
  beforeEach(() => jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  afterEach(() => jest.restoreAllMocks());

  it('testando se receita de meal é renderizada, e os botoes', async () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, MEAL_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(RECIPE_TITLE).textContent).toBe('Three Fish Pie');
    expect(screen.getAllByTestId(/ingredient-name-and-measure/i)).toHaveLength(14);
    expect(screen.getByTestId('recipe-category')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-photo')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();

    // Teste Share
    expect(screen.queryByText(COPIED_MSG)).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId('share-btn'));
    expect(screen.queryByText(COPIED_MSG)).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Teste Favorite
    expect(screen.getByTestId(FAVORITE_BTN).src).toBe(WHITE_HEART);
    userEvent.click(screen.getByTestId(FAVORITE_BTN));
    expect(screen.getByTestId(FAVORITE_BTN).src).toBe(BLACK_HEART);
    userEvent.click(screen.getByTestId(FAVORITE_BTN));
    expect(screen.getByTestId(FAVORITE_BTN).src).toBe(WHITE_HEART);

    // Teste Start Recipe
    userEvent.click(screen.getByTestId(START_RECIPE_BTN));
    expect(history.location.pathname).toBe('/meals/52882/in-progress');
  });
  it('testando se receita de drink é renderizada, e os botoes ', async () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, DRINK_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(RECIPE_TITLE).textContent).toBe('Aquamarine');
    expect(screen.getAllByTestId(/ingredient-name-and-measure/i)).toHaveLength(3);
    expect(screen.getByTestId('recipe-category')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-photo')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();

    // Teste Share
    // const user = userEvent.setup();
    expect(screen.queryByText(COPIED_MSG)).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId('share-btn'));
    expect(screen.queryByText(COPIED_MSG)).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    // const conteudoCopiado = await window.navigator.clipboard.readText();
    // expect(conteudoCopiado).toBe('http://localhost:3000/drinks/178319');

    // Teste Favorite
    expect(screen.getByTestId(FAVORITE_BTN).src).toBe(WHITE_HEART);
    userEvent.click(screen.getByTestId(FAVORITE_BTN));
    expect(screen.getByTestId(FAVORITE_BTN).src).toBe(BLACK_HEART);
    userEvent.click(screen.getByTestId(FAVORITE_BTN));
    expect(screen.getByTestId(FAVORITE_BTN).src).toBe(WHITE_HEART);

    // Teste Start Recipe
    userEvent.click(screen.getByTestId(START_RECIPE_BTN));
    expect(history.location.pathname).toBe('/drinks/178319/in-progress');
  });

  it('testando se o botao é alterado se a receita de meals esta em progresso  ', async () => {
    const inProgressRecipes = {
      meals: {
        52882: [],
      },
    };
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
    renderWithRouterAndRedux(<App />, {}, MEAL_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(START_RECIPE_BTN).textContent).toBe('Continue Recipe');
  });
  it('testando se o botao é alterado se a receita de drinks esta em progresso  ', async () => {
    const inProgressRecipes = {
      drinks: {
        178319: [],
      },
    };
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
    renderWithRouterAndRedux(<App />, {}, DRINK_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(START_RECIPE_BTN).textContent).toBe('Continue Recipe');
  });

  it('testando se o botao é alterado se a receita de meals esta terminada e favoritada', async () => {
    const doneRecipes = [{
      id: '52882',
      type: 'meals',
    }];
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    const favoriteRecipes = [{
      id: '52882',
      type: 'meal',
    }];
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
    renderWithRouterAndRedux(<App />, {}, MEAL_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.queryByTestId(START_RECIPE_BTN)).not.toBeInTheDocument();
  });

  it('testando se o botao é alterado se a receita de drinks esta terminada e favoritada', async () => {
    const doneRecipes = [{
      id: '178319',
      type: 'drink',
    }];
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    const favoriteRecipes = [{
      id: '178319',
      type: 'drink',
    }];
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
    renderWithRouterAndRedux(<App />, {}, DRINK_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.queryByTestId(START_RECIPE_BTN)).not.toBeInTheDocument();
  });
});
