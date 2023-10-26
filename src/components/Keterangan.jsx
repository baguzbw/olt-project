import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Keterangan() {
  const [deviceCount, setDeviceCount] = useState(0);
  const [activeDevice, setActiveDevice] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}device/count`)
      .then((response) => {
        if (response.data && typeof response.data.data === "number") {
          setDeviceCount(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
      });
  }, []);

  return (
    <div className="flex flex-wrap justify-start gap-4">
      {[...Array(deviceCount)].map((_, index) => (
        <Link key={index} to={`/device/${index + 1}`} className={`text-lg py-2 px-12 rounded-lg ${activeDevice === index ? "bg-[#A78BFA] text-white" : "hover:bg-gray-200"}`} onClick={() => setActiveDevice(index)}>
          Device {index + 1}
        </Link>
      ))}
    </div>
  );
}
