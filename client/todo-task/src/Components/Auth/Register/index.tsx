import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import style from "../style.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { RegisterForm, RegisterShcema } from "../../../Schemas/Auth/register";
import useRegister from "../../../api/useRegister";
import { setSession } from "../../../utils/localStorage";

type Props = {};

const Register = (props: Props) => {
  const navigate = useNavigate();

  const { mutate, isError } = useRegister();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterShcema),
  });

  const onSubmit = (data: RegisterForm) => {
    console.log(data);
    mutate(data, {
      onSuccess: (data) => {
        console.log(data);
        const itemSession = setSession(data.token);
        if (itemSession) {
          toast.success("You created an account!");
          setTimeout(() => {
            navigate("/");
          }, 4000);
        }
      },
      onError: (err) => {
        toast.error(
          err.response?.data.message || "Something went wrong, Try again"
        );
        console.error("Error al registrar:", err.response?.data || err.message);
      },
    });
  };

  return (
    <div className={style.login}>
      <h1>Register</h1>
      <p className={style.switchAuth}>Create a new account</p>
      <form
        action=""
        className={style.authForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={style.authInput}>
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className={errors?.email ? "errorField" : ""}
          />
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={errors?.email ? "errorField" : ""}
          />
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={errors?.password ? "errorField" : ""}
          />
          <input
            type="password"
            placeholder="Repeat password"
            {...register("confirmPassword")}
            className={errors?.confirmPassword ? "errorField" : ""}
          />
          <button type="submit">Enviar</button>
        </div>
        <p>
          Do you have an account?{" "}
          <span onClick={() => navigate("/auth/login")}>Log In</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
