import { initialState } from '../initStore';


const kanbanReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
  case 'GET_CARDS': {
    return state;
  }

  case 'SET_CARDS': {
    const { cards } = action.payload;
    return {
      ...state,
      cards,
    };
  }

  case 'GET_USER': {
    return state;
  }

  case 'SET_USER': {
    const { user } = action.payload;
    return {
      ...state,
      user,
    };
  }

  case 'PUT_TASK': {
    return state;
  }

  case 'ADD_TASK': {
    const { cardIndex, taskId, task } = action.payload;
    const newCards = state.cards.map((el, index) => {
      if (index === cardIndex) {
        return {
          ...el,
          tasks: [
            ...el.tasks,
            {
              id: taskId,
              name: task.name,
              done: +task.done,
              card_id: el.id,
            },
          ],
        };
      }
      return el;
    });
    return {
      ...state,
      cards: newCards,
    };
  }

  case 'REMOVE_TASK_FROM_SERVER': {
    return state;
  }

  case 'DELETE_TASK': {
    const { taskId, taskIndex } = action.payload;
    const newCards = state.cards.map((el) => {
      el.tasks.forEach((task) => {
        if (task.id === taskId) el.tasks.splice(taskIndex, 1);
      });
      return el;
    });
    return {
      ...state,
      cards: newCards,
    };
  }

  case 'TOGGLE_TASK': {
    return state;
  }

  case 'GET_TASK': {
    const {
      taskId, newDoneValue, status, cardId,
    } = action.payload;
    const cardIndex = state.cards.findIndex(card => card.id === cardId);
    const newTasks = state.cards[cardIndex].tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          done: +newDoneValue,
        };
      }
      return task;
    });
    const newCards = state.cards.map((card) => {
      if (card.id === cardId) {
        return {
          ...card,
          status,
          tasks: newTasks,
        };
      }
      return card;
    });
    return {
      ...state,
      cards: newCards,
    };
  }

  case 'SET_LOADING': {
    if (action.payload.componentId) {
      return {
        ...state,
        isCardLoading: action.payload.isCardLoading,
        componentId: action.payload.componentId,
      };
    }
    return {
      ...state,
      isLoading: action.payload.isLoading,
    };
  }

  case 'CREATE_CARD': {
    return state;
  }

  case 'GET_NEW_CARD': {
    const {
      id, title, description, status, color,
    } = action.payload;
    const newCards = state.cards;
    newCards.push({
      id,
      title,
      description,
      status,
      color,
      tasks: [],
    });
    return {
      ...state,
      cards: newCards,
    };
  }

  case 'DELETE_CARD': {
    return state;
  }

  case 'GET_DELETED_CARD': {
    const { cardIndex } = action.payload;

    const newCards = state.cards;
    newCards.splice(cardIndex, 1);
    return {
      ...state,
      cards: newCards,
    };
  }

  default: {
    return {
      cards: [],
      user: '',
      isLoading: true,
    };
  }
  }
};

export default kanbanReducer;
