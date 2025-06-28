import { useEffect, useState } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Home from "./Home";
import Auth from "./Auth";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";
import { isAuth } from "../utils/isAuth";
import GetEmail from "../Components/Auth/ResetPassword/GetEmail";
import ChangePassword from "../Components/Auth/ResetPassword/ChangePassowrd";

const AppRouter = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const auth = await isAuth();
      setAuthenticated(auth);
    };
    checkAuthentication();
  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>; // O cualquier componente de carga.
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: authenticated ? <Home /> : <Navigate to="/auth/login" replace />,
      errorElement: <div>Esta página no existe</div>,
    },
    {
      path: "/auth",
      element: <Auth />,
      children: [
        { path: "", element: <Navigate to="/auth/login" replace /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "reset-password", element: <GetEmail /> },
        { path: "reset-password/:token?", element: <ChangePassword /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
