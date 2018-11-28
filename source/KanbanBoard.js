/**
 * Created by Andrew on 14.09.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from './List';
import Modal from './Modal';
import CreateCard from './CreateCard';
import Tutorial from './Tutorial';
import LoginForm from './LoginForm';

const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'any-string-you-like',
};

class KanbanBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateCard: false,
      status: '',
      showTutorial: false,
      showLoginForm: false,
    };
  }

  handleToggleModal = (modalEv) => {
    const { showCreateCard, showTutorial, showLoginForm } = this.state;
    if (modalEv) {
      if (modalEv.name === 'tutorial') {
        this.setState({ showTutorial: !showTutorial });
        return;
      }
      if (modalEv.name === 'login') {
        this.setState({ showLoginForm: !showLoginForm });
        return;
      }

      if (modalEv.name === 'createCard') {
        this.setState({ status: modalEv.status, showCreateCard: !showCreateCard });
      }
    }
  };

  handleLogOut = () => {
    const { changeUser } = this.props;
    fetch('/logout', { headers: API_HEADERS })
      .then(() => {
        changeUser();
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
      });
  };

  render() {
    const {
      showCreateCard, status, showTutorial, showLoginForm,
    } = this.state;
    const {
      taskCallbacks, cards, user, changeUser,
    } = this.props;
    if (showCreateCard || showTutorial) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return (
      <div className="app">
        <div className="header">
          <h1>KANBAN BOARD APPLICATION</h1>
          <div className="auth">
            {user
              ? (
                <div className="user-field">
                  <span>{`Welcome, ${user}!`}</span>
                  <span>|</span>
                  <button type="button" onClick={this.handleLogOut}>Log out</button>
                </div>
              ) : (
                <div className="login-filed">
                  <button type="button" onClick={() => this.handleToggleModal({ name: 'login' })}>Log in</button>
                  <span>|</span>
                  <button type="button">Register</button>
                </div>
              )
            }
            <span>|</span>
            <button type="button" onClick={() => this.handleToggleModal({ name: 'tutorial' })}>
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="20px"
                height="20px"
                viewBox="0 0 400 400"
                style={{ enableBackground: 'new 0 0 400 400' }}
                xmlSpace="preserve"
              >
                <g>
                  <g>
                    <path d="M199.996,0C89.719,0,0,89.72,0,200c0,110.279,89.719,200,199.996,200C310.281,400,400,310.279,400,200
                    C400,89.72,310.281,0,199.996,0z M199.996,373.77C104.187,373.77,26.23,295.816,26.23,200
                    c0-95.817,77.957-173.769,173.766-173.769c95.816,0,173.772,77.953,173.772,173.769
                    C373.769,295.816,295.812,373.77,199.996,373.77z"
                    />
                    <path d="M199.996,91.382c-35.176,0-63.789,28.616-63.789,63.793c0,7.243,5.871,13.115,13.113,13.115
                    c7.246,0,13.117-5.873,13.117-13.115c0-20.71,16.848-37.562,37.559-37.562c20.719,0,37.566,16.852,37.566,37.562
                    c0,20.714-16.849,37.566-37.566,37.566c-7.242,0-13.113,5.873-13.113,13.114v45.684c0,7.243,5.871,13.115,13.113,13.115
                    s13.117-5.872,13.117-13.115v-33.938c28.905-6.064,50.68-31.746,50.68-62.427C263.793,119.998,235.176,91.382,199.996,91.382z"
                    />
                    <path d="M200.004,273.738c-9.086,0-16.465,7.371-16.465,16.462s7.379,16.465,16.465,16.465c9.094,0,16.457-7.374,16.457-16.465
                    S209.098,273.738,200.004,273.738z"
                    />
                  </g>
                </g>
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
                <g />
              </svg>
            </button>
          </div>
        </div>
        <List toggleModal={() => this.handleToggleModal({ status: 'todo' })} taskCallbacks={taskCallbacks} id="todo" title="To Do" cards={cards.filter(card => card.status === 'todo')} />
        <List toggleModal={() => this.handleToggleModal({ status: 'in-progress' })} taskCallbacks={taskCallbacks} id="in-progress" title="In Progress" cards={cards.filter(card => card.status === 'in-progress')} />
        <List toggleModal={() => this.handleToggleModal({ status: 'done' })} taskCallbacks={taskCallbacks} id="done" title="Done" cards={cards.filter(card => card.status === 'done')} />
        {showCreateCard
                && (
                  <Modal onCloseRequest={() => this.handleToggleModal({ status, name: 'createCard' })}>
                    <CreateCard toggleModal={(title, desc) => {
                      taskCallbacks.createCard(title, desc, status);
                      this.handleToggleModal({ status, name: 'createCard' });
                    }}
                    />
                  </Modal>
                )
        }
        {showTutorial
        && (
          <Modal onCloseRequest={() => this.handleToggleModal({ name: 'tutorial' })}>
            <Tutorial toggleModal={() => this.handleToggleModal({ name: 'tutorial' })} />
          </Modal>
        )
        }
        {showLoginForm
        && (
          <Modal onCloseRequest={() => this.handleToggleModal({ name: 'login' })}>
            <LoginForm toggleModal={() => this.handleToggleModal({ name: 'login' })} changeUser={changeUser} />
          </Modal>
        )
        }
      </div>
    );
  }
}
KanbanBoard.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  taskCallbacks: PropTypes.shape().isRequired,
  user: PropTypes.string,
  changeUser: PropTypes.func.isRequired,
};

KanbanBoard.defaultProps = {
  user: undefined,
};
export default KanbanBoard;
