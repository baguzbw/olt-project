import { Link } from "react-router-dom";
import Cleon from "../components/assets/logo_cleon.png";

const Navbar = () => {
  return (
    <nav>
      <Link to="/" className="text-white hover:text-gray-300 p-10">
        <img src={Cleon} alt="Logo" className="h-1/12 w-1/12 ms-8 cursor-pointer" />
      </Link>
    </nav>
  );
};

export default Navbar;
