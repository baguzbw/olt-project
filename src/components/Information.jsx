import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Information = () => {
  const { id } = useParams();
  const [deviceData, setDeviceData] = useState(null);
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}device/get/${id}`)
      .then((response) => {
        if (response.data && response.data.data) {
          setDeviceData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching device data:", error);
      });

    axios
      .get(`${API_BASE_URL}sensor/get/${id}`)
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

  return (
    <div className="font-poppins flex flex-col justify-center p-4 mt-6">
      <div className="rounded-lg shadow-md bg-white p-6 w-full max-w-full mb-4 flex">
        <div className="flex-grow">
          <div className="text-3xl mb-4 text-black font-semibold">Information</div>
          <div className="text-lg text-start font-semibold text-[#A78BFA]">
            Name : <span className="font-bold">{deviceData ? deviceData.name : "..."}</span>
          </div>
          <div className="text-lg text-start font-semibold text-[#A78BFA] mt-2">
            Location : <span className="font-bold">{deviceData ? deviceData.location : "..."}</span>
          </div>
          <div className="text-lg text-start font-semibold text-[#A78BFA] mt-2">
            Latitude : <span className="font-bold">{deviceData ? deviceData.latitude : "..."}</span>
          </div>
          <div className="text-lg text-start font-semibold text-[#A78BFA] mt-2">
            Longitude : <span className="font-bold">{deviceData ? deviceData.longitude : "..."}</span>
          </div>
        </div>
        <div className="flex-grow">
          <div className="text-3xl mt-2 text-black font-semibold">Suhu</div>
          <div className="text-5xl text-start font-bold text-[#A78BFA] mt-8">{sensorData ? sensorData.suhu + " C" : "..."}</div>
        </div>
      </div>
      {latitude !== "..." && longitude !== "..." && (
        <div className="mt-4">
          <MapContainer className="rounded-xl" center={[parseFloat(latitude), parseFloat(longitude)]} zoom={10} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            <Marker position={[parseFloat(latitude), parseFloat(longitude)]}></Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Information;
