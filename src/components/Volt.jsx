import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AreaChart, CartesianGrid, Area, Tooltip, XAxis, YAxis } from "recharts";
import { API_BASE_URL } from "../config";

const Volt = () => {
  const { id } = useParams();
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const devicesResponse = await axios.get(`${API_BASE_URL}device/all`);
        const device = devicesResponse.data.data.find((d) => d.deviceId === id);
        if (device) {
          const deviceApiKey = device.apiKey;
          const response = await axios.get(`${API_BASE_URL}sensor/get/${id}`, {
            params: { apiKey: deviceApiKey },
          });

          if (response.data && response.data.data) {
            setSensorData(response.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [id]);

  const chartData = sensorData.map((item) => ({
    tegangan: item.tegangan,
    createdAt: new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));

  const latestTeganganValue = sensorData.length > 0 ? sensorData[0].tegangan : "...";

  return (
    <div className="font-poppins flex flex-row justify-center p-4">
      <div className="rounded-lg shadow-md bg-white p-6 w-full flex flex-row items-center">
        <div className="text-3xl text-black font-semibold">
          Tegangan
          <div className="text-5xl text-start font-bold text-[#A78BFA] mt-2">{latestTeganganValue} V</div>
        </div>
        <div className="flex-grow">
          <AreaChart width={1000} height={200} data={chartData} margin={{ top: 5, right: 120, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdAt" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="tegangan" stroke="#A78BFA" fill="#A78BFA" />
          </AreaChart>
        </div>
      </div>
    </div>
  );
};

export default Volt;
