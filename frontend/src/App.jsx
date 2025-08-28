import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import VerifyCredential from "./components/VerifyCredential";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800">
                  Academic Credential Verification System
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </a>
                <a href="/verify" className="text-gray-600 hover:text-gray-900">
                  Verify
                </a>
                <a href="/admin" className="text-gray-600 hover:text-gray-900">
                  Admin
                </a>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-white">
                  <h1 className="text-4xl font-bold mb-4">
                    Blockchain Academic Credentials
                  </h1>
                  <p className="text-xl mb-8">
                    Secure, tamper-proof academic credential verification
                  </p>
                  <div className="space-x-4">
                    <a
                      href="/verify"
                      className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
                    >
                      Verify Certificate
                    </a>
                    <a
                      href="/admin"
                      className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
                    >
                      Admin Login
                    </a>
                  </div>
                </div>
              </div>
            }
          />

          <Route path="/verify" element={<VerifyCredential />} />

          <Route
            path="/admin"
            element={
              isAuthenticated ? (
                <AdminDashboard />
              ) : (
                <AdminLogin onLogin={setIsAuthenticated} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
