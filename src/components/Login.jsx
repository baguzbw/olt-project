import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import LogoCleon from "./assets/logo_cleon.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}user/login`, {
        username,
        password,
      });
      const { data } = response.data;

      Cookies.set("userId", data.userId, { expires: 7, secure: true });
      Cookies.set("token", data.token, { expires: 7, secure: true });
      Cookies.set("role", data.role, { expires: 7, secure: true });

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <section className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-96">
        <div className="py-8 px-6 md:px-8">
          <img src={LogoCleon} alt="Cleon" className="mx-auto mb-6 h-20 w-auto" />
          <h1 className="text-2xl font-semibold text-gray-700 text-center">Log In</h1>
          <form className="mt-8" onSubmit={handleLogin}>
            <input
              className="block w-full px-4 py-2 mt-4 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="block w-full px-4 py-2 mt-4 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="block w-full px-4 py-2 mt-4 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700 focus:outline-none" type="submit">
              Log In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
