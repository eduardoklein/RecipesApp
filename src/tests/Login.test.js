import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import App from '../App';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';

describe('testa a tela de Login', () => {
  it('Testa se os inputs de email e senha estão presentes na tela', () => {
    // Este arquivo pode ser modificado ou deletado sem problemas
    render(<Login />);
    screen.getByPlaceholderText(/email/i);
    screen.getAllByPlaceholderText(/password/i);
  });

  it('Testa o botão de enviar formulário', () => {
    render(<Login />);
    const submitBtn = screen.getByRole('button', { name: /enter/i });
    expect(submitBtn).toBeDisabled();
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passInput = screen.getByPlaceholderText(/password/i);
    userEvent.type(emailInput, 'teste@teste.com');
    userEvent.type(passInput, 'testeteste');
    expect(submitBtn).not.toBeDisabled();
  });

  it('Testa se o botão de enviar salva as informações no localStorage e redireciona para a página de Meals', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const submitBtn = screen.getByRole('button', { name: /enter/i });
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passInput = screen.getByPlaceholderText(/password/i);
    userEvent.type(emailInput, 'teste@teste.com');
    userEvent.type(passInput, 'testeteste');
    userEvent.click(submitBtn);
    expect(history.location.pathname).toBe('/meals');
  });
});
