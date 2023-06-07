import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { mockFetch } from './helpers/mockDataRecipeDetails';

const MEAL_PATH = '/meals/52882/in-progress';
const DRINK_PATH = '/drinks/178319/in-progress';
const RECIPE_TITLE = 'recipe-title';
const FINISH_RECIPE_BTN = 'finish-recipe-btn';

describe('Testando a Tela de receita em progresso', () => {
  beforeEach(() => jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  afterEach(() => jest.restoreAllMocks());

  it('testando se receita de meal é renderizada', async () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, MEAL_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(RECIPE_TITLE).textContent).toBe('Three Fish Pie');
    expect(screen.getByTestId('recipe-category')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-photo')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
    expect(screen.getByTestId(FINISH_RECIPE_BTN)).toBeDisabled();

    const ingredients = screen.getAllByTestId(/-ingredient-step/i);
    expect(ingredients).toHaveLength(14);
    ingredients.forEach((ingredient) => { userEvent.click(ingredient); });

    expect(screen.getByTestId(FINISH_RECIPE_BTN)).not.toBeDisabled();
    userEvent.click(screen.getByTestId(FINISH_RECIPE_BTN));
    expect(history.location.pathname).toBe('/done-recipes');
  });
  it('testando se receita de drink é renderizada', async () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, DRINK_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(RECIPE_TITLE).textContent).toBe('Aquamarine');
    expect(screen.getByTestId('recipe-category')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-photo')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
    expect(screen.getByTestId(FINISH_RECIPE_BTN)).toBeDisabled();

    const ingredients = screen.getAllByTestId(/-ingredient-step/i);
    expect(ingredients).toHaveLength(3);
    ingredients.forEach((ingredient) => { userEvent.click(ingredient); });

    expect(screen.getByTestId(FINISH_RECIPE_BTN)).not.toBeDisabled();
    userEvent.click(screen.getByTestId(FINISH_RECIPE_BTN));
    expect(history.location.pathname).toBe('/done-recipes');
  });
  it('testando se a lista de ingredientes permanece apos atualizar a página', async () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, DRINK_PATH);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    let ingredients = screen.getAllByTestId(/-ingredient-step/i);
    let ingredientCheckbox = within(ingredients[1]).getByRole('checkbox');
    expect(ingredientCheckbox.checked).toBe(true);
    userEvent.click(ingredients[1]);
    expect(ingredientCheckbox.checked).toBe(false);
    act(() => {
      history.push('/');
      history.push(DRINK_PATH);
    });
    ingredients = screen.getAllByTestId(/-ingredient-step/i);
    ingredientCheckbox = within(ingredients[1]).getByRole('checkbox');
    expect(ingredientCheckbox.checked).toBe(false);
  });
});
