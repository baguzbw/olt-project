import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Keterangan() {
  const [devices, setDevices] = useState([]);
  const [activeDevice, setActiveDevice] = useState(null);

  useEffect(() => {
    const apiKey = Cookies.get("token");
    axios
      .get(`${API_BASE_URL}device/all?apiKey=${apiKey}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setDevices(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
      });
  }, []);

  return (
    <div className="flex flex-wrap justify-start gap-4">
      {devices.map((device, index) => (
        <Link
          key={index}
          to={`/device/${device.deviceId}`}
          className={`text-lg py-2 px-6 min-w-[175px] text-center md:px-12 w-full md:w-auto rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
            activeDevice === device.deviceId ? "bg-purple-500 text-white" : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setActiveDevice(device.deviceId)}
        >
          {device.name}
        </Link>
      ))}
    </div>
  );
}
