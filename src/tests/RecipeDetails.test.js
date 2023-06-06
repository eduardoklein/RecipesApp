import { waitFor, screen } from '@testing-library/react';
import App from '../App';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { mockFetch } from './helpers/mockDataRecipeDetails';

const RECIPE_TITLE = 'recipe-title';
describe('Testando a Tela de detalhes de uma receita', () => {
  beforeEach(() => jest.spyOn(global, 'fetch').mockImplementation(mockFetch));
  it('testando se receita de meal é renderizada ', async () => {
    renderWithRouterAndRedux(<App />, {}, '/meals/52882');
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(RECIPE_TITLE)).toBeInTheDocument();
    expect(screen.getByTestId(RECIPE_TITLE).textContent).toBe('Three Fish Pie');
    expect(screen.getByTestId('recipe-category')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-photo')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
  });
  it('testando se receita de drink é renderizada ', async () => {
    renderWithRouterAndRedux(<App />, {}, '/drinks/178319');
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    }, 3000);
    expect(screen.getByTestId(RECIPE_TITLE)).toBeInTheDocument();
    expect(screen.getByTestId('recipe-category')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-photo')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
  });
});
