/**
 * Created by Andrew on 16.09.2018.
 */
import React, { Component } from 'react';
import update from 'react-addons-update';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';

const API_URL = '/cardsList';
const API_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: 'any-string-you-like',// The Authorization is not needed for local server
    "Access-Control-Allow-Origin": "*"
};
class KanbanBoardContainer extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            cards:[],
        };
    }


    componentDidMount() {
        fetch(API_URL, {headers: API_HEADERS})
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({cards: responseData});
            })
            .catch((error) => {
                console.log('Error fetching and parsing data', error);
            });
    }

    addTask(cardId, taskName) {
        let prevState = this.state;
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        // Create a new task with the given name and a temporary ID
        let newTask = {id: Date.now(), name: taskName, done: false};
        // Create a new object and push the new task to the array of tasks
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$push: [newTask]}
            }
        });
        // set the component state to the mutated object
        this.setState({cards: nextState});
        // Call the API to add the task on the server
        fetch(`${API_URL}/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(newTask)
        })
            .then((response) => response.json())
            .then((responseData) => {
                // When the server returns the definitive ID
                // used for the new Task on the server, update it on React
                newTask.id = responseData.id;
                this.setState({cards: nextState});
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Server response wasn't OK");
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                this.setState(prevState);
            });


    }

    deleteTask(cardId, taskId, taskIndex) {
        let prevState = this.state;
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        // Create a new object without the task
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$splice: [[taskIndex,1]] }
            }
        });
        // set the component state to the mutated object
        this.setState({cards:nextState});
        // Call the API to remove the task on the server
        fetch(API_URL, {
            method: 'delete',
            headers: API_HEADERS
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Server response wasn't OK");
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                this.setState(prevState);
            });

    }

    toggleTask(cardId, taskId, taskIndex) {
        let prevState = this.state;
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        // Save a reference to the task's 'done' value
        let newDoneValue;
        // Using the $apply command, you will change the done value to its opposite
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    [taskIndex]: {
                        done: {
                            $apply: (done) => {
                                newDoneValue = !done;
                                return newDoneValue;
                            }
                        }
                    }
                }
            }
        });
        // set the component state to the mutated object
        this.setState({cards: nextState});
        // Call the API to toggle the task on the server
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({done: newDoneValue})
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Server response wasn't OK");
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                this.setState(prevState);
            });

    }

    render() {
        return <KanbanBoard cards={this.state.cards}
                            taskCallbacks={{
                                toggle: this.toggleTask.bind(this),
                                delete: this.deleteTask.bind(this),
                                add: this.addTask.bind(this)
                            }}/>
    }
}
export default KanbanBoardContainer;