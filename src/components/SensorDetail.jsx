import { useLocation } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";


const SensorDetail = () => {
  const location = useLocation();
  const { sensorData, sensorType } = location.state;

  const chartData = sensorData.map((item) => ({
    value: item[sensorType],
    createdAt: new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));

  return (
    <div className="h-screen w-screen bg-gray-200 p-4 overflow-hidden shadow-lg rounded-xl flex justify-center items-center">
      <div className="card bg-white rounded-xl overflow-hidden shadow-md">
        <h2 className="text-center text-black font-bold text-2xl mb-8 py-4">{sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Data</h2>
        <div className="flex justify-center items-center p-4">
          <AreaChart width={760} height={280} data={chartData} margin={{ right: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdAt" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#A78BFA" fill="#A78BFA" />
          </AreaChart>
        </div>
      </div>
    </div>
  );
};

export default SensorDetail;
