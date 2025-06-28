import { MdOutlineDeleteOutline } from "react-icons/md";
import style from "../style.module.css";
import { TasksList } from "../../../types/tasks";

type Props = {
  task: TasksList;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string) => void;
  state: boolean;
};

const TodoTask = ({ task, deleteTask, updateTask, state }: Props) => {
  return (
    <div className={style.todoContainer}>
      <div className={style.taskDetails}>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <div className={style.actions}>
        <div className={style.complete} onClick={() => updateTask(task._id)}>
          <input type="checkbox" checked={state} />
        </div>
        <div className={style.delete} onClick={() => deleteTask(task._id)}>
          <MdOutlineDeleteOutline />
        </div>
      </div>
    </div>
  );
};

export default TodoTask;
