// PrivateRoute.js
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import isAuthenticated from "./Auth"; 

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};


PrivateRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default PrivateRoute;
