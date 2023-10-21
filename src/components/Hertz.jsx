import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { API_BASE_URL } from "../config";

const Energi = () => {
  const { id } = useParams();
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}sensor/get/${id}`);
        if (response.data && response.data.data) {
          setSensorData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const chartData = sensorData.map((item) => ({
    energi: item.energi,
  }));

  
  const latestEnergiValue = sensorData.length > 0 ? sensorData[0].energi : "Loading...";

  return (
    <div className="font-poppins flex flex-row justify-center p-4">
      <div className="rounded-lg shadow-md bg-white p-6 w-full max-w-6xl flex flex-row items-center">
        <div className="text-3xl text-black font-semibold">
          Energi
          <div className="text-5xl text-start font-bold text-[#A78BFA] mt-2">{latestEnergiValue} wh</div>
        </div>
        <div className="ml-40 flex-grow">
          <LineChart width={700} height={200} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="energi" stroke="#A78BFA" strokeWidth={2} dot={false} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Energi;
