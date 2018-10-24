/**
 * Created by Andrew on 14.09.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from './List';
import Modal from './Modal';
import CreateCard from './CreateCard';

class KanbanBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      status: '',
    };
  }

  handleToggleModal(statusEv) {
    const { showModal } = this.state;
    if (statusEv) {
      this.setState({ status: statusEv.status });
    }
    this.setState({
      showModal: !showModal,
    });
  }

  render() {
    const { showModal, status } = this.state;
    const { taskCallbacks, cards } = this.props;
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return (
      <div className="app">
        <List toggleModal={() => this.handleToggleModal({ status: 'todo' })} taskCallbacks={taskCallbacks} id="todo" title="To Do" cards={cards.filter(card => card.status === 'todo')} />
        <List toggleModal={() => this.handleToggleModal({ status: 'in-progress' })} taskCallbacks={taskCallbacks} id="in-progress" title="In Progress" cards={cards.filter(card => card.status === 'in-progress')} />
        <List toggleModal={() => this.handleToggleModal({ status: 'done' })} taskCallbacks={taskCallbacks} id="done" title="Done" cards={cards.filter(card => card.status === 'done')} />
        {showModal
                && (
                  <Modal onCloseRequest={() => this.handleToggleModal()}>
                    <CreateCard toggleModal={(title, desc) => {
                      taskCallbacks.createCard(title, desc, status);
                      this.handleToggleModal();
                    }}
                    />
                  </Modal>
                )}
      </div>
    );
  }
}
KanbanBoard.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  taskCallbacks: PropTypes.shape().isRequired,
};
export default KanbanBoard;
