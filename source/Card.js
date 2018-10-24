/**
 * Created by Andrew on 14.09.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import CheckList from './CheckList';
import Tooltip from './Tooltip';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: true,
    };
  }

  toggleDetails() {
    const { showDetails } = this.state;
    this.setState({ showDetails: !showDetails });
  }

  render() {
    const { showDetails } = this.state;
    const {
      description,
      id,
      tasks,
      taskCallbacks,
      color,
      title,
    } = this.props;
    let cardDetails;
    if (showDetails) {
      cardDetails = (
        <div className="card__details">
          {/* eslint-disable-next-line react/no-danger */}
          <span dangerouslySetInnerHTML={{ __html: marked(description) }} />
          <CheckList cardId={id} tasks={tasks} taskCallbacks={taskCallbacks} />
        </div>
      );
    }
    const sideColor = {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: 0,
      width: 7,
      backgroundColor: color,
    };

    return (
      <div className="card">
        <div style={sideColor} />
        <div // eslint-disable-line jsx-a11y/interactive-supports-focus
          role="button"
          className={
            showDetails ? 'card__title card__title--is-open' : 'card__title'
          }
          onClick={this.toggleDetails.bind(this)}
        >
          {title}
          {showDetails ? (
            <Tooltip label="Click here to delete this card!">
              <button
                type="button"
                className="cross"
                onClick={(ev) => {
                  ev.preventDefault();
                  taskCallbacks.deleteCard(id);
                }}
              />
            </Tooltip>
          )
            : (
              <button
                type="button"
                className="cross"
                onClick={(ev) => {
                  ev.preventDefault();
                  taskCallbacks.deleteCard(id);
                }}
              />
            )
          }
        </div>
        {cardDetails}
      </div>
    );
  }
}

Card.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  taskCallbacks: PropTypes.shape().isRequired,
};

export default Card;
