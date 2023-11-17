import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState({ name: "", deviceId: "", apiKey: "" });
  const [sensorData, setSensorData] = useState([]);

  const fetchData = useCallback(() => {
    axios
      .get(`${API_BASE_URL}device/all`)
      .then((allDevicesResponse) => {
        const device = allDevicesResponse.data.data.find((d) => d.deviceId === id);
        if (device) {
          const deviceApiKey = device.apiKey;
          setDeviceData(device); 

          axios
            .get(`${API_BASE_URL}device/get/${id}`, { params: { apiKey: deviceApiKey } })
            .then((deviceResponse) => {
              if (deviceResponse.data && deviceResponse.data.data) {
                setDeviceData(deviceResponse.data.data);
              }
            })
            .catch((error) => console.error("Error fetching device data:", error));

          axios
            .get(`${API_BASE_URL}sensor/get/${id}`, { params: { apiKey: deviceApiKey } })
            .then((sensorResponse) => {
              if (sensorResponse.data && Array.isArray(sensorResponse.data.data)) {
                setSensorData(sensorResponse.data.data);
              }
            })
            .catch((error) => console.error("Error fetching sensor data:", error));
        }
      })
      .catch((error) => {
        console.error("Error fetching all devices data:", error);
      });
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
    <div className="h-screen w-screen bg-gray-200 p-6 overflow-hidden shadow-lg">
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
