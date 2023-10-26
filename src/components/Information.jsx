import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Information = () => {
  const { id } = useParams();
  const [deviceData, setDeviceData] = useState(null);
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}device/get/${id}`)
      .then((response) => {
        if (response.data && response.data.data) {
          setDeviceData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching device data:", error);
      });

    axios
      .get(`${API_BASE_URL}sensor/get/${id}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setSensorData(response.data.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching sensor data:", error);
      });
  }, [id]);

  return (
    <div className="font-poppins flex flex-row justify-center p-4">
      <div className="rounded-lg shadow-md bg-white p-6 w-full max-w-full flex flex-row items-center">
        <div className="text-3xl text-black font-semibold">
          Information
          <div className="text-lg text-start font-semibold text-[#A78BFA] mt-4">
            Device ID : <span className="font-bold">{deviceData ? deviceData.name : "Loading..."}</span>
          </div>
          <div className="text-lg text-start font-semibold text-[#A78BFA] mt-2">
            Lokasi : <span className="font-bold">{deviceData ? deviceData.location : "Loading..."}</span>
          </div>
        </div>
        <div className="ms-96 flex-grow">
          <div className="text-3xl text-black font-semibold">
            Suhu
            <div className="text-5xl text-start font-bold text-[#A78BFA] mt-8 ">{sensorData ? sensorData.suhu + " C" : "Loading..."}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
