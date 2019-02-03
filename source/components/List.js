/**
 * Created by Andrew on 14.09.2018.
 */
import React from 'react';
import {
  Button, Glyphicon, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Card from './Card';

const List = (props) => {
  const { taskCallbacks, title, toggleModal } = props;
  let { cards } = props;
  let color = '#a90a00';
  cards = cards.map((card) => {
    if (card.status === 'in-progress') color = '#BD8D31';
    if (card.status === 'done') color = '#3A7E28';
    return (
      <Card
        key={card.id}
        id={card.id}
        title={card.title}
        color={color}
        description={card.description}
        tasks={card.tasks}
        taskCallbacks={taskCallbacks}
      />);
  });

  const tooltip = (
    <Tooltip id="tooltip">
      Click here to create new card!
    </Tooltip>
  );

  return (
    <div className="list">
      <div className="list-title">
        <h1>{title}</h1>
        <div className="list-add-button">
          <OverlayTrigger placement="top" overlay={tooltip}>
            <Button
              bsStyle="success"
              className="no-border-button"
              bsSize="small"
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                toggleModal();
              }}
            >
              <Glyphicon glyph="plus" />
            </Button>
          </OverlayTrigger>
        </div>
      </div>
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
