/**
 * Created by Andrew on 14.09.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { Transition } from 'react-transition-group';
import {
  Button, Glyphicon, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import CheckList from './CheckList';

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
      left: -7,
      width: 7,
      backgroundColor: color,
      borderRadius: '5px 0 0 5px',
    };

    const tooltip = (
      <Tooltip id="tooltip">
      Click here to delete this card!
      </Tooltip>
    );

    return (
      <div className="card">
        <div style={sideColor} />
        <div
          className={
            showDetails ? 'card-title card-title-is-open' : 'card-title'
          }
        >
          <Button
            role="button"
            className="card-button"
            onClick={this.toggleDetails}
          >
            <Glyphicon glyph={showDetails ? 'triangle-bottom' : 'triangle-right'} />
          </Button>
          <div
            className="title-container"
            onDoubleClick={(ev) => {
              if (ev.target.localName !== 'input') {
                const input = document.createElement('input');
                input.value = title;
                input.onblur = (evb) => {
                  const div = document.createElement('div');
                  div.innerHTML = evb.currentTarget.value;
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
            <h3
              className="title"
            >
              {title}
            </h3>
          </div>
          <OverlayTrigger placement="top" overlay={tooltip}>
            <Button
              bsStyle="danger"
              className="no-border-button"
              bsSize="small"
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                taskCallbacks.deleteCard(id);
              }}
            >
              <Glyphicon glyph="remove" />
            </Button>
          </OverlayTrigger>
        </div>
        <Transition in={showDetails} timeout={500}>
          {(state) => {
            switch (state) {
            case 'entering':
              return (
                <div className="card-details slider slider-opened">
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: marked(description) }} />
                  <CheckList cardId={id} tasks={tasks} taskCallbacks={taskCallbacks} />
                </div>
              );
            case 'entered':
              return (
                <div className="card-details slider slider-opened">
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: marked(description) }} />
                  <CheckList cardId={id} tasks={tasks} taskCallbacks={taskCallbacks} />
                </div>
              );
            case 'exiting':
              return (
                <div className="card-details slider slider-closed">
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: marked(description) }} />
                  <CheckList cardId={id} tasks={tasks} taskCallbacks={taskCallbacks} />
                </div>
              );
            case 'exited':
              return (
                <div className="card-details slider slider-closed">
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
