/**
 * Created by Andrew on 14.09.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { Transition } from 'react-transition-group';
import CheckList from './CheckList';
import Tooltip from './Tooltip';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: true,
    };
  }

  toggleDetails =() => {
    const { showDetails } = this.state;
    this.setState({ showDetails: !showDetails });
  };

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
        <div
          className={
            showDetails ? 'card__title card__title--is-open' : 'card__title'
          }
        >
          <div // eslint-disable-line jsx-a11y/interactive-supports-focus
            role="button"
            className="card_button"
            onClick={this.toggleDetails}
          />
          <div
            className="title_container"
            style={{ display: 'inline' }}
            onDoubleClick={(ev) => {
              if (ev.target.localName !== 'input') {
                const input = document.createElement('input');
                input.value = title;
                input.style.width = '150px';
                input.style.fontWeight = 'bold';
                input.style.fontSize = '18px';
                input.onblur = (evb) => {
                  const div = document.createElement('div');
                  div.innerHTML = evb.currentTarget.value;
                  div.style.width = '150px';
                  div.style.display = 'inline';
                  try {
                    evb.currentTarget.parentNode.replaceChild(div, evb.currentTarget);
                  } catch (e) {
                    console.log(e); // eslint-disable-line no-console
                  }
                };
                input.onkeypress = (evp) => {
                  if (evp.key === 'Enter') {
                    evp.preventDefault();
                    evp.currentTarget.onblur(evp);
                  }
                };
                ev.currentTarget.replaceChild(input, ev.currentTarget.children[0]);
              }
            }}
          >
            <div
              style={{ display: 'inline' }}
              className="title"
            >
              {title}
            </div>
          </div>
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
        <Transition in={showDetails} timeout={500}>
          {(state) => {
            switch (state) {
            case 'entering':
              return (
                <div className="card__details slider slider-opened">
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: marked(description) }} />
                  <CheckList cardId={id} tasks={tasks} taskCallbacks={taskCallbacks} />
                </div>
              );
            case 'entered':
              return (
                <div className="card__details slider slider-opened">
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: marked(description) }} />
                  <CheckList cardId={id} tasks={tasks} taskCallbacks={taskCallbacks} />
                </div>
              );
            case 'exiting':
              return (
                <div className="card__details slider slider-closed">
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: marked(description) }} />
                  <CheckList cardId={id} tasks={tasks} taskCallbacks={taskCallbacks} />
                </div>
              );
            case 'exited':
              return (
                <div className="card__details slider slider-closed">
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: marked(description) }} />
                  <CheckList cardId={id} tasks={tasks} taskCallbacks={taskCallbacks} />
                </div>
              );
            default:
              return null;
            }
          }}
        </Transition>
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
