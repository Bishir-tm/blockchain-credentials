import React, { useState, useEffect } from "react";
import IssueCredential from "./IssueCredential";
import CertificateList from "./CertificateList";
import Settings from "./Settings";
import axios from "axios";
import {
  FileText,
  Users,
  Shield,
  Award,
  List,
  Settings as SettingsIcon,
  BarChart3,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState({
    totalCertificates: 0,
    recentCertificates: [],
    systemStatus: "checking",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Add refresh when switching back to dashboard
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching dashboard data...");

      // First check if the server is running
      const response = await axios.get(
        "http://localhost:3001/api/admin/certificates",
        {
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("Response received:", response.data);

      const certificates = response.data.certificates || [];
      console.log("Certificates count:", certificates.length);

      // Get recent certificates (last 5)
      const recentCertificates = certificates
        .sort((a, b) => {
          const timestampA = parseInt(a.issueTimestamp) || 0;
          const timestampB = parseInt(b.issueTimestamp) || 0;
          return timestampB - timestampA;
        })
        .slice(0, 5);

      setDashboardStats({
        totalCertificates: certificates.length,
        recentCertificates,
        systemStatus: "active",
      });

      console.log("Dashboard stats updated:", {
        total: certificates.length,
        recent: recentCertificates.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      let errorMessage = "Failed to fetch dashboard data";
      if (
        error.code === "ECONNREFUSED" ||
        error.message.includes("Network Error")
      ) {
        errorMessage =
          "Cannot connect to server. Make sure the backend server is running on port 3001.";
      } else if (error.response) {
        errorMessage = error.response.data?.error || error.response.statusText;
      }

      setError(errorMessage);
      setDashboardStats((prev) => ({
        ...prev,
        systemStatus: "error",
        totalCertificates: 0,
        recentCertificates: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
      red: "bg-red-50 text-red-600 border-red-200",
    };

    return (
      <div className={`p-6 rounded-lg border-2 ${colors[color]}`}>
        <div className="flex items-center">
          <Icon className="w-8 h-8 mr-4" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("issue")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "issue"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Award className="w-5 h-5 inline mr-2" />
              Issue Certificate
            </button>

            <button
              onClick={() => setActiveTab("certificates")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "certificates"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="w-5 h-5 inline mr-2" />
              View Certificates
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <SettingsIcon className="w-5 h-5 inline mr-2" />
              Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "dashboard" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Admin Dashboard
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </button>
                  <div className="text-sm text-gray-600">
                    Last updated: {new Date().toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Show connection error prominently */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <div>
                    <p className="font-semibold">Connection Error</p>
                    <p className="text-sm">{error}</p>
                    <div className="mt-2 text-sm">
                      <p>Make sure:</p>
                      <ul className="list-disc list-inside ml-2">
                        <li>
                          Backend server is running: <code>npm run dev</code>
                        </li>
                        <li>
                          Hardhat node is running: <code>npx hardhat node</code>
                        </li>
                        <li>
                          Contract is deployed: <code>npm run deploy</code>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3">Loading dashboard data...</span>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                      icon={FileText}
                      title="Total Certificates"
                      value={dashboardStats.totalCertificates}
                      subtitle="Issued certificates"
                      color="blue"
                    />

                    <StatCard
                      icon={Shield}
                      title="System Status"
                      value={
                        dashboardStats.systemStatus === "active"
                          ? "Online"
                          : dashboardStats.systemStatus === "checking"
                          ? "Checking..."
                          : "Offline"
                      }
                      subtitle={
                        dashboardStats.systemStatus === "active"
                          ? "Blockchain connected"
                          : dashboardStats.systemStatus === "checking"
                          ? "Connecting..."
                          : "Connection failed"
                      }
                      color={
                        dashboardStats.systemStatus === "active"
                          ? "green"
                          : dashboardStats.systemStatus === "checking"
                          ? "orange"
                          : "red"
                      }
                    />

                    <StatCard
                      icon={Users}
                      title="Institution"
                      value={
                        localStorage.getItem("institutionName") ||
                        "Tech University"
                      }
                      subtitle="Current institution"
                      color="purple"
                    />

                    <StatCard
                      icon={TrendingUp}
                      title="This Month"
                      value={
                        dashboardStats.recentCertificates.filter((cert) => {
                          try {
                            const certDate = new Date(
                              parseInt(cert.issueTimestamp) * 1000
                            );
                            const now = new Date();
                            return (
                              certDate.getMonth() === now.getMonth() &&
                              certDate.getFullYear() === now.getFullYear()
                            );
                          } catch (e) {
                            return false;
                          }
                        }).length
                      }
                      subtitle="Certificates issued"
                      color="green"
                    />
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Recent Certificates (
                        {dashboardStats.recentCertificates.length})
                      </h3>

                      {dashboardStats.recentCertificates.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No certificates issued yet</p>
                          <button
                            onClick={() => setActiveTab("issue")}
                            className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Issue your first certificate →
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {dashboardStats.recentCertificates.map(
                            (cert, index) => (
                              <div
                                key={cert.certificateId || index}
                                className="bg-white p-4 rounded border"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {cert.studentName || "Unknown Student"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {cert.degree || "Unknown Degree"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      {formatTimestamp(cert.issueTimestamp)}
                                    </p>
                                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                  </div>
                                </div>
                              </div>
                            )
                          )}

                          <button
                            onClick={() => setActiveTab("certificates")}
                            className="w-full text-center py-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View all certificates →
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Quick Actions
                      </h3>

                      <div className="space-y-3">
                        <button
                          onClick={() => setActiveTab("issue")}
                          className="w-full flex items-center justify-between p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <Award className="w-5 h-5 mr-3" />
                            <span>Issue New Certificate</span>
                          </div>
                          <span>→</span>
                        </button>

                        <button
                          onClick={() => setActiveTab("certificates")}
                          className="w-full flex items-center justify-between p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <List className="w-5 h-5 mr-3" />
                            <span>View All Certificates</span>
                          </div>
                          <span>→</span>
                        </button>

                        <button
                          onClick={() => setActiveTab("settings")}
                          className="w-full flex items-center justify-between p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <SettingsIcon className="w-5 h-5 mr-3" />
                            <span>Configure Settings</span>
                          </div>
                          <span>→</span>
                        </button>

                        <a
                          href="/verify"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <Shield className="w-5 h-5 mr-3" />
                            <span>Test Verification</span>
                          </div>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* System Information */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      System Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 font-medium">
                          Blockchain Network:
                        </span>
                        <p className="text-blue-600">Localhost (Development)</p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Smart Contract:
                        </span>
                        <p className="text-blue-600 font-mono text-xs">
                          AcademicCredentials.sol
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Security:
                        </span>
                        <p className="text-blue-600">Blockchain Verified</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "issue" && (
            <IssueCredential onCertificateIssued={() => fetchDashboardData()} />
          )}
          {activeTab === "certificates" && <CertificateList />}
          {activeTab === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
