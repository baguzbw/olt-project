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

  useEffect(() => {
    const apiKey = Cookies.get("token");
    axios
      .get(`${API_BASE_URL}device/get/${id}`, {
        params: {
          apiKey: apiKey,
        },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setDeviceData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching device data:", error);
      });

    axios
      .get(`${API_BASE_URL}sensor/get/${id}`, {
        params: {
          apiKey: apiKey,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setSensorData(response.data.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching sensor data:", error);
      });
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

  return (
    <div className="font-poppins flex flex-col justify-center px-4 mt-10">
      <div className="rounded-lg shadow-md bg-white p-6 w-full mb-4 flex flex-col md:flex-row">
        <div className="flex-grow">
          <div className="text-2xl md:text-3xl mb-4 text-black font-semibold">Information</div>
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
          <div className="text-4xl md:text-5xl text-start font-bold text-[#A78BFA] mt-2">{sensorData ? `${sensorData.suhu} C` : "..."}</div>
        </div>
      </div>
      {latitude !== "..." && longitude !== "..." && (
        <div className="mt-2">
          <MapContainer className="rounded-xl" center={[parseFloat(latitude), parseFloat(longitude)]} zoom={10} style={{ height: "400px", width: "100%" }}>
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
