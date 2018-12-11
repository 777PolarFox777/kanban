export const getCards = () => ({
  type: 'GET_CARDS',
});

export const getUser = () => ({
  type: 'GET_USER',
});

export const setCards = cards => ({
  type: 'SET_CARDS',
  payload: {
    cards,
  },
});

export const setUser = user => ({
  type: 'SET_USER',
  payload: {
    user,
  },
});

export const putTask = (cardIndex, cardId, taskName, cards, user) => ({
  type: 'PUT_TASK',
  payload: {
    cardIndex,
    cardId,
    taskName,
    cards,
    user,
  },
});

export const addTask = (cardIndex, taskId, task) => ({
  type: 'ADD_TASK',
  payload: {
    cardIndex,
    taskId,
    task,
  },
});

export const removeTaskFromServer = (taskId, taskIndex, cardId, user) => ({
  type: 'REMOVE_TASK_FROM_SERVER',
  payload: {
    taskId,
    taskIndex,
    cardId,
    user,
  },
});

export const deleteTask = (taskId, taskIndex) => ({
  type: 'DELETE_TASK',
  payload: {
    taskId,
    taskIndex,
  },
});

export const toggleTask = (taskId, taskIndex, cards, cardId, user) => ({
  type: 'TOGGLE_TASK',
  payload: {
    cardId,
    taskId,
    taskIndex,
    cards,
    user,
  },
});

export const getTask = (taskId, newDoneValue, status, cardId) => ({
  type: 'GET_TASK',
  payload: {
    taskId,
    newDoneValue,
    status,
    cardId,
  },
});

export const setLoading = (value, component, id) => {
  switch (component) {
  case 'card':
    return ({
      type: 'SET_LOADING',
      payload: {
        isCardLoading: value,
        componentId: id,
      },
    });

  default: return ({
    type: 'SET_LOADING',
    payload: {
      isLoading: value,
    },
  });
  }
};

export const createCard = (status, title, desc) => ({
  type: 'CREATE_CARD',
  payload: {
    status,
    title,
    desc,
  },
});

export const getNewCard = (cardId, title, desc, status, color) => ({
  type: 'GET_NEW_CARD',
  payload: {
    id: cardId,
    title,
    description: desc,
    status,
    color,
  },
});

export const deleteCard = (cardId, cards) => ({
  type: 'DELETE_CARD',
  payload: {
    cardId,
    cards,
  },
});

export const getDeletedCard = cardIndex => ({
  type: 'GET_DELETED_CARD',
  payload: {
    cardIndex,
  },
});
