import style from "../../style.module.css";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  PasswordForm,
  PasswordSchema,
} from "../../../../Schemas/Auth/changePassword";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {};
type ResetAnswer = {
  message: string;
};

const ChangePassword = (props: Props) => {
  const navigate = useNavigate();

  const { token } = useParams();
  console.log(token);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(PasswordSchema),
  });

  console.log(errors);
  const onSubmit = async (data: PasswordForm) => {
    // Email Valitation
    console.log("hi");
    try {
      const URL = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/auth/reset-password/${token}`;
      const response = await axios.put<ResetAnswer>(URL, data);
      console.log(response.data);
      toast.success("We have  reset your password");
      navigate("/auth/login");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 400) {
        toast.error("The token is Invalid");
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
        <label htmlFor="">Enter your new password</label>
        <input
          type="password"
          placeholder="Passoword"
          {...register("password")}
          className={errors?.password ? "errorField" : ""}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className={errors?.confirmPassword ? "errorField" : ""}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ChangePassword;
