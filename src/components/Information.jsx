import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Information = () => {
  const { id } = useParams();
  const [deviceData, setDeviceData] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    const fetchAllDevicesData = async () => {
      try {
        const apiKey = Cookies.get("token");
        const allDevicesResponse = await axios.get(`${API_BASE_URL}device/all?apiKey=${apiKey}`);
        const device = allDevicesResponse.data.data.find((d) => d.deviceId === id);
        if (device) {
          const deviceApiKey = device.apiKey;

          const sensorResponse = await axios.get(`${API_BASE_URL}sensor/get/${id}`, {
            params: { apiKey: deviceApiKey },
          });
          if (sensorResponse.data && Array.isArray(sensorResponse.data.data)) {
            setSensorData(sensorResponse.data.data[0]);
          }

          const deviceResponse = await axios.get(`${API_BASE_URL}device/get/${id}`, {
            params: { apiKey: apiKey },
          });
          if (deviceResponse.data && deviceResponse.data.data) {
            setDeviceData(deviceResponse.data.data);
            setIsSwitchOn(deviceResponse.data.data.status);
          }
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    const fetchDataInterval = setInterval(fetchAllDevicesData, 1000);
    fetchAllDevicesData();
    return () => {
      clearInterval(fetchDataInterval);
    };
  }, [id]);

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  let latitude = "...";
  let longitude = "...";

  if (deviceData && deviceData.latitude && deviceData.longitude) {
    latitude = parseFloat(deviceData.latitude).toFixed(4);
    longitude = parseFloat(deviceData.longitude).toFixed(4);
  }

  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const toggleSwitch = () => {
    const newStatus = !isSwitchOn;

    axios
      .patch(
        `${API_BASE_URL}device/update/${id}`,
        {
          status: newStatus,
        },
        {
          params: {
            apiKey: Cookies.get("token"),
          },
        }
      )
      .then((response) => {
        if (response.data && response.data.data) {
          setIsSwitchOn(response.data.data.status);
        }
      })
      .catch((error) => {
        console.error("Error updating device status:", error);
        setIsSwitchOn(!newStatus);
      });
  };

  return (
    <div className="font-poppins flex flex-col justify-center px-4 mt-10">
      <div className="rounded-lg shadow-md bg-white p-6 w-full mb-4 flex flex-col md:flex-row">
        <div className="flex-grow">
          <div className="text-2xl md:text-3xl mb-4 text-black font-semibold">Information</div>
          <div className="switch-container mt-4">
            <label htmlFor="toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                {/* Switch */}
                <input id="toggle" type="checkbox" className="sr-only" checked={isSwitchOn} onChange={toggleSwitch} />
                <div className={`block w-14 h-8 rounded-full transition duration-300 ease-in-out ${isSwitchOn ? "bg-green-500" : "bg-gray-600"}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transform transition duration-300 ease-in-out ${isSwitchOn ? "translate-x-6" : ""}`}></div>
              </div>
            </label>
          </div>
          <div className="text-base md:text-lg text-start font-semibold text-[#A78BFA] mt-4">
            Device ID : <span className="font-bold">{deviceData ? deviceData.deviceId : "..."}</span>
          </div>
          <div className="text-base md:text-lg text-start font-semibold text-[#A78BFA] mt-2">
            Name : <span className="font-bold">{deviceData ? deviceData.name : "..."}</span>
          </div>
          <div className="text-base md:text-lg text-start font-semibold text-[#A78BFA] mt-2">
            API Key : {showApiKey ? <span className="font-bold">{deviceData ? deviceData.apiKey : "..."}</span> : <span className="font-bold"> ******-******-******-******</span>}
            <span onClick={toggleApiKeyVisibility} aria-label={showApiKey ? "Show API Key" : "Hide API Key"} className="cursor-pointer ml-2" style={{ color: showApiKey ? "#A78BFA" : "#A78BFA" }}>
              <FontAwesomeIcon icon={showApiKey ? faEyeSlash : faEye} />
            </span>
          </div>
        </div>
        <div className="flex-grow mt-6 md:mt-0">
          <div className="text-2xl md:text-3xl text-black font-semibold">Suhu</div>
          <div className="text-4xl md:text-5xl text-start font-bold text-[#A78BFA] mt-2">{sensorData ? `${sensorData.suhu} C` : "..."}</div>
          <div className="text-2xl md:text-3xl text-black font-semibold mt-6">Kelembapan</div>
          <div className="text-4xl md:text-5xl text-start font-bold text-[#A78BFA] mt-2">{sensorData ? `${sensorData.kelembapan} Rh` : "..."}</div>
        </div>
      </div>
      {latitude !== "..." && longitude !== "..." && (
        <div className="mt-2">
          <MapContainer className="rounded-xl" center={[parseFloat(latitude), parseFloat(longitude)]} zoom={9} style={{ height: "400px", width: "100%" }} scrollWheelZoom={false} dragging={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[parseFloat(latitude), parseFloat(longitude)]} icon={customIcon}>
              <Popup>
                <div className="mb-2">{deviceData.location}</div>
                {latitude},{longitude}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Information;
