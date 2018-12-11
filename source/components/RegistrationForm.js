/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'any-string-you-like',
};

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      username: '',
      password: '',
      confirmPassword: '',
      error: '',
    };
  }

  loginOnChange = (ev) => {
    this.setState({ username: ev.target.value });
  };

  passwordOnChange = (ev) => {
    this.setState({ password: ev.target.value });
  };

  confirmPasswordOnChange = (ev) => {
    this.setState({ confirmPassword: ev.target.value });
  };

  handleRegister = (ev) => {
    ev.preventDefault();
    const { username, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords does\'t match!', isValid: false });
      return;
    }

    if (password.length <= 4) {
      this.setState({ error: 'Password length must be more than 4!', isValid: false });
      return;
    }

    fetch('/register', {
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
          return null;
        }
        return fetch('/login', {
          method: 'post',
          headers: API_HEADERS,
          body: JSON.stringify({ username, password }),
        });
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
      isValid, username, password, confirmPassword, error,
    } = this.state;
    return (
      <div className="registration-login-form">
        {!isValid
        && (
          <span className="error-message">{error}</span>
        )
        }
        <form onSubmit={this.handleRegister} className="form-container registration">
          <label htmlFor="user-input">
            {'USERNAME:'}
            <input id="user-input" name="username" className={isValid ? '' : 'invalid'} placeholder="Type login here" value={username} onChange={this.loginOnChange} />
          </label>
          <label htmlFor="password-input">
            {'PASSWORD:'}
            <input id="password-input" type="password" name="password" className={isValid ? '' : 'invalid'} value={password} onChange={this.passwordOnChange} />
          </label>
          <label htmlFor="confirm-password-input">
            {'CONFIRM PASSWORD:'}
            <input id="confirm-password-input" type="password" name="confirm-password" className={isValid ? '' : 'invalid'} value={confirmPassword} onChange={this.confirmPasswordOnChange} />
          </label>
          <input type="submit" value="REGISTER" />
        </form>
      </div>
    );
  }
}

RegistrationForm.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  changeUser: PropTypes.func.isRequired,
};


export default RegistrationForm;
