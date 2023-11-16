import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState({ name: "", deviceId: "", apiKey: "" });
  const [sensorData, setSensorData] = useState([]);

  const fetchData = useCallback(() => {
    const apiKey = Cookies.get("token");

    axios
      .get(`${API_BASE_URL}device/get/${id}`, { params: { apiKey } })
      .then((response) => {
        if (response.data && response.data.data) {
          setDeviceData(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching device data:", error));

    axios
      .get(`${API_BASE_URL}sensor/get/${id}`, { params: { apiKey } })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setSensorData(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching sensor data:", error));
  }, [id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const goToSensorDetail = (sensorType) => {
    navigate(`/sensor-detail/${sensorType}`, { state: { sensorData, sensorType } });
  };

  const findLatestData = (sensorType) => {
    const latestEntry = sensorData[0] || {};
    return latestEntry[sensorType] || "N/A";
  };

  return (
    <div className={`${styles["fixed-size"]} bg-gray-200 p-4 overflow-hidden shadow-lg`}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 mb-4">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-4 rounded-xl text-white text-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl mb-1">{deviceData.name}</h2>
                <div>{deviceData.deviceId}</div>
                <div>{deviceData.apiKey}</div>
              </div>
              <div className="p-2 text-sm font-semibold border-white border rounded-2xl">
                {deviceData.latitude} , {deviceData.longitude}
              </div>
            </div>
          </div>
        </div>
        <div onClick={() => goToSensorDetail("suhu")} className="cursor-pointer bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl text-white text-center shadow-lg transform transition duration-500 hover:scale-105">
          <p className="font-bold">Suhu</p>
          <p className="text-4xl font-semibold">{findLatestData("suhu")} C</p>
        </div>
        <div onClick={() => goToSensorDetail("kelembapan")} className="bg-gradient-to-br from-orange-700 to-red-600 p-3 rounded-xl text-white text-center shadow-lg transform transition duration-500 hover:scale-105">
          <p className="font-bold">Kelembapan</p>
          <p className="text-4xl font-semibold">{findLatestData("kelembapan")} Rh</p>
        </div>
        <div onClick={() => goToSensorDetail("daya")} className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl text-white text-center shadow-lg transform transition duration-500 hover:scale-105">
          <p className="font-bold">Daya</p>
          <p className="text-4xl font-semibold">{findLatestData("daya")} W</p>
        </div>
        <div onClick={() => goToSensorDetail("tegangan")} className="bg-gradient-to-br from-green-500 to-teal-500 p-3 rounded-xl text-white text-center shadow-lg transform transition duration-500 hover:scale-105">
          <p className="font-bold">Tegangan</p>
          <p className="text-4xl font-semibold">{findLatestData("tegangan")} V</p>
        </div>
        <div onClick={() => goToSensorDetail("arus")} className="bg-gradient-to-br from-blue-800 to-blue-300 p-3 rounded-xl text-white text-center shadow-lg transform transition duration-500 hover:scale-105">
          <p className="font-bold">Arus</p>
          <p className="text-4xl font-semibold">{findLatestData("arus")} A</p>
        </div>
        <div onClick={() => goToSensorDetail("energi")} className="bg-gradient-to-br from-yellow-500 to-amber-500 p-3 rounded-xl text-white text-center shadow-lg transform transition duration-500 hover:scale-105">
          <p className="font-bold">Energi</p>
          <p className="text-4xl font-semibold">{findLatestData("energi")} Wh</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
