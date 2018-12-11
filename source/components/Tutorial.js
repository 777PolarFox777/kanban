/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  render() {
    const { toggleModal } = this.props;
    const { step } = this.state;
    return (
      <div className="intro">
        {step === 0
        && (
          <div className="step-0">
            <h1>WELCOME TO KANBAN BOARD!</h1>
            <p>This app was created to help you in organization your work!</p>
            <p>It allows you to planing and tracking your tasks</p>
            <p>App was created by Andrew D.</p>
            <p>Would you like to pass a tutorial?</p>
            <div className="button-container">
              <button type="button" className="button tutorial" onClick={this.nextStep}>Yep</button>
              <button type="button" className="button" onClick={toggleModal}>Not this time</button>
            </div>
          </div>
        )
        }
        {step === 1
        && (
          <div className="step-1">
            <h1>About structure!</h1>
            <p>
              {'You can see there are three columns: "To Do", "In Progress" and "Done"'}
            </p>
            <p>
              {'Each column contents cards with title, description and task.'}
            </p>
            <p>
              {'Cards with unfulfilled tasks are placed in first column.'}
            </p>
            <img src="/images/todo.png" alt="todo" />
            <p>
              {'Cards with started tasks are placed in second column.'}
            </p>
            <img src="/images/inprogress.png" alt="in progress" />
            <p>
              {'And cards with finished tasks are placed in last column.'}
            </p>
            <img src="/images/done.png" alt="done" />
            <button type="button" className="button tutorial" onClick={this.nextStep}>I understand</button>
          </div>
        )
        }
        {step === 2
          && (
            <div className="step-2">
              <h1>How to add new card!</h1>
              <p>
                {'Each column has a "plus" button'}
              </p>
              <img src="/images/plus.png" alt="plus" />
              <p>
                {'You can click this button to add new card to this columns.'}
              </p>
              <p>
                {'In modal window you will need to input card title and description.'}
              </p>
              <img src="/images/modal.png" alt="modal" />
              <p>
                {'After that, click Create button to add new card.'}
              </p>
              <button type="button" className="button tutorial" onClick={this.nextStep}>I understand</button>
            </div>
          )
        }
        {step === 3
          && (
            <div className="step-3">
              <h1>Few words about cards!</h1>
              <p>
                {'Each card has a title, description and task list'}
              </p>
              <p>
                {'You are able to delete card by clicking red cross button near to card title.'}
              </p>
              <img src="/images/redcross.png" alt="redcross" />
              <p>
                {'You also can delete any task by clicking red cross button near to that task.'}
              </p>
              <p>
                {'To add new task just put task name to input at the bottom of a card and press Enter.'}
              </p>
              <img src="/images/input.png" alt="input" />
              <button type="button" className="button tutorial" onClick={this.nextStep}>I understand</button>
            </div>
          )
        }
        {step === 4
          && (
            <div className="step-4">
              <h1>Congrats!</h1>
              <p>
                {'That was all!'}
              </p>
              <p>
                {'Now you should try it yourself!'}
              </p>
              <button type="button" className="button tutorial" onClick={toggleModal}>{'Let\'s go!'}</button>
            </div>
          )
        }
      </div>
    );
  }
}

Tutorial.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};


export default Tutorial;
