/**
 * Created by Andrew on 16.10.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  handleChange(ev) {
    const { name } = ev.target;
    this.setState({
      [name]: ev.target.value,
    });
  }

  handleButton(ev) {
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
  }

  render() {
    const { isValid, titleIn, descIn } = this.state;
    return (
      <div className="create-card">
        {!isValid && <div style={{ margin: `${0} auto`, color: 'red', width: `${200}px` }}>INCORECT DATA</div>}
        <label className="create-label" htmlFor="title-input">
          <h1>Input card title</h1>
          <br />
          <input className={`create-input ${isValid ? '' : 'invalid'}`} name="titleIn" id="title-input" value={titleIn} onChange={this.handleChange} />
        </label>

        <label className="create-label" htmlFor="description-input">
          <h1>Input card description</h1>
          <br />
          <input className={`create-input ${isValid ? '' : 'invalid'}`} name="descIn" id="description-input" value={descIn} onChange={this.handleChange} />
        </label>

        <button onClick={this.handleButton} className="create-submit" type="button">CREATE</button>
      </div>
    );
  }
}

CreateCard.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};

export default CreateCard;
