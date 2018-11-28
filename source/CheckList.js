/**
 * Created by Andrew on 14.09.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

class CheckList extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  handleChange = (evt) => {
    this.setState({ value: evt.target.value });
  };

  checkInputKeyPress = (evt) => {
    const { cardId, taskCallbacks } = this.props;
    if (evt.key === 'Enter') {
      taskCallbacks.add(cardId, evt.target.value);
      this.setState({ value: '' });
    }
  };

  render() {
    const { cardId, taskCallbacks } = this.props;
    const { value } = this.state;
    let { tasks } = this.props;
    tasks = tasks.map((task, taskIndex) => (
      <li key={task.id} className="checklist__task">
        <label className="container" htmlFor={`checkbox${cardId}${task.id}`}>
          {task.name}
          <input
            type="checkbox"
            id={`checkbox${cardId}${task.id}`}
            defaultChecked={task.done}
            onChange={() => taskCallbacks.toggle(cardId, task.id, taskIndex)}
          />
          <span className="checkmark" />
        </label>
        <Tooltip label="Click here to remove this task!">
          <button
            type="button"
            className="checklist__task--remove cross"
            onClick={() => taskCallbacks.delete(cardId, task.id, taskIndex)}
          />
        </Tooltip>
      </li>
    ));
    return (
      <div className="checklist">
        <ul>{tasks}</ul>
        <input
          value={value}
          type="text"
          className="checklist--add-task"
          placeholder="Type then hit Enter to add a task"
          onChange={this.handleChange}
          onKeyPress={this.checkInputKeyPress}
        />
      </div>
    );
  }
}

CheckList.propTypes = {
  cardId: PropTypes.number.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  taskCallbacks: PropTypes.shape().isRequired,
};

export default CheckList;
