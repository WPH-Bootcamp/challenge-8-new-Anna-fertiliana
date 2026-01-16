import Icon from "./Icon";
import "./ToastSuccess.css";

interface ToastSuccessProps {
  show: boolean;
  message: string;
}

const ToastSuccess = ({ show, message }: ToastSuccessProps) => {
  if (!show) return null;

  return (
    <div className="toast-success">
      <Icon
        name="check.svg"
        className="toast-icon"
      />
      <p>{message}</p>
    </div>
  );
};

export default ToastSuccess;
