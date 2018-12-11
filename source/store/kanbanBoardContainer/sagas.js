import { put, takeEvery } from 'redux-saga/effects';
import {
  addTask, deleteTask, setCards, setLoading, setUser, getTask, getNewCard, getDeletedCard,
} from './actions';

const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'any-string-you-like', // The Authorization is not needed for local server
};

function* fetchCards() {
  yield put(setLoading(true));
  try {
    const cards = yield fetch('/cards', { headers: API_HEADERS });
    const cardsData = yield cards.json();
    yield put(setCards(cardsData.cards));
    yield put(setUser(cardsData.user));
  } catch (error) {
    console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
    yield put(setCards([]));
    yield put(setUser(undefined));
  }
  yield put(setLoading(false));
}

function* putTask(actionData) {
  try {
    const {
      taskName, cardId, cardIndex, user,
    } = actionData.payload;

    yield put(setLoading(true, 'card', cardId));


    const tempTask = {
      id: 0, name: taskName, done: false,
    };
    const response = yield fetch('/addTask', {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify({ task: tempTask, cardId, user }),
    });
    const taskData = yield response.json();
    yield put(addTask(cardIndex, taskData.id, tempTask));

    yield put(setLoading(false, 'card', cardId));
  } catch (error) {
    console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
  }
}

function* removeTask(actionData) {
  try {
    const {
      taskId, taskIndex, cardId, user,
    } = actionData.payload;

    yield put(setLoading(true, 'card', cardId));

    yield fetch('/deleteTask', {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify({ taskId, user }),
    });
    yield put(deleteTask(taskId, taskIndex));

    yield put(setLoading(false, 'card', cardId));
  } catch (error) {
    console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
  }
}

function* toggleTaskSaga(actionData) {
  try {
    const {
      taskId, taskIndex, cards, cardId, user,
    } = actionData.payload;

    yield put(setLoading(true, 'card', cardId));

    const cardIndex = cards.findIndex(card => card.id === cardId);
    // Save a reference to the task's 'done' value
    const newDoneValue = !cards[cardIndex].tasks[taskIndex].done;
    let status = 'todo';
    // Using the $apply command, you will change the done value to its opposite
    const newTasks = cards[cardIndex].tasks.map((task, index) => {
      if (index === taskIndex) {
        return {
          ...task,
          done: +newDoneValue,
        };
      }
      return task;
    });

    const nextState = cards.map((card, index) => {
      if (index === cardIndex) {
        return {
          ...card,
          tasks: newTasks,
        };
      }
      return card;
    });

    let isDone = nextState[cardIndex].tasks[0].done;
    let isInProgress = nextState[cardIndex].tasks[0].done;

    nextState[cardIndex].tasks.forEach((el) => {
      isDone = isDone && el.done;
      isInProgress = isInProgress || el.done;
    });

    if (isDone) status = 'done';
    else if (isInProgress) status = 'in-progress';

    yield fetch('/toggleTask', {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify({
        taskId, newDoneValue, status, cardId, user,
      }),
    });
    yield put(getTask(taskId, newDoneValue, status, cardId));
    yield put(setLoading(false, 'card', cardId));
  } catch (error) {
    console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
  }
}

function* createCard(actionData) {
  yield put(setLoading(true));
  try {
    const {
      status, title, desc,
    } = actionData.payload;
    let color = '#a90a00';
    if (status === 'in-progress') color = '#BD8D31';
    if (status === 'done') color = '#3A7E28';

    const response = yield fetch('/createCard', {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify({
        card: {
          title,
          description: desc,
          status,
        },
      }),
    });
    const cardData = yield response.json();
    yield put(getNewCard(cardData.id, title, desc, status, color));
  } catch (error) {
    console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
  }
  yield put(setLoading(false));
}

function* deleteCard(actionData) {
  yield put(setLoading(true));
  try {
    const {
      cardId, cards,
    } = actionData.payload;

    const cardIndex = cards.findIndex(card => card.id === cardId);

    yield fetch('/deleteCard', {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify({ cardId }),
    });
    yield put(getDeletedCard(cardIndex));
  } catch (error) {
    console.log('Error fetching and parsing data', error); // eslint-disable-line no-console
  }
  yield put(setLoading(false));
}

export default function* kanbanSaga() {
  yield takeEvery('GET_CARDS', fetchCards);
  yield takeEvery('PUT_TASK', putTask);
  yield takeEvery('REMOVE_TASK_FROM_SERVER', removeTask);
  yield takeEvery('TOGGLE_TASK', toggleTaskSaga);
  yield takeEvery('CREATE_CARD', createCard);
  yield takeEvery('DELETE_CARD', deleteCard);
}
