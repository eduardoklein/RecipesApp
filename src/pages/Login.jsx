import React, { Component } from 'react';

class Login extends Component {
  state = {
    email: '',
    password: '',
    invalidForm: true,
  };

  handleChange = ({ target }) => {
    const { value, name } = target;
    this.setState({
      [name]: value,
    }, this.checkValidForm);
  };

  checkValidForm = () => {
    const { email, password } = this.state;
    const validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const magicPassword = 6;

    if (email.match(validRegex) && password.length > magicPassword) {
      this.setState({
        invalidForm: false,
      });
    } else {
      this.setState({
        invalidForm: true,
      });
    }
  };

  render() {
    const { email, password, invalidForm } = this.state;
    return (
      <div>
        <h1>Login</h1>
        <form>
          <input
            type="email"
            placeholder="Email"
            data-testid="email-input"
            name="email"
            value={ email }
            onChange={ this.handleChange }
          />
          <input
            type="password"
            placeholder="Password"
            data-testid="password-input"
            name="password"
            value={ password }
            onChange={ this.handleChange }
          />
          <button
            data-testid="login-submit-btn"
            disabled={ invalidForm }
          >
            Enter
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
