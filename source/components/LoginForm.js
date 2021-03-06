/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

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
      <div className="registration-login-form">
        {!isValid
        && (
          <span className="error-message">{error}</span>
        )
        }
        <form onSubmit={this.handleLogin} className="form-container">
          <label htmlFor="user-input">
            {'USERNAME:'}
            <input id="user-input" name="username" className={isValid ? '' : 'invalid'} value={username} onChange={this.loginOnChange} />
          </label>
          <label htmlFor="password-input">
            {'PASSWORD:'}
            <input id="password-input" type="password" name="password" className={isValid ? '' : 'invalid'} value={password} onChange={this.passwordOnChange} />
          </label>
          <Button
            bsStyle="success"
            className="no-border-button"
            bsSize="small"
            type="submit"
          >
          LOGIN
          </Button>
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
