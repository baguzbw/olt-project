import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Keterangan() {
  const [deviceCount, setDeviceCount] = useState(0);

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
        <Link key={index} to={`/device/${index + 1}`} className="bg-white text-lg text-[#A78BFA] px-12 py-4 rounded-lg hover:bg-gray-300 transition-colors duration-200">
          Device {index + 1}
        </Link>
      ))}
    </div>
  );
}
