import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Navbar from "./Navbar";

function Update() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        const userId = Cookies.get("userId");
        const apiKey = Cookies.get("token");

        const response = await axios.get(`${API_BASE_URL}user/get/${userId}?apiKey=${apiKey}`);
        const userData = response.data.data;

        setUsername(userData.username);
        setSuccess("");
        setError("");
      } catch (error) {
        setError("Fetch user data error: " + (error.response ? error.response.data.message : error.message));
      }
      setLoading(false);
    }

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = Cookies.get("userId");
      const apiKey = Cookies.get("token");

      await axios.patch(`${API_BASE_URL}user/update/${userId}?apiKey=${apiKey}`, {
        username,
        password,
      });

      setSuccess("Akun sudah berhasil diperbarui");
      setPassword("");
    } catch (error) {
      setError("Update error: " + (error.response ? error.response.data.message : error.message));
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <section className="flex items-center justify-center h-screen w-screen">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-96">
          <div className="text-black mt-8 justify-center text-center px-6 text-2xl font-semibold">Profile</div>
          <div className="py-8 px-6 md:px-8">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleUpdate}>
                {success && <div className="text-sm text-center text-green-600">{success}</div>}
                {error && <div className="text-sm text-center text-red-600">{error}</div>}
                <input
                  className="block w-full px-4 py-3 mt-4 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  className="block w-full px-4 py-3 mt-4 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="block w-full px-4 py-3 mt-4 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition duration-300 ease-in-out transform" type="submit">
                  Update
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Update;
