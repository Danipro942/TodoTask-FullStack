import { useContext } from "react";
import style from "../style.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginForm, loginSchema } from "../../../Schemas/Auth/login";
import { UserContext } from "../../../context/userContext";
import useLogin from "../../../api/useLogin";
import { toast } from "react-toastify";

type Props = {};

const Login = ({}: Props) => {
  const navigate = useNavigate();
  const { mutate } = useLogin();

  const { user, setTokenStorage } = useContext(UserContext);

  console.log(user);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  console.log(errors);
  const onSubmit = async (data: LoginForm) => {
    await mutate(data, {
      onSuccess: (data) => {
        setTokenStorage(data.token);

        console.log("Sent Login", data);
        toast.success("You've Login Sucessfully");

        navigate("/");
      },
      onError: (err) => {
        toast.error(err.message || "Something went wring, Try Again");
        console.log(err);
      },
    });
  };

  return (
    <div className={style.login}>
      <h1>Login</h1>
      <p className={style.switchAuth}>Login into your account</p>
      <form
        action=""
        className={style.authForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={style.authInput}>
          <input
            type="text"
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
          <a>
            <span onClick={() => navigate("/auth/reset-password")}>
              Forgot your password?
            </span>
          </a>
          <button type="submit">Enviar</button>
        </div>
        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/auth/register")}>Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
