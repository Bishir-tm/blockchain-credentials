import React, { useState } from "react";
import axios from "axios";
import QRGenerator from "./QRGenerator";
import { User, GraduationCap, Calendar, Hash, Download } from "lucide-react";

function IssueCredential() {
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    degree: "",
    graduationDate: "",
    institution: "Tech University",
  });
  const [issuedCertificate, setIssuedCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/certificates/issue",
        formData
      );

      if (response.data.success) {
        setIssuedCertificate(response.data.certificate);
        setFormData({
          studentName: "",
          studentId: "",
          degree: "",
          graduationDate: "",
          institution: "Tech University",
        });
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to issue certificate");
    }

    setLoading(false);
  };

  const downloadCertificate = () => {
    if (!issuedCertificate) return;

    const certificateData = {
      ...issuedCertificate,
      qrCodeData: issuedCertificate.verificationUrl,
    };

    const dataStr = JSON.stringify(certificateData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `certificate_${issuedCertificate.studentName.replace(
      /\s+/g,
      "_"
    )}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (issuedCertificate) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            ✅ Certificate Issued Successfully!
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Certificate Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-600 mr-3" />
                  <span>
                    <strong>Student:</strong> {issuedCertificate.studentName}
                  </span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 text-gray-600 mr-3" />
                  <span>
                    <strong>Degree:</strong> {issuedCertificate.degree}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                  <span>
                    <strong>Graduation:</strong>{" "}
                    {issuedCertificate.graduationDate}
                  </span>
                </div>
                <div className="flex items-start">
                  <Hash className="w-5 h-5 text-gray-600 mr-3 mt-1" />
                  <div>
                    <strong>Certificate Hash:</strong>
                    <br />
                    <code className="text-sm bg-gray-100 p-1 rounded break-all">
                      {issuedCertificate.certificateHash}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                QR Code for Verification
              </h3>
              <QRGenerator value={issuedCertificate.verificationUrl} />
              <p className="text-sm text-gray-600 mt-3">
                Scan this QR code or visit:
                <br />
                <a
                  href={issuedCertificate.verificationUrl}
                  className="text-blue-600 hover:underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {issuedCertificate.verificationUrl}
                </a>
              </p>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={downloadCertificate}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Certificate Data
            </button>
            <button
              onClick={() => setIssuedCertificate(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Issue Another Certificate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Issue New Certificate
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Student Name
          </label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Student ID
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="STU001"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Degree
          </label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Degree</option>
            <option value="Bachelor of Computer Science">
              Bachelor of Computer Science
            </option>
            <option value="Bachelor of Engineering">
              Bachelor of Engineering
            </option>
            <option value="Bachelor of Business Administration">
              Bachelor of Business Administration
            </option>
            <option value="Master of Science">Master of Science</option>
            <option value="Master of Business Administration">
              Master of Business Administration
            </option>
            <option value="Doctor of Philosophy">Doctor of Philosophy</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Graduation Date
          </label>
          <input
            type="date"
            name="graduationDate"
            value={formData.graduationDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Institution
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            readOnly
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Issuing Certificate..." : "Issue Certificate"}
        </button>
      </form>
    </div>
  );
}

export default IssueCredential;
