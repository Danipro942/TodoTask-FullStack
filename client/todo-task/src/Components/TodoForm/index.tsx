import style from "./style.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddTaskForm, addTaskSchema } from "../../Schemas/Todo/AddTask";
import addTask from "../../api/AddTask";
import { toast } from "react-toastify";

import { useQueryClient } from "@tanstack/react-query";

type Props = {};

const TodoForm = ({}: Props) => {
  const { mutate } = addTask();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTaskForm>({
    resolver: zodResolver(addTaskSchema),
  });
  const queryClient = useQueryClient(); // Obtener una instancia del QueryClient

  const onSubmit = (data: AddTaskForm) => {
    mutate(data, {
      onSuccess: (data) => {
        console.log("Sent Login", data);
        queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Invalidar y refetch la lista de tareas
      },
      onError: (err) => {
        toast.error(err.message || "Something went wring, Try Again");
        console.log(err);
      },
    });
  };

  return (
    <>
      <form
        action=""
        className={`${style.todoForm}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder="Title Exp: Feed my dog"
          className={errors?.title ? "errorField" : ""}
          {...register("title")}
        />
        <textarea
          {...register("description")}
          className={errors?.description ? "errorField" : ""}
        ></textarea>
        <button type="submit">Enviar</button>
      </form>
    </>
  );
};

export default TodoForm;
