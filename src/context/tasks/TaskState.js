// eslint-disable-next-line
import { useState, useEffect } from "react";
import TaskContext from "./taskContext";

const TaskState = (props) => {
  const host = "http://localhost:5500";
  const tasksInitial = [];

  const [tasks, setTasks] = useState(tasksInitial);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAllTasks();
    // fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // Fetch All Tasks
const fetchAllTasks = async () => {
  try {
    const response = await fetch(`${host}/api/tasks/fetchalltasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const tasksData = await response.json();

    // Process the assignedMembers field to extract only the names
   const updatedTasks = tasksData.map((task) => ({
    ...task,
    assignedMembers: task.assignedMembers.map((member) => member.name),
  }));
    setTasks(updatedTasks);
  
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};



  // Fetch All Users
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${host}/api/tasks/fetchallusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      setUsers(json);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };




  // GET all Tasks
  const getTasks = async () => {
    //API call
    const response = await fetch(`${host}/api/tasks/fetchalltasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    setTasks(json);
  };



// Add a Task
const addTask = async (title, description, tag, duedate, users) => {
  try {

    if (!users || users.length === 0) {
      // Display an error message if no user is selected
      console.log("Add a user before adding the task");
      return;
    }
    const usersArray = Array.isArray(users) ? users : [users];
 
    const response = await fetch(`${host}/api/tasks/addtask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag, duedate, users: usersArray,status: "Not Started"}),
    });

    if (response.ok) {
      const task = await response.json();
      setTasks((prevTasks) => [...prevTasks, task]);
      fetchAllTasks();
    } else {
      const errorResponse = await response.json();
      // Handle the case where the response is not successful
      console.log("Task not added. Error:", response.status);
      console.log("Error Message:", errorResponse.error); 
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("Error adding task:", error);
  }
};





  // // Delete a Task
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${host}/api/tasks/deletetask/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
  
      // Handle non-JSON response (e.g., plain text error messages)
      if (!response.ok) {
        const errorMessage = await response.text();
        console.log("Error deleting task:", errorMessage);
        return;
      }
  
      const json = await response.json();
      console.log(json);
      const newTasks = tasks.filter((task) => {
        return task._id !== id;
      });
      setTasks(newTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  



  // Edit a Task
  const editTask = async (id, title, description, tag, duedate, status) => {
    //API call
    const response = await fetch(`${host}/api/tasks/updatetask/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag, duedate, status}),
    });

    const json = await response.json();
    console.log(json);
    let newTasks = JSON.parse(JSON.stringify(tasks));

    // Logic to edit in client
    for (let index = 0; index < newTasks.length; index++) {
      const element = newTasks[index];
      if (element._id === id) {
        newTasks[index].title = title;
        newTasks[index].description = description;
        newTasks[index].tag = tag;
        newTasks[index].duedate = duedate;
        newTasks[index].status = status;
        break; 
      }
    }
    setTasks(newTasks);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, deleteTask, editTask, getTasks, users,  fetchAllTasks, fetchAllUsers,}}
    >
      {props.children};
    </TaskContext.Provider>
  );
};

export default TaskState;



