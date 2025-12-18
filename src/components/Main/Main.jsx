import { useEffect, useState } from "react";
import "./Main.css";
import TodoElement from "../TodoElement";
import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebase-config";
import { v4 as uuidv4 } from "uuid";

const Main = ({ user, setUser, userInfo }) => {
  const [todoElements, setToDoElements] = useState([]);
  const [reload, setReload] = useState(0);

  const todolistsCollectionRef = collection(db, "todolists");

  const handleAddingNewToDoList = async () => {
    console.log("Adding new list");
    const newToDoList = {
      id: uuidv4(),
      title: "New ToDo",
      tasks: [],
      author: auth.currentUser.email,
    };

    await addDoc(todolistsCollectionRef, newToDoList);

    setReload(reload + 1);
  };

  const handleDeleteCallback = async (id) => {
    try {
      const querySnapshot = await getDocs(
        query(todolistsCollectionRef, where("id", "==", id))
      );

      const deletePromises = querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
        console.log("Deleted document with ID:", doc.id);
      });

      await Promise.all(deletePromises);

      setReload(reload + 1);
    } catch (error) {
      console.error("Error deleting documents:", error);
    }
  };

  useEffect(() => {
    const getToDoLists = async () => {
      if (!user) {
        return;
      }

      try {
        const q = query(
          collection(db, "todolists"),
          where("author", "==", userInfo.email)
        );
        const data = await getDocs(q);
        setToDoElements(data.docs.map((doc) => ({ ...doc.data() })));
      } catch (error) {
        console.error("Error fetching todo lists:", error);
      }
    };

    getToDoLists();
    console.log("fa");
  }, [user, reload]);

  return (
    <div className="main-container">
      <div className="todoelements-container">
        {todoElements.map((element) => {
          return (
            <TodoElement
              key={element.id}
              element={element}
              onDelete={handleDeleteCallback}
            />
          );
        })}
        <div className="new-todolist">
          <button onClick={handleAddingNewToDoList}>+</button>
        </div>
      </div>
    </div>
  );
};

export default Main;
