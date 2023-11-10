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
          <div>
            <input
              className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            />
            <label className="inline-block pl-[0.15rem] hover:cursor-pointer text-[#A78BFA] font-semibold" htmlFor="flexSwitchCheckDefault">
              RELAY
            </label>
          </div>

          <div className="text-base md:text-lg text-start font-semibold text-[#A78BFA] mt-2">
            Device ID : <span className="font-bold">{deviceData ? deviceData.deviceId : "..."}</span>
          </div>
          <div className="text-base md:text-lg text-start font-semibold text-[#A78BFA] mt-2">
            Name : <span className="font-bold">{deviceData ? deviceData.name : "..."}</span>
          </div>
          <div className="text-base md:text-lg text-start font-semibold text-[#A78BFA] mt-2">
            API Key : <span className="font-bold">{deviceData ? deviceData.apiKey : "..."}</span>
          </div>
        </div>
        <div className="flex-grow mt-6 md:mt-0">
          <div className="text-2xl md:text-3xl text-black font-semibold">Suhu</div>
          <div className="text-4xl md:text-5xl text-start font-bold text-[#A78BFA] mt-8">{sensorData ? `${sensorData.suhu} C` : "..."}</div>
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
