import { firebaseApp } from "../../firebaseClient";
import { DocumentData } from "@firebase/firestore";

import {
  getFirestore,
  Timestamp,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

interface userName {
  name: string;
  surname: string;
}

interface userData {
  userId: string;
  email: string;
  time?: Date;
  user: userName;
}

interface taskData {
  userId: string;
  created: Date;
  taskName: string;
  taskDate: Date;
  taskData: string;
  taskId: string;
}

const useFirestoreData = () => {
  const firestore = getFirestore(firebaseApp);

  async function createUser(data: userData): Promise<void> {
    try {
      await setDoc(doc(firestore, "users", data.userId), {
        time: Timestamp.fromDate(new Date()).toDate(),
        userId: data.userId,
        email: data.email,
        user: { name: data.user.name, surname: data.user.surname },
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function getUser(id: string): Promise<DocumentData | void> {
    try {
      const user = await getDoc(doc(firestore, "users", id));
      return user.data();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function deleteUserData(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, "users", userId))
    } catch (error) {
      if (error) {
        if (error instanceof Error)
        alert(error.message)
      }
    }
  }

  async function addNewTask(
    userId: string,
    taskName: string,
    taskDate: Date | null,
    taskData: string
  ) {
    if (!!taskName && !!taskDate && !!taskData) {
      try {
        await addDoc(collection(firestore, "tasks"), {
          userId: userId,
          created: Timestamp.fromDate(new Date()),
          taskName: taskName,
          taskDate: taskDate,
          taskData: taskData,
        });
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    } else {
      alert("Input field empty!");
    }
  }

  async function deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, "tasks", taskId));
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function deleteUserTasks(userId: string): Promise<void>{
    try {
      const userTask = query(
        collection(firestore, "tasks"),
        where("userId", "==", userId)
      );
        
      const usersTaskSnapshot = await getDocs(userTask);

      if (usersTaskSnapshot) {
        usersTaskSnapshot.forEach((item) => {
          deleteTask(item.id);
        })
      }

    } catch (error) { 
      if (error instanceof Error) {
        alert (error.message)
      }
    }
  }

  async function getTasks(userId: string): Promise<taskData[]> {
    let tasks: taskData[] = [];

    try {
      if (userId) {
        const tasksRef = query(
          collection(firestore, "tasks"),
          where("userId", "==", userId)
        );
        const tasksRefSnapshot = await getDocs(tasksRef);

        tasksRefSnapshot.forEach((task) => {
          tasks.push({
            created: task.data().created.toDate(),
            taskName: task.data().taskName,
            taskDate: task.data().taskDate.toDate(),
            taskData: task.data().taskData,
            taskId: task.id,
          } as taskData);
        });

        const tasksSort: taskData[] = tasks.sort(
          (a, b) => b.created.valueOf() - a.created.valueOf()
        );

        if (tasksSort.length > 0) {
          return tasksSort;
        }
      } else {
        console.log("Redux state Error");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        alert(error.message);
      }
    }

    return tasks;
  }

  return {
    createUser,
    getUser,
    addNewTask,
    deleteTask,
    getTasks,
    deleteUserData,
    deleteUserTasks
  };
};

export default useFirestoreData;
