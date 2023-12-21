import { faCarBattery, faCircle, faClock, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState({
    name: "",
    deviceId: "",
    latitude: "",
    longitude: "",
    status: false,
  });
  const [batteryData, setBatteryData] = useState({
    batteryBrand: "",
    voltageNominal: "",
    voltageTop: "",
    voltageLow: "",
  });
  const [sensorData, setSensorData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [latestBatteryData, setLatestBatteryData] = useState({
    capacityNow: 0,
    percentageNow: 0,
    createdAt: null,
    updatedAt: null,
  });

  const fetchData = useCallback(async () => {
    try {
      const deviceResponse = await axios.get(`${API_BASE_URL}device/getDashboard/${id}`);
      const sensorResponse = await axios.get(`${API_BASE_URL}sensor/getDashboard/${id}`);

      if (deviceResponse.data && deviceResponse.data.data && deviceResponse.data.data.length > 0) {
        const deviceInfo = deviceResponse.data.data[0];
        setDeviceData({
          name: deviceInfo.name,
          deviceId: deviceInfo.deviceId,
          latitude: deviceInfo.latitude,
          longitude: deviceInfo.longitude,
          status: deviceInfo.status,
        });
        setIsSwitchOn(deviceInfo.status);
      }

      const batteryInfo = deviceResponse.data.data.find((item) => item.specBatteryId);
      if (batteryInfo) {
        setBatteryData({
          batteryBrand: batteryInfo.batteryBrand,
          voltageNominal: batteryInfo.voltageNominal,
          voltageTop: batteryInfo.voltageTop,
          voltageLow: batteryInfo.voltageLow,
        });
      } else {
        setBatteryData({
          batteryBrand: "N/A",
          voltageNominal: "N/A",
          voltageTop: "N/A",
          voltageLow: "N/A",
        });
      }

      if (sensorResponse.data && sensorResponse.data.data && sensorResponse.data.data.length > 0) {
        setSensorData(sensorResponse.data.data);
        setLastUpdated(new Date(sensorResponse.data.data[0].updatedAt));
      } else {
        setSensorData([]);
        setLastUpdated(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [id]);



  const fetchLatestBatteryData = useCallback(async () => {
    try {
      const latestBatteryResponse = await axios.get(`${API_BASE_URL}battery/getDashboard/${id}`);

      if (latestBatteryResponse.data && Array.isArray(latestBatteryResponse.data.data)) {
        const sortedBatteryData = latestBatteryResponse.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        const latestData = sortedBatteryData[0] || {};
        setLatestBatteryData({
          capacityNow: latestData.capacityNow || 0,
          percentageNow: latestData.persentageNow || 0,
          createdAt: latestData.createdAt,
          updatedAt: latestData.updatedAt,
        });
      }
    } catch (error) {
      console.error("Error fetching latest battery data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    fetchLatestBatteryData();
    const interval = setInterval(() => {
      fetchData();
      fetchLatestBatteryData();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchData, fetchLatestBatteryData]);

  useEffect(() => {
    setIsFetching(sensorData.length > 0);
  }, [sensorData]);

  useEffect(() => {
    const now = new Date();
    const timeDifference = now - lastUpdated;

    if (timeDifference > 10000) {
      setIsFetching(false);
    } else {
      setIsFetching(true);
    }

    const timeout = setTimeout(() => {
      if (timeDifference > 10000) {
        setIsFetching(false);
      } else {
        setIsFetching(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [lastUpdated]);

  const goToSensorDetail = (sensorType) => {
    navigate(`/sensor-detail/${sensorType}`, { state: { sensorData, sensorType } });
  };

  const findLatestData = (sensorType) => {
    const latestEntry = sensorData[0] || {};
    return latestEntry[sensorType] || "0.0";
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const toggleSwitch = () => {
    const newStatus = !isSwitchOn;

    axios
      .patch(`${API_BASE_URL}relay/updateDashboard/${id}`, { status: newStatus })
      .then((response) => {
        if (response.data && response.data.data) {
          setIsSwitchOn(response.data.data.status);
        }
      })
      .catch((error) => {
        console.error("Error updating device status:", error);
      });
  };

  return (
    <div className="h-screen w-screen bg-gray-200 p-6 overflow-hidden shadow-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 mb-4">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-3 rounded-xl text-white text-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white p-2">
                  <h2 className="font-bold text-2xl text-white mb-4">{deviceData.name}</h2>
                  <div className="switch-container mb-2">
                    <label htmlFor="toggle" className="cursor-pointer">
                      <div className="relative">
                        {/* Switch */}
                        <input id="toggle" type="checkbox" className="sr-only" checked={isSwitchOn} onChange={toggleSwitch} />
                        <div className={`block w-14 h-8 rounded-full transition duration-300 ease-in-out ${isSwitchOn ? "bg-green-500" : "bg-gray-700"}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transform transition duration-300 ease-in-out ${isSwitchOn ? "translate-x-6" : ""}`}></div>
                      </div>
                    </label>
                  </div>
                  <span className="text-sm">Device ID : {deviceData.deviceId}</span>
                  <div className="flex items-center text-white font-semibold"></div>
                  <span className="text-sm">
                    Battery Brand : <span className="text-base">{batteryData.batteryBrand}</span>
                  </span>
                  <div className="flex items-center text-white font-semibold"></div>
                  <span className="text-sm">
                    Voltage Nominal : <span className="text-base">{batteryData.voltageNominal} V</span>
                  </span>
                  <div className="flex items-center text-white font-semibold"></div>
                  <span className="text-sm">
                    Voltage Top : <span className="text-base">{batteryData.voltageTop} V</span>
                  </span>
                  <div className="flex items-center text-white font-semibold"></div>
                  <span className="text-sm">
                    Voltage Low : <span className="text-base">{batteryData.voltageNominal} V</span>
                  </span>
                </div>
              </div>
              <div className="p-3 text-sm text-right">
                <div className="items-center mb-2">
                  <span className="text-sm text-right">
                    {deviceData.latitude}, {deviceData.longitude}
                  </span>
                  <FontAwesomeIcon className="ms-2 " icon={faMapMarkerAlt} />
                </div>
                <div className="items-center mt-3">
                  <span className="text-sm text-end">Last Updated</span>
                  <FontAwesomeIcon className="ms-2 text-sm" icon={faClock} />
                </div>
                <div className="mt-1 text-base font-semibold ">{lastUpdated ? ` ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${formatDate(lastUpdated)} ` : "Not Have Data..."}</div>
                <div className="items-center mt-1 font-semibold">
                  <span className="text-sm text-end">
                    <span className="ml-1">
                      {latestBatteryData ? `${latestBatteryData.capacityNow} Ah` : "0"} <FontAwesomeIcon className="text-sm" icon={faCarBattery} />
                    </span>
                    <span className="ms-1">{latestBatteryData ? `${latestBatteryData.percentageNow}%` : "0"}</span>
                  </span>
                </div>
                <div className="mt-1 text-base font-semibold ">
                  {isFetching ? (
                    <span className="text-green-500">
                      Active <FontAwesomeIcon className="ms-2 text-sm" icon={faCircle} />
                    </span>
                  ) : (
                    <span className="text-red-500">
                      Not Active
                      <FontAwesomeIcon className=" ms-2 text-sm" icon={faCircle} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div onClick={() => goToSensorDetail("suhu")} className="cursor-pointer bg-gradient-to-br from-purple-500 to-indigo-600 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Suhu</p>
          <p className="text-4xl font-semibold">{findLatestData("suhu")} C</p>
        </div>
        <div onClick={() => goToSensorDetail("kelembapan")} className="bg-gradient-to-br from-orange-700 to-red-600 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Kelembapan</p>
          <p className="text-4xl font-semibold">{findLatestData("kelembapan")} Rh</p>
        </div>
        <div onClick={() => goToSensorDetail("daya")} className="bg-gradient-to-br from-red-500 to-pink-500 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Daya</p>
          <p className="text-4xl font-semibold">{findLatestData("daya")} W</p>
        </div>
        <div onClick={() => goToSensorDetail("tegangan")} className="bg-gradient-to-br from-green-500 to-teal-500 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Tegangan</p>
          <p className="text-4xl font-semibold">{findLatestData("tegangan")} V</p>
        </div>
        <div onClick={() => goToSensorDetail("arus")} className="bg-gradient-to-br from-blue-800 to-blue-300 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Arus</p>
          <p className="text-4xl font-semibold">{findLatestData("arus")} A</p>
        </div>
        <div onClick={() => goToSensorDetail("energi")} className="bg-gradient-to-br from-yellow-500 to-amber-500 p-8 md:p-4 rounded-xl text-white text-center shadow-lg transform transition duration-500 ">
          <p className="font-bold">Energi</p>
          <p className="text-4xl font-semibold">{findLatestData("energi")} Wh</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
