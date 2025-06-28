import React, { createContext, ReactNode, useState } from "react";
import { TasksResponse } from "../types/tasks";

type Props = {
  children: ReactNode;
};
type TaskContextType = {
  tasks: TasksResponse;
  setTasks: (tasks: TasksResponse) => void;
};
export const TaskContext = createContext<TaskContextType>(
  {} as TaskContextType
);
const useTasks = ({ children }: Props) => {
  const [tasks, setTasks] = useState<TasksResponse>({
    TaskList: [],
    totalItems: 0,
  });
  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export default useTasks;
