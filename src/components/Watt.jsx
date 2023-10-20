import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const Watt = () => {
  const data = [
    { name: "A", watt: 18 },
    { name: "B", watt: 18.5 },
    { name: "C", watt: 19 },
    { name: "D", watt: 19.5 },
    { name: "E", watt: 20.7 },
  ];

  return (
    <div className="font-poppins flex flex-row justify-center p-4">
      <div className="rounded-lg shadow-md bg-white p-6 w-full max-w-6xl flex flex-row items-center">
        <div className="text-3xl text-black font-semibold">
          Daya
          <div className="text-5xl text-start font-bold text-[#A78BFA] mt-2">20.7 W</div>
        </div>
        <div className="ml-40 flex-grow">
          <LineChart width={700} height={200} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="watt" stroke="#A78BFA" strokeWidth={2} dot={false} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Watt;
