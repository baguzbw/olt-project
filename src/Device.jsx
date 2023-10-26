import { Fragment } from "react";
import Ampere from "./components/Ampere";
import Hertz from "./components/Hertz";
import Information from "./components/Information";
import Sidebar from "./components/Sidebar";
import Volt from "./components/Volt";
import Watt from "./components/Watt";

const Device = () => {
  return (
    <div className="h-screen flex">
      <div className="">
        <Sidebar />
      </div>
      <div className="w-3/4 p-2">
        <Fragment>
          <Information />
          <Watt />
          <Volt />
          <Ampere />
          <Hertz />
        </Fragment>
      </div>
    </div>
  );
};

export default Device;
