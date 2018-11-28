/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'any-string-you-like',
};

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      username: '',
      password: '',
      error: '',
    };
  }

  loginOnChange = (ev) => {
    this.setState({ username: ev.target.value });
  };

  passwordOnChange = (ev) => {
    this.setState({ password: ev.target.value });
  };

  handleLogin = (ev) => {
    ev.preventDefault();
    const { username, password } = this.state;
    fetch('/login', {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then((responseData) => {
        const { changeUser } = this.props;
        if (responseData.error) {
          changeUser();
          this.setState({ error: responseData.error, isValid: false });
          return;
        }
        changeUser(responseData.user);
        const { toggleModal } = this.props;
        toggleModal();
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
      });
  };

  render() {
    const {
      isValid, username, password, error,
    } = this.state;
    return (
      <div className="loginForm">
        {!isValid
        && (
          <span className="errorMessage">{error}</span>
        )
        }
        <form onSubmit={this.handleLogin} className="formContainer">
          <label htmlFor="userInput">
            {'USERNAME:'}
            <input id="userInput" name="username" value={username} onChange={this.loginOnChange} />
          </label>
          <label htmlFor="passwordInput">
            {'PASSWORD:'}
            <input id="passwordInput" type="password" name="password" value={password} onChange={this.passwordOnChange} />
          </label>
          <input type="submit" value="LOGIN" />
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  changeUser: PropTypes.func.isRequired,
};


export default LoginForm;
