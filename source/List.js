/**
 * Created by Andrew on 14.09.2018.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import Tooltip from './Tooltip';

const List = (props) => {
  const { taskCallbacks, title, toggleModal } = props;
  let { cards } = props;
  cards = cards.map(card => (
    <Card
      key={card.id}
      id={card.id}
      title={card.title}
      color={card.color}
      description={card.description}
      tasks={card.tasks}
      taskCallbacks={taskCallbacks}
    />
  ));
  return (
    <div className="list">
      <h1 style={{ width: `${150}px`, display: 'inline-block' }}>{title}</h1>
      <Tooltip label="Click here to create new card!">
        <button
          type="button"
          className="plus"
          onClick={(ev) => {
            ev.preventDefault();
            toggleModal();
          }}
        />
      </Tooltip>
      {cards}
    </div>
  );
};

List.propTypes = {
  title: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  taskCallbacks: PropTypes.shape().isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default List;
