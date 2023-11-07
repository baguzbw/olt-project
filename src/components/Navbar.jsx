import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import LogoCleon from "./assets/logo_cleon.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-white p-6 shadow-md">
      <div className="flex items-center">
        <Link to="/home">
          <img src={LogoCleon} alt="Cleon Logo" className="h-12 mr-4" />
        </Link>
      </div>
      <div className="flex-grow"></div>
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="group">
          <div className="flex items-center justify-center rounded-full bg-gray-200 p-2 group-hover:bg-gray-300 transition duration-300">
            <FontAwesomeIcon icon={faUser} className="text-gray-700 group-hover:text-gray-900" size="xl" />
          </div>
        </Link>
        <div onClick={handleLogout} className="group cursor-pointer">
          <div className="flex items-center justify-center rounded-full bg-gray-200 p-2 group-hover:bg-gray-300 transition duration-300">
            <FontAwesomeIcon icon={faSignOutAlt} className="text-gray-700 group-hover:text-gray-900" size="xl" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
