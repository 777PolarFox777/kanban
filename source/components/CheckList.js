/**
 * Created by Andrew on 14.09.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PulseLoader } from 'react-spinners';
import { connect } from 'react-redux';
import {
  Button, Glyphicon, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { putTask, removeTaskFromServer, toggleTask } from '../store/kanbanBoardContainer/actions';

class CheckListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  addTask = (cardId, taskName) => {
    const { cards, user, putTask: putTaskProp } = this.props;
    const cardIndex = cards.findIndex(card => card.id === cardId);
    putTaskProp(cardIndex, cardId, taskName, cards, user);
  };

  deleteTask = (cardId, taskId, taskIndex) => {
    const { user, removeTaskFromServer: removeTaskProp } = this.props;
    removeTaskProp(taskId, taskIndex, cardId, user);
  };

  toggleTask = (cardId, taskId, taskIndex) => {
    // Find the index of the card
    const { cards, user, toggleTask: toggleTaskProp } = this.props;
    toggleTaskProp(taskId, taskIndex, cards, cardId, user);
  };

  handleChange = (evt) => {
    this.setState({ value: evt.target.value });
  };

  checkInputKeyPress = (evt) => {
    const { cardId } = this.props;
    if (evt.key === 'Enter') {
      this.addTask(cardId, evt.target.value);
      this.setState({ value: '' });
    }
  };

  render() {
    const {
      cardId, tasks: tasksProp, isLoading, componentId,
    } = this.props;
    const { value } = this.state;

    if (isLoading && cardId === componentId) {
      return (
        <div className="loader-wrapper">
          <PulseLoader size={15} margin="10px" color="#2196F3" />
        </div>
      );
    }

    const tasks = tasksProp.map((task, taskIndex) => (
      <li key={task.id} className="checklist-task">
        <label className="container" htmlFor={`checkbox${cardId}${task.id}`} onClick={() => this.toggleTask(cardId, task.id, taskIndex)}>
          <Button
            bsStyle="default"
            className={`no-border-button check-button ${task.done ? '' : 'unchecked'}`}
            bsSize="small"
            type="button"
            onClick={() => this.toggleTask(cardId, task.id, taskIndex)}
          >
            <Glyphicon glyph="ok" className="checkmark" />
          </Button>
          {task.name}
          <input />
        </label>
        <OverlayTrigger
          placement="top"
          overlay={(
            <Tooltip id={`tooltip-${cardId}${task.id}`}>
              Click here to remove this task!
            </Tooltip>
          )}
        >
          <Button
            bsStyle="danger"
            className="no-border-button checklist-task-remove"
            bsSize="small"
            type="button"
            onClick={() => this.deleteTask(cardId, task.id, taskIndex)}
          >
            <Glyphicon glyph="remove" />
          </Button>
        </OverlayTrigger>
      </li>
    ));
    return (
      <div className="checklist">
        <ul>{tasks}</ul>
        <input
          value={value}
          type="text"
          className="checklist-add-task"
          placeholder="Type then hit Enter to add a task"
          onChange={this.handleChange}
          onKeyPress={this.checkInputKeyPress}
        />
      </div>
    );
  }
}

CheckListComponent.propTypes = {
  cardId: PropTypes.number.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  putTask: PropTypes.func,
  removeTaskFromServer: PropTypes.func,
  toggleTask: PropTypes.func,
  cards: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.string,
  isLoading: PropTypes.bool,
  componentId: PropTypes.number,
};

CheckListComponent.defaultProps = {
  cards: [],
  user: '',
  putTask: null,
  removeTaskFromServer: null,
  toggleTask: null,
  isLoading: false,
  componentId: null,
};

const mapStateToProps = state => ({
  cards: state.kanbanReducer.cards,
  user: state.kanbanReducer.user,
  isLoading: state.kanbanReducer.isCardLoading,
  componentId: state.kanbanReducer.componentId,
});

const CheckList = connect(
  mapStateToProps,
  {
    putTask,
    removeTaskFromServer,
    toggleTask,
  },
)(CheckListComponent);

export default CheckList;
