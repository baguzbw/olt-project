import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { API_BASE_URL } from "../config";

const Ampere = () => {
  const { id } = useParams();
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = Cookies.get("token");
        const devicesResponse = await axios.get(`${API_BASE_URL}device/all?apiKey=${apiKey}`);
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
    ampere: item.arus,
    createdAt: new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));

  const latestArusValue = sensorData.length > 0 ? sensorData[0].arus : "...";
  const reversedChartData = [...chartData].reverse();

  return (
    <div className="font-poppins flex flex-row justify-center p-4">
      <div className="rounded-lg shadow-md bg-white p-6 w-full max-w-full flex flex-row items-center">
        <div className="text-3xl text-black font-semibold">
          Arus
          <div className="text-5xl text-start font-bold text-[#A78BFA] mt-2">{latestArusValue} A</div>
        </div>
        <div className="ml-20 flex-grow">
          <AreaChart width={1000} height={200} data={reversedChartData} margin={{ top: 5, right: 120, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdAt" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="ampere" stroke="#A78BFA" fill="#A78BFA" />
          </AreaChart>
        </div>
      </div>
    </div>
  );
};

export default Ampere;
