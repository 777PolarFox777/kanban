/**
 * Created by Andrew on 16.09.2018.
 */
import React, { Component } from 'react';
import update from 'react-addons-update';
import KanbanBoard from './KanbanBoard';

const API_URL = 'http:\\\\localhost:3000';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'any-string-you-like', // The Authorization is not needed for local server
};

class KanbanBoardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
  }

  componentDidMount() {
    fetch(`${API_URL}/cards`, { headers: API_HEADERS })
      .then(response => response.json())
      .then((responseData) => {
        this.setState({ cards: responseData.cards });
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
      });
  }

  // eslint-disable-next-line class-methods-use-this
  fetchCards(nextState) {
    fetch(`${API_URL}/changeCards`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(nextState),
    })
      .catch((error) => {
        console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
      });
  }

  addTask(cardId, taskName) {
    const { cards } = this.state;
    // Find the index of the card
    const cardIndex = cards.findIndex(card => card.id === cardId);
    // Create a new task with the given name and a temporary ID
    const newTask = { id: Date.now(), name: taskName, done: false };
    // Create a new object and push the new task to the array of tasks
    const nextState = update(cards, {
      [cardIndex]: {
        tasks: { $push: [newTask] },
      },
    });
    // set the component state to the mutated object
    this.setState({ cards: nextState });
    // Call the API to add the task on the server
    this.fetchCards(nextState);
  }

  deleteTask(cardId, taskId, taskIndex) {
    const { cards } = this.state;
    // Find the index of the card
    const cardIndex = cards.findIndex(card => card.id === cardId);
    // Create a new object without the task
    const nextState = update(cards, {
      [cardIndex]: {
        tasks: { $splice: [[taskIndex, 1]] },
      },
    });
    // set the component state to the mutated object
    this.setState({ cards: nextState });
    // Call the API to remove the task on the server
    this.fetchCards(nextState);
  }

  toggleTask(cardId, taskId, taskIndex) {
    // Find the index of the card
    const { cards } = this.state;
    const cardIndex = cards.findIndex(card => card.id === cardId);
    // Save a reference to the task's 'done' value
    let newDoneValue;
    let status = 'todo';
    // Using the $apply command, you will change the done value to its opposite
    let nextState = update(cards, {
      [cardIndex]: {
        tasks: {
          [taskIndex]: {
            done: {
              $apply: (done) => {
                newDoneValue = !done;
                return newDoneValue;
              },
            },
          },
        },
      },
    });
    let isDone = nextState[cardIndex].tasks[0].done;
    let isInProgress = nextState[cardIndex].tasks[0].done;
    for (let i = 0; i < nextState[cardIndex].tasks.length; i += 1) {
      isDone = isDone && nextState[cardIndex].tasks[i].done;
      isInProgress = isInProgress || nextState[cardIndex].tasks[i].done;
    }
    if (isDone) status = 'done';
    else if (isInProgress) status = 'in-progress';
    nextState = update(cards, {
      [cardIndex]: {
        status: {
          $apply: () => status,
        },
        color: {
          $apply: () => {
            if (Object.is(status, 'todo')) return '#a90a00';
            if (Object.is(status, 'in-progress')) return '#BD8D31';
            if (Object.is(status, 'done')) return '#3A7E28';
            return '#FFFFFF';
          },
        },
        tasks: {
          [taskIndex]: {
            done: {
              $apply: () => newDoneValue,
            },
          },
        },
      },
    });

    // set the component state to the mutated object
    this.setState({ cards: nextState });
    // Call the API to toggle the task on the server
    this.fetchCards(nextState);
  }

  createCard(title, desc, status) {
    // Find the index of the card
    const { cards } = this.state;
    const cardId = cards.length + 1;
    let color = '#a90a00';
    if (status === 'in-progress') color = '#BD8D31';
    if (status === 'done') color = '#3A7E28';
    // Create a new task with the given name and a temporary ID
    const newCard = {
      id: cardId,
      title,
      description: desc,
      status,
      color,
      tasks: [
      ],
    };
    // Create a new object and push the new task to the array of tasks
    const nextState = update(cards, {
      $push: [newCard],
    });
    // set the component state to the mutated object
    this.setState({ cards: nextState });
    // Call the API to add the task on the server
    fetch(`${API_URL}/changeCards`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(nextState),
    })
      .catch((error) => {
        console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
      });
  }

  deleteCard(cardId) {
    const { cards } = this.state;
    // Find the index of the card
    const cardIndex = cards.findIndex(card => card.id === cardId);
    // Create a new object and push the new task to the array of tasks
    const nextState = update(cards, {
      $splice: [[cardIndex, 1]],
    });
    // set the component state to the mutated object
    this.setState({ cards: nextState });
    // Call the API to add the task on the server
    this.fetchCards(nextState);
  }

  render() {
    const { cards } = this.state;
    return (
      <KanbanBoard
        cards={cards}
        taskCallbacks={{
          toggle: (cardId, taskId, taskIndex) => this.toggleTask(cardId, taskId, taskIndex),
          delete: (cardId, taskId, taskIndex) => this.deleteTask(cardId, taskId, taskIndex),
          add: (cardId, taskName) => this.addTask(cardId, taskName),
          createCard: (title, desc, status) => this.createCard(title, desc, status),
          deleteCard: cardId => this.deleteCard(cardId),
        }}
      />
    );
  }
}

export default KanbanBoardContainer;
