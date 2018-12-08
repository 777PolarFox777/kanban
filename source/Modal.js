/**
 * Created by Andrew on 16.10.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Declaration of the component as React Class Component
class Modal extends Component {
  // Init of the component before it is mounted.
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  // Add listeners immediately after the component is mounted.
  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp, false);
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  // Remove listeners immediately before a component is unmounted and destroyed.
  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp, false);
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  // Handle the key press event.
  handleKeyUp = (e) => {
    const { onCloseRequest } = this.props;
    const keys = {
      27: () => {
        e.preventDefault();
        onCloseRequest();
        window.removeEventListener('keyup', this.handleKeyUp, false);
      },
    };

    if (keys[e.keyCode]) { keys[e.keyCode](); }
  };

  // Handle the mouse click on browser window.
  handleOutsideClick = (e) => {
    // need this to prevent closing modal if tutorial button was clicked
    if (e.target.classList.contains('tutorial')) return;
    const { onCloseRequest } = this.props;

    if (this.modal !== undefined && this.modal !== null) {
      if (!this.modal.contains(e.target)) {
        onCloseRequest();
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
    }
  };

  // Render the component passing onCloseRequest and children as props.
  render() {
    const {
      onCloseRequest,
      children,
    } = this.props;

    return (
      <div className="modal-overlay">
        <div
          className="modal"
          ref={(node) => {
            this.modal = node;
          }}
        >
          <div className="modal-content">
            {children}
          </div>
        </div>

        <div className="close-button">
          <button
            type="button"
            className="close-cross"
            onClick={(ev) => {
              ev.preventDefault();
              onCloseRequest();
            }}
          />
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onCloseRequest: PropTypes.func.isRequired,
  children: PropTypes.shape().isRequired,
};

export default Modal;
