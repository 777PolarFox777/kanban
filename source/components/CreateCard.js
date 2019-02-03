/**
 * Created by Andrew on 16.10.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

class CreateCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      titleIn: '',
      descIn: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }

  handleChange = (ev) => {
    const { name } = ev.target;
    this.setState({
      [name]: ev.target.value,
    });
  };

  handleButton = (ev) => {
    const { titleIn, descIn } = this.state;
    const { toggleModal } = this.props;
    ev.preventDefault();
    if (titleIn && descIn) {
      this.setState({ isValid: true });
      toggleModal(titleIn, descIn);
    } else {
      this.setState({ isValid: false });
      this.forceUpdate();
    }
  };

  render() {
    const { isValid, titleIn, descIn } = this.state;
    return (
      <div className="create-card">
        {!isValid && <div>INCORECT DATA</div>}
        <label className="create-label" htmlFor="title-input">
          <h4>Input card title</h4>
          <input
            className={`create-input ${isValid ? '' : 'invalid'}`}
            name="titleIn"
            id="title-input"
            value={titleIn}
            onChange={this.handleChange}
            placeholder="Type card title here"
          />
        </label>

        <label className="create-label" htmlFor="description-input">
          <h4>Input card description</h4>
          <input
            className={`create-input ${isValid ? '' : 'invalid'}`}
            name="descIn"
            id="description-input"
            value={descIn}
            onChange={this.handleChange}
            placeholder="Type card description here"
          />
        </label>

        <Button
          bsStyle="primary"
          bsSize="small"
          onClick={this.handleButton}
          className="create-submit"
          type="button"
        >
        CREATE
        </Button>
      </div>
    );
  }
}

CreateCard.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};

export default CreateCard;
