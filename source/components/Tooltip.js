import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      timer: null,
    };
  }

  componentWillUnmount() {
    const { timer } = this.state;
    clearTimeout(timer);
  }

  handleMouseEnter = () => {
    const { delayTime } = this.props;
    this.setState({
      timer: setTimeout(() => {
        this.setState({
          isVisible: true,
        });
      }, delayTime),
    });
  };

  handleMouseLeave = () => {
    const { timer } = this.state;
    clearTimeout(timer);
    this.setState({
      isVisible: false,
    });
  };

  render() {
    let { isVisible } = this.state;
    const { label, children } = this.props;
    isVisible = isVisible ? ' is-visible' : ' is-hidden';
    const className = `tooltip ${isVisible}`;

    return (
      <div
        className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <span className="tooltip-label">{label}</span>
        {children}
      </div>
    );
  }
}

Tooltip.defaultProps = {
  delayTime: 1500,
};

Tooltip.propTypes = {
  label: PropTypes.string.isRequired,
  delayTime: PropTypes.number,
  children: PropTypes.shape().isRequired,
};

export default Tooltip;
