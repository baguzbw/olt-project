import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { API_BASE_URL } from "../config";

const Ampere = () => {
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
    ampere: item.arus,
  }));

  // Extract the latest arus value for display
  const latestArusValue = sensorData.length > 0 ? sensorData[0].arus : "Loading...";

  return (
    <div className="font-poppins flex flex-row justify-center p-4">
      <div className="rounded-lg shadow-md bg-white p-6 w-full max-w-6xl flex flex-row items-center">
        <div className="text-3xl text-black font-semibold">
          Arus
          <div className="text-5xl text-start font-bold text-[#A78BFA] mt-2">{latestArusValue} A</div>
        </div>
        <div className="ml-40 flex-grow">
          <LineChart width={700} height={200} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ampere" stroke="#A78BFA" strokeWidth={2} dot={false} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Ampere;
