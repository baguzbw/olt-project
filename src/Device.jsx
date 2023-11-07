import { Fragment } from "react";
import Ampere from "./components/Ampere";
import Hertz from "./components/Hertz";
import Information from "./components/Information";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Volt from "./components/Volt";
import Watt from "./components/Watt";

const Device = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-row flex-grow">
        <div className="">
          <Sidebar />
        </div>
        <div className="w-3/4">
          <Fragment>
            <Information />
            <Watt />
            <Volt />
            <Ampere />
            <Hertz />
          </Fragment>
        </div>
      </div>
    </div>
  );
};

export default Device;
