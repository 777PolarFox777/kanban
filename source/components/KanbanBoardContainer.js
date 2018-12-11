/**
 * Created by Andrew on 16.09.2018.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import KanbanBoard from './KanbanBoard';
import {
  createCard, deleteCard,
  getCards, getUser, setLoading,
} from '../store/kanbanBoardContainer/actions';

class KanbanBoardContainerComponent extends Component {
  componentDidMount() {
    this.props.getCards(); // eslint-disable-line react/destructuring-assignment
  }

  createCard = (title, desc, status) => {
    // Find the index of the card
    const { createCard: createCardProp } = this.props;
    createCardProp(status, title, desc);
  };

  deleteCard = (cardId) => {
    const { cards, deleteCard: deleteCardProp } = this.props;

    deleteCardProp(cardId, cards);
  };

  changeUser = () => {

  };

  render() {
    const { cards, user, isLoading } = this.props;
    return (
      <KanbanBoard
        cards={cards}
        taskCallbacks={{
          toggle: this.toggleTask,
          delete: this.deleteTask,
          add: this.addTask,
          createCard: this.createCard,
          deleteCard: this.deleteCard,
        }}
        user={user}
        changeUser={this.changeUser}
        isLoading={isLoading}
      />
    );
  }
}

const mapStateToProps = state => ({
  cards: state.kanbanReducer.cards,
  user: state.kanbanReducer.user,
  isLoading: state.kanbanReducer.isLoading,
});

const KanbanBoardContainer = connect(
  mapStateToProps,
  {
    getCards,
    getUser,
    setLoading,
    createCard,
    deleteCard,
  },
)(KanbanBoardContainerComponent);

export default KanbanBoardContainer;

KanbanBoardContainerComponent.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.string,
  getCards: PropTypes.func,
  createCard: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  deleteCard: PropTypes.func,
};

KanbanBoardContainerComponent.defaultProps = {
  cards: [],
  user: '',
  getCards: null,
  createCard: null,
  deleteCard: null,
};
