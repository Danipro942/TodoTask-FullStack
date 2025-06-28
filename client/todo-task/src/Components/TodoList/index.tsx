import UseGetTasks from "../../api/useGetTasks";
import style from "./style.module.css";
import TodoTask from "./TodoCard";
import { useContext, useEffect, useState } from "react";
import { TasksResponse } from "../../types/tasks";
import Pagination from "../Pagination";
import { TaskContext } from "../../context/useTasks";
import CompletedTask from "./CompletedTask";
import apiClient from "../../api/apiClient";

type Props = {};

type DeleteTask = {
  message: string;
};

const TodoList = ({}: Props) => {
  const [completeState, setCompleteState] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data } = UseGetTasks(currentPage, completeState);
  const { setTasks, tasks } = useContext(TaskContext);

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(`Fetching tasks for page: ${page}`);
  };

  const updateTask = async (taskId: string) => {
    console.log(taskId);
    const updateTask = tasks?.TaskList.filter((task) => task._id !== taskId);
    setTasks({
      TaskList: updateTask,
      totalItems: tasks?.totalItems || 0,
    });
    const URL = `/api/task/update-task/${taskId}`;

    try {
      const response = await apiClient.put<DeleteTask>(URL);
      console.log("Task deleted successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting task", error);
      setTasks(data as TasksResponse);
    }
  };

  const deleteTask = async (taskId: string) => {
    const deleteTaskList = tasks?.TaskList.filter(
      (task) => task._id !== taskId
    );
    setTasks({
      TaskList: deleteTaskList,
      totalItems: tasks?.totalItems || 0,
    });
    const URL = `/api/task/tasks/${taskId}`;
    try {
      const response = await apiClient.delete<DeleteTask>(URL);
      console.log("Task deleted successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting task", error);
      setTasks(data as TasksResponse);
    }
  };

  return (
    <div className={style.listContainer}>
      <CompletedTask
        completeState={completeState}
        setCompleteState={setCompleteState}
      />
      <div className={style.containerList}>
        {tasks.totalItems ? (
          tasks?.TaskList.map((task, index) => (
            <TodoTask
              state={completeState}
              key={index}
              deleteTask={deleteTask}
              task={task}
              updateTask={updateTask}
            />
          ))
        ) : (
          <p>Nothing over here </p>
        )}
      </div>
      <Pagination
        totalItems={tasks.totalItems}
        perPage={5}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TodoList;
// {tasks?.TaskList.map((task, index) => (
//   <TodoTask key={index} deleteTask={deleteTask} task={task} />
// ))}
