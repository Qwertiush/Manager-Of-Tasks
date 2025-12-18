import { useEffect, useState } from "react";
import "./TodoElement.css";
import {
  updateDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { v4 as uuidv4 } from "uuid";

const TodoElement = ({ element, onDelete }) => {
  const [toDoElement, setToDoElement] = useState(element);
  const [tasks, setTasks] = useState(toDoElement.tasks);
  const [newTask, setNewTask] = useState("");
  const [changeHeaderActive, setChangeHeaderActive] = useState(false);
  const [newToDoHeader, setNewToDoHeader] = useState(element.title);
  const [isExpanded, setIsExpanded] = useState(true);

  const [reload, setReload] = useState(0);

  const todolistsCollectionRef = collection(db, "todolists");

  const handleAddingTask = async () => {
    if (!newTask) {
      return;
    }

    try {
      const querySnapshot = await getDocs(
        query(todolistsCollectionRef, where("id", "==", element.id))
      );

      const taskToAdd = { id: uuidv4(), content: newTask, active: true };

      querySnapshot.forEach(async (doc) => {
        const updatedTasks = [...doc.data().tasks, taskToAdd]; // New tasks data

        // Update the tasks field with newTasks
        await updateDoc(doc.ref, {
          tasks: updatedTasks,
        });

        console.log("Document successfully updated!");
        setReload(reload + 1);
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }

    setNewTask("");
  };

  const handleNewTaskOnChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleChangingHeader = () => {
    console.log("change header");
    setChangeHeaderActive(true);
  };

  const handleOnChangeHeader = (e) => {
    setNewToDoHeader(e.target.value);
  };

  const handleOnTitleSubmit = async (e) => {
    e.preventDefault();
    setChangeHeaderActive(false);
    try {
      const querySnapshot = await getDocs(
        query(todolistsCollectionRef, where("id", "==", element.id))
      );

      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;

        const updatedHeader = { ...doc.data(), title: newToDoHeader };

        await updateDoc(docRef, updatedHeader);

        console.log("Document successfully updated!");
        setReload(reload + 1);
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleOnTaskSubmit = (e) => {
    e.preventDefault();
    handleAddingTask();
  };

  const handleToDoDelete = () => {
    onDelete(element.id);
  };

  const handleTaskClick = async (taskId) => {
    try {
      const querySnapshot = await getDocs(
        query(todolistsCollectionRef, where("id", "==", element.id))
      );

      querySnapshot.forEach(async (doc) => {
        const updatedTasks = doc.data().tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, active: !task.active };
          }
          return task;
        });

        // Update the tasks field with newTasks
        await updateDoc(doc.ref, {
          tasks: updatedTasks,
        });

        console.log("Document successfully updated!");
        setReload(reload + 1);
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleToDoExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditingTask = (id) => {
    console.log("editing task");
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        const q = query(
          collection(db, "todolists"),
          where("id", "==", element.id)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const tasksData = querySnapshot.docs[0].data();
          setToDoElement(tasksData);
          setTasks(tasksData.tasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    console.log("fetching");
    getTasks();
  }, [reload]);

  return (
    <div className="todoelement-container">
      <div className="todoelement">
        {!changeHeaderActive ? (
          <div className="todoelement-header">
            <div
              className="todoelement-header-title"
              onClick={handleChangingHeader}
            >
              {toDoElement.title}
            </div>
            <div>
              <button className="btn-expand" onClick={handleToDoExpand}>
                {isExpanded ? "\u2191" : "\u2193"}
              </button>
              <button className="btn-delete" onClick={handleToDoDelete}>
                X
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleOnTitleSubmit}>
            <input
              type="text"
              value={newToDoHeader}
              onChange={handleOnChangeHeader}
              autoFocus
              onFocus={(e) => {
                e.target.select();
              }}
            />
          </form>
        )}
        {isExpanded && (
          <div className="todoelement-body">
            {tasks.map((task, index) => {
              return (
                <h4
                  onClick={() => handleTaskClick(task.id)}
                  key={index}
                  style={{
                    textDecoration: task.active ? "none" : "line-through",
                    color: task.active
                      ? "rgba(255, 255, 255, 0.87)"
                      : "rgba(255, 96, 96, 0.87)",
                  }}
                >
                  {task.content}
                </h4>
              );
            })}
            <div>
              <form onSubmit={handleOnTaskSubmit}>
                <input
                  type="text"
                  value={newTask}
                  onChange={handleNewTaskOnChange}
                />
                <button onClick={handleAddingTask}>+</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoElement;
