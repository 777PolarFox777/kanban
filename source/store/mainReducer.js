import { combineReducers } from 'redux';
import kanbanReducer from './kanbanBoardContainer/reducers';

const rootReducer = combineReducers({
  kanbanReducer,
});

export default rootReducer;
