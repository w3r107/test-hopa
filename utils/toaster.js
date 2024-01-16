import { toast } from "react-toastify";

const toaster = (success, message) => {
  if (success) toast.success(message);
  else toast.error(message);
};

export default toaster;
