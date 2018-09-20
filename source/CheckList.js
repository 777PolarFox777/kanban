/**
 * Created by Andrew on 14.09.2018.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
class CheckList extends Component {
    checkInputKeyPress(evt){
        if(evt.key === 'Enter'){
            this.props.taskCallbacks.add(this.props.cardId, evt.target.value);
            evt.target.value = '';
        }
    }
    render() {
        let tasks = this.props.tasks.map((task, taskIndex) => (
            <li key={task.id} className="checklist__task">
                <label class="container" for={"checkbox"+this.props.cardId+task.id}>
                    {task.name}
                    <input type="checkbox"
                           id={"checkbox"+this.props.cardId+task.id}
                           defaultChecked={task.done}
                           onChange={this.props.taskCallbacks.toggle.bind(null, this.props.cardId, task.id, taskIndex)}
                    />
                    <span class="checkmark"></span>
                </label>
                <a href="#"
                   className="checklist__task--remove cross"
                   onClick={
                       this.props.taskCallbacks.delete.bind(null, this.props.cardId, task.id, taskIndex)
                   }
                />
            </li>
        ));
        return (
            <div className="checklist">
                <ul>{tasks}</ul>
                <input type="text"
                       className="checklist--add-task"
                       placeholder="Type then hit Enter to add a task"
                       onKeyPress={this.checkInputKeyPress.bind(this)}
                />
            </div>
        );
    }
}
CheckList.propTypes = {
    cardId: PropTypes.number,
    tasks: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object
};
export default CheckList;