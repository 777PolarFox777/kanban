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
      svgContent: null,
    };
  }

  componentDidMount() {
    this.getSvg();
  }

  getSvg = () => {
    fetch('images/help.svg')
      .then(response => response.text())
      .then(svg => this.setState({ svgContent: svg }));
  };

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
      showCreateCard, status, showTutorial, showLoginForm, svgContent,
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
            {/* eslint-disable-next-line react/no-danger */}
            <button type="button" onClick={() => this.handleToggleModal({ name: 'tutorial' })} dangerouslySetInnerHTML={{ __html: svgContent }} />
          </div>
        </div>
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
