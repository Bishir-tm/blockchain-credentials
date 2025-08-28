import React, { useState } from "react";
import IssueCredential from "./IssueCredential";
import { FileText, Users, Shield, Award } from "lucide-react";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("issue");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("issue")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "issue"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Award className="w-5 h-5 inline mr-2" />
              Issue Certificate
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Dashboard
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "issue" && <IssueCredential />}

          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Admin Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        System Status
                      </h3>
                      <p className="text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Certificates
                      </h3>
                      <p className="text-gray-600">Issue new credentials</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Institution
                      </h3>
                      <p className="text-gray-600">Tech University</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
