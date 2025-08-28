import React, { useState, useEffect } from "react";
import axios from "axios";
import { Key, Shield } from "lucide-react";

function AdminLogin({ onLogin }) {
  const [address, setAddress] = useState("");
  const [adminAddress, setAdminAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminAddress();
  }, []);

  const fetchAdminAddress = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/admin/address"
      );
      setAdminAddress(response.data.adminAddress);
    } catch (error) {
      console.error("Error fetching admin address:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/admin/login",
        {
          address: address,
        }
      );

      if (response.data.success) {
        onLogin(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-600">Enter your authorized address</p>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            Authorized Admin Address:
          </p>
          <p className="text-sm font-mono break-all text-blue-600">
            {adminAddress || "Loading..."}
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <Key className="w-4 h-4 inline mr-2" />
              Ethereum Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="0x..."
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>For demo purposes, use the admin address shown above</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
