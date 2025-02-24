import { useContext } from "react";
import { AuthContexts } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContexts);

  if (user) {
    return children;
  }

  return (
    <div>
      <Navigate to="/login" />;
    </div>
  );
};

export default PrivateRoute;
