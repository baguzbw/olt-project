import { useLocation } from "react-router-dom";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./Dashboard.module.css";

const SensorDetail = () => {
  const location = useLocation();
  const { sensorData, sensorType } = location.state;

  const chartData = sensorData.map((item) => ({
    value: item[sensorType],
    createdAt: new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));

  return (
    <div className={`${styles["fixed-size"]} bg-gray-200 text-black p-4 overflow-hidden shadow-lg`}>
      <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "32px" }}>{sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Data</h2>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "440px" }}>
        <LineChart width={760} height={280} data={chartData} margin={{ right: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="createdAt" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#A78BFA" strokeWidth={2} dot={false} />
        </LineChart>
      </div>
    </div>
  );
};

export default SensorDetail;
