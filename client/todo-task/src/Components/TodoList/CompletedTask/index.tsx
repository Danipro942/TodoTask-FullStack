import style from "./style.module.css";

type Props = {
  completeState: boolean;
  setCompleteState: (TaskState: boolean) => void;
};

const CompletedTask = ({ completeState, setCompleteState }: Props) => {
  return (
    <div className={[`${style.containerButton}`].join()}>
      <div className={[`${style.buttons} `].join()}>
        <button
          onClick={() => setCompleteState(false)}
          className={!completeState ? style.active : ""}
        >
          To Do
        </button>
        <button
          onClick={() => setCompleteState(true)}
          className={completeState ? style.active : ""}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

export default CompletedTask;
