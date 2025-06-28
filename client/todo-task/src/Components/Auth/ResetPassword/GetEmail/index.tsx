import style from "../../style.module.css";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Props = {};
type ResetAnswer = {
  message: string;
};

const GetEmail = ({}: Props) => {
  const navigate = useNavigate();

  const { handleSubmit, register } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    // Email Valitation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.log("Invalid email:", data.email);
    }
    try {
      const URL = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/auth/reset-password/`;
      const response = await axios.post<ResetAnswer>(URL, data);
      console.log(response.data);
      toast.success("We've sent an email to reset your password");
      navigate("/auth/login");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 404) {
        toast.error("Email not found");
      }
      console.log(error.status);
    }
  };

  return (
    <div className={style.resetPW}>
      <form
        action=""
        className={style.authForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="">Enter your Email</label>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          // className={errors?.password ? "errorField" : ""}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default GetEmail;
