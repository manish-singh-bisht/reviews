import { Navigate } from "react-router-dom";
import { getTokenFromLocalStorage } from "../lib/utils";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const token = getTokenFromLocalStorage();
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
