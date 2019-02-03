/**
 * Created by Andrew on 14.09.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Glyphicon, PageHeader, Modal,
} from 'react-bootstrap';
import { RingLoader } from 'react-spinners';
import List from './List';
import CreateCard from './CreateCard';
import Tutorial from './Tutorial';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

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
      showRegisterForm: false,
    };
  }

  handleToggleModal = (modalEv) => {
    const {
      showCreateCard, showTutorial, showLoginForm, showRegisterForm,
    } = this.state;
    if (modalEv) {
      if (modalEv.name === 'tutorial') {
        this.setState({ showTutorial: !showTutorial });
        return;
      }
      if (modalEv.name === 'login') {
        this.setState({ showLoginForm: !showLoginForm });
        return;
      }

      if (modalEv.name === 'register') {
        this.setState({ showRegisterForm: !showRegisterForm });
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
      showCreateCard,
      status,
      showTutorial,
      showLoginForm,
      showRegisterForm,
    } = this.state;

    const {
      taskCallbacks, cards, user, changeUser, isLoading,
    } = this.props;

    if (showCreateCard || showTutorial) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';

    if (isLoading) {
      return (
        <div className="global-loader">
          <RingLoader size={200} color="#2196F3" />
        </div>
      );
    }

    return (
      <div className="app">
        <div className="header">
          <PageHeader>KANBAN BOARD APPLICATION</PageHeader>
          <div className="auth">
            {user
              ? (
                <div className="user-field">
                  <span>{`Welcome, ${user}!`}</span>
                  <span>|</span>
                  <Button
                    bsStyle="warning"
                    bsSize="small"
                    className="logout-button"
                    type="button"
                    onClick={this.handleLogOut}
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="login-filed">
                  <Button
                    bsStyle="default"
                    bsSize="small"
                    type="button"
                    onClick={() => this.handleToggleModal({ name: 'login' })}
                  >
                    Log in
                  </Button>
                  <span>|</span>
                  <Button
                    bsStyle="default"
                    bsSize="small"
                    type="button"
                    onClick={() => this.handleToggleModal({ name: 'register' })}
                  >
                    Register
                  </Button>
                </div>
              )
            }
            <span>|</span>
            <Button
              bsStyle="info"
              className="no-border-button question-button"
              bsSize="small"
              type="button"
              onClick={() => this.handleToggleModal({ name: 'tutorial' })}
            >
              <Glyphicon glyph="question-sign" />
            </Button>
          </div>
        </div>
        <div className="list-container">
          <List
            toggleModal={() => this.handleToggleModal({
              status: 'todo',
              name: 'createCard',
            })}
            taskCallbacks={taskCallbacks}
            id="todo"
            title="To Do"
            cards={cards.filter(card => card.status === 'todo')}
          />
          <List
            toggleModal={() => this.handleToggleModal({
              status: 'in-progress',
              name: 'createCard',
            })}
            taskCallbacks={taskCallbacks}
            id="in-progress"
            title="In Progress"
            cards={cards.filter(card => card.status === 'in-progress')}
          />
          <List
            toggleModal={() => this.handleToggleModal({
              status: 'done',
              name: 'createCard',
            })}
            taskCallbacks={taskCallbacks}
            id="done"
            title="Done"
            cards={cards.filter(card => card.status === 'done')}
          />
        </div>

        <Modal show={showCreateCard} onHide={() => this.handleToggleModal({ status, name: 'createCard' })}>
          <Modal.Header closeButton>
            <Modal.Title>Create new card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateCard toggleModal={(title, desc) => {
              taskCallbacks.createCard(title, desc, status);
              this.handleToggleModal({ status, name: 'createCard' });
            }}
            />
          </Modal.Body>
        </Modal>

        <Modal show={showTutorial} onHide={() => this.handleToggleModal({ name: 'tutorial' })}>
          <Modal.Header closeButton>
            <Modal.Title>Create new card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tutorial toggleModal={() => this.handleToggleModal({ name: 'tutorial' })} />
          </Modal.Body>
        </Modal>

        <Modal show={showRegisterForm} onHide={() => this.handleToggleModal({ name: 'register' })}>
          <Modal.Header closeButton>
            <Modal.Title>Create new card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RegistrationForm toggleModal={() => this.handleToggleModal({ name: 'register' })} changeUser={changeUser} />
          </Modal.Body>
        </Modal>

        <Modal show={showLoginForm} onHide={() => this.handleToggleModal({ name: 'login' })}>
          <Modal.Header closeButton>
            <Modal.Title>Create new card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LoginForm toggleModal={() => this.handleToggleModal({ name: 'login' })} changeUser={changeUser} />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
KanbanBoard.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  taskCallbacks: PropTypes.shape().isRequired,
  user: PropTypes.string,
  changeUser: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

KanbanBoard.defaultProps = {
  user: undefined,
};
export default KanbanBoard;
