import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const Volt = () => {
  const data = [
    { name: "A", voltage: 238 },
    { name: "B", voltage: 238.5 },
    { name: "C", voltage: 239 },
    { name: "D", voltage: 239.5 },
    { name: "E", voltage: 240.3 },
  ];

  return (
    <div className="font-poppins flex flex-row justify-center p-4">
    <div className="rounded-lg shadow-md bg-white p-6 w-full max-w-6xl flex flex-row items-center">
      <div className="text-3xl text-black font-semibold">
        Tegangan
        <div className="text-5xl text-start font-bold text-[#A78BFA] mt-2">200 V</div>
      </div>
      <div className="ml-28 flex-grow">
        <LineChart width={700} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="voltage" stroke="#A78BFA" strokeWidth={2} dot={false} />
        </LineChart>
      </div>
    </div>
  </div>
);
};

export default Volt;
