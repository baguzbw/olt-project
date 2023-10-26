import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-[#A78BFA] p-6">
      <div className="flex-grow"></div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faUser} className="text-white mr-4" size="2x" href="/" />
      </div>
    </nav>
  );
};

export default Navbar;
