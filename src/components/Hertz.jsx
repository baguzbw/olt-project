import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const Hertz = () => {
  const data = [
    { name: "A", hertz: 40 },
    { name: "B", hertz: 42 },
    { name: "C", hertz: 45 },
    { name: "D", hertz: 47 },
    { name: "E", hertz: 49.9 },
  ];

  return (
    <div className="font-poppins flex flex-row justify-center p-4">
      <div className="rounded-lg shadow-md bg-white p-6 w-full max-w-6xl flex flex-row items-center">
        <div className="text-3xl text-black font-semibold">
          Energi
          <div className="text-5xl text-start font-bold text-[#A78BFA] mt-2">600 wh</div>
        </div>
        <div className="ml-40 flex-grow">
          <LineChart width={700} height={200} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="hertz" stroke="#A78BFA" strokeWidth={2} dot={false} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Hertz;
