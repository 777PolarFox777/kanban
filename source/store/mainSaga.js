import kanbanSaga from './kanbanBoardContainer/sagas';


function* mainSaga() {
  yield kanbanSaga();
}

export default mainSaga;
