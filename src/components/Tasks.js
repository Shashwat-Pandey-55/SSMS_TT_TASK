import React, { useContext, useEffect, useRef, useState } from 'react'; 
import Taskitem from './Taskitem';
import AddTask from './AddTask';
import taskContext from '../context/tasks/taskContext';
import { useNavigate } from 'react-router-dom';


 const Tasks = (props) => {
    const context = useContext(taskContext);
    const navigate = useNavigate();
    const {tasks, getTasks, editTask } = context;
    const [reminders, setReminders] = useState([]);
    useEffect(()=> {
       if (localStorage.getItem('token')){
        getTasks()
       }
       else{
        navigate("/login")
       }
        // eslint-disable-next-line
    },[])

    useEffect(() => {
      // Calculate reminders for tasks
      const currentDate = new Date();
      const taskReminders = tasks.filter((task) => {
        const taskDueDate = new Date(task.duedate);
        const timeDiff = taskDueDate - currentDate;
        const reminderTime = 24 * 60 * 60 * 1000; // 24 hours before the due date
  
        return (
          timeDiff <= reminderTime && // Due date is within 24 hours from now
          timeDiff > -1 * reminderTime // Due date is not in the past
        );
      });
  
      setReminders(taskReminders);
    }, [tasks]);
  

    const ref = useRef(null);
    const refClose = useRef(null);
    const [task,setTask] = useState({id: "", etitle: "", edescription: "", etag: "", eduedate: "", status:"" })


    const updateTask = (currentTask) => {
        ref.current.click(); 
        setTask({id: currentTask._id, etitle : currentTask.title, edescription: currentTask.description, etag:currentTask.tag, eduedate: currentTask.duedate, status: currentTask.status})
    
    } 

    const handleClick = (e) => {
        console.log("Updating the task...", task);
        editTask(task.id, task.etitle, task.edescription, task.etag, task.eduedate, task.status);
        refClose.current.click();
        props.showAlert("Updated Successfully","success");
    }

    const onChange = (e) => {
            setTask({...task,[e.target.name]:e.target.value})
    }

    console.log(tasks);
    return (
        <>
         <AddTask showAlert={props.showAlert} />

         <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
        </button>


<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Edit Task</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">

      <form className="my-3">
<div className="mb-3">
<label htmlFor="title" className="form-label">Title</label>
<input type="text" className="form-control" id="etitle" name="etitle" value={task.etitle} onChange={onChange} minLength={5} required/>

</div>

<div className="mb-3">
<label htmlFor="description" className="form-label">Description</label>
<input type="text" className="form-control" id="edescription" name="edescription" value={task.edescription} onChange={onChange} minLength={5} required />
</div>
<div className="mb-3">
<label htmlFor="tag" className="form-label">Tag</label>
<input type="text" className="form-control" id="etag" name="etag" value={task.etag} onChange={onChange} minLength={5} required/>
</div>
<div className="mb-3">
<label htmlFor="duedate" className="form-label">Due Date</label>
<input type="date" className="form-control" id="eduedate" name="eduedate" value={task.eduedate} onChange={onChange} minLength={5} required/>
</div>

<div className="mb-3">
  <label htmlFor="status" className="form-label">
    Status
  </label>
  <select
    className="form-select"
    id="status"
    name="status"
    value={task.status}
    onChange={onChange}
  >
    <option value="not_started">Not Started</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>
</div>


</form>

      </div>
      <div className="modal-footer">
        <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button disabled={task.etitle.length<5 || task.edescription.length<5} onClick={handleClick}  type="button" className="btn btn-primary">Update Task</button>
      </div>
    </div>
  </div>
</div>
        <div className="row my-3">
        <h2>Your Tasks</h2>
        <div className="container mx-2">
        {tasks.length === 0 && 'No Tasks to Display'}
        </div>
        {tasks.map((task)=>{
        return <Taskitem key={task._id} updateTask={updateTask} task={task} showAlert={props.showAlert}/>
        })}
        </div> 
        <div className="row my-3">
        <h2>Reminders</h2>
    {reminders.length === 0 && <p>No reminders</p>}
    {reminders.map((reminder) => (
      <Taskitem key={reminder._id} updateTask={updateTask} task={reminder} showAlert={props.showAlert} />
    ))}
    </div>
        </>
    )
}

export default Tasks;


