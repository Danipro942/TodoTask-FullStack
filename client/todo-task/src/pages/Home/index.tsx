import { useContext } from "react";
import style from "./style.module.css";
import { UserContext } from "../../context/userContext";
import TodoForm from "../../Components/TodoForm";
import TodoList from "../../Components/TodoList";
type Props = {};

const Home = ({}: Props) => {
  const { user } = useContext(UserContext);
  console.log(user);
  const signOut = () => {
    localStorage.removeItem("session");
    window.location.href = "/auth/";
  };
  return (
    <div className={style.home}>
      <div className={style.authContainer}>
        <h1>
          Welcome {user?.username} <p onClick={() => signOut()}>Sign Out</p>
        </h1>

        <TodoForm />
      </div>

      {/* <h2>List</h2> */}
      <TodoList />
    </div>
  );
};

export default Home;
