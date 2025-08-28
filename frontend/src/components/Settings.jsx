import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Building } from "lucide-react";

function Settings() {
  const [institutionName, setInstitutionName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load saved institution name
    const saved = localStorage.getItem("institutionName");
    setInstitutionName(saved || "Tech University");
  }, []);

  const handleSave = () => {
    if (!institutionName.trim()) {
      setMessage("Institution name cannot be empty");
      return;
    }

    setIsSaving(true);
    // Save to localStorage (simple solution)
    localStorage.setItem("institutionName", institutionName.trim());

    setTimeout(() => {
      setIsSaving(false);
      setMessage("Institution name saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <SettingsIcon className="w-6 h-6 mr-2" />
        Settings
      </h2>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <Building className="w-4 h-4 inline mr-2" />
            Institution Name
          </label>
          <input
            type="text"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter institution name"
          />
          <p className="text-sm text-gray-600 mt-2">
            This name will appear on all certificates and official documents.
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Preview</h3>
        <p className="text-blue-700">
          Certificates will show:{" "}
          <strong>{institutionName || "Tech University"}</strong>
        </p>
      </div>
    </div>
  );
}

export default Settings;
