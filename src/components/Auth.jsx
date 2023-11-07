import Cookies from "js-cookie";

const isAuthenticated = () => {
  const token = Cookies.get("token");
  return !!token;
};

const getRole = () => {
  return Cookies.get("role");
};

const isAdmin = () => {
  const role = getRole();
  return role === "ADMIN";
};


export default isAuthenticated;


export { isAuthenticated, isAdmin, getRole };
