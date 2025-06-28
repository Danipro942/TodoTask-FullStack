import { Outlet } from "react-router-dom";
import style from "./style.module.css";
import { Bounce, ToastContainer } from "react-toastify";

type Props = {};

const Auth = ({}: Props) => {
  return (
    <div className={style.auth}>
      <div className={style.authContainer}>
        <Outlet />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    </div>
  );
};

export default Auth;
