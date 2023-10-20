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
    <div>
      {[...Array(deviceCount)].map((_, index) => (
        <div key={index} className="space-x-2">
          <Link to={`/device/${index + 1}`} className="text-black font-semibold hover:text-gray-300">
            Device {index + 1}
          </Link>
        </div>
      ))}
    </div>
  );
}
