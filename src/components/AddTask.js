import React, { useContext, useState, useEffect } from 'react'; 
import taskContext from '../context/tasks/taskContext';


export const AddTask = (props) => {

    const context = useContext(taskContext);
    const {addTask, fetchAllUsers, users} = context;

    const [task,setTask] = useState({title:"",description:"",tag:"",duedate:"",assignedUsers: []})

    useEffect(() => {
        fetchAllUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    const handleClick = async (e) => {
        e.preventDefault();

        if (task.assignedUsers.length === 0) {
            props.showAlert('Add a user before adding the task', 'error');
            return;
          }
        const duedate = new Date(task.duedate); // Replace with your date value
        const formattedDuedate = duedate.toISOString(); // Format date as ISO 8601 string
    
        await addTask(task.title, task.description, task.tag, formattedDuedate, task.assignedUsers );
        setTask({title:"",description:"",tag:"",duedate:"", assignedUsers: []})
        props.showAlert("Added Successfully","success");
    }

    const handleUserSelection = (e) => {
  const userId = e.target.value;
  const selectedUsers = task.assignedUsers.includes(userId)
    ? task.assignedUsers.filter((id) => id !== userId)
    : [...task.assignedUsers, userId];
  setTask({ ...task, assignedUsers: selectedUsers });
};

    const onChange = (e) => {
            setTask({...task,[e.target.name]:e.target.value})
    }

    return (
        <div className="container my-3">
        <h2>Add a Task</h2>
        <form className="my-3">
<div className="mb-3">
<label htmlFor="title" className="form-label">Title</label>
<input type="text" className="form-control" id="title" name="title" onChange={onChange} value={task.title} minLength={5} required/>

</div>

<div className="mb-3">
<label htmlFor="description" className="form-label">Description</label>
<input type="text" className="form-control" id="description" name="description" value={task.description} onChange={onChange} minLength={5} required/>
</div>
<div className="mb-3">
<label htmlFor="tag" className="form-label">Tag</label>
<input type="text" className="form-control" id="tag" name="tag" onChange={onChange} value={task.tag} minLength={5} required/>
</div>
<div className="mb-3">
<label htmlFor="duedate" className="form-label">Due Date</label>
<input type="date" className="form-control" id="duedate" name="duedate" value={task.duedate} onChange={onChange} minLength={5} required/>
</div>

<div className="mb-3">
                    <label htmlFor="assignedUsers" className="form-label">Assign Task To</label>
                    <select multiple className="form-control" id="assignedUsers" name="assignedUsers" value={task.assignedUsers} onChange={handleUserSelection}>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                </div>

<button disabled={task.title.length<5 || task.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Task</button>
</form>
</div>
    )
}

export default AddTask;