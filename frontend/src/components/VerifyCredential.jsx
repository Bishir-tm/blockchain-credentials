import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  GraduationCap,
  User,
  Hash,
} from "lucide-react";

function VerifyCredential() {
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for certificate ID in URL params (from QR code)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setCertificateId(id);
      handleVerify(id);
    }
  }, []);

  const handleVerify = async (id = certificateId) => {
    if (!id.trim()) {
      setError("Please enter a certificate ID");
      return;
    }

    setLoading(true);
    setError("");
    setVerificationResult(null);

    try {
      const response = await axios.get(
        `http://localhost:3001/api/certificates/verify/${id}`
      );
      setVerificationResult(response.data);
    } catch (error) {
      setError(error.response?.data?.error || "Verification failed");
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  const formatTimestamp = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <Search className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">
              Verify Certificate
            </h1>
            <p className="text-gray-600 mt-2">
              Enter certificate ID or scan QR code to verify authenticity
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex space-x-4">
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter certificate ID"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {verificationResult && (
            <div
              className={`p-6 rounded-lg border-2 ${
                verificationResult.exists
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center mb-4">
                {verificationResult.exists ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-xl font-bold text-green-800">
                        ✅ Certificate Verified
                      </h3>
                      <p className="text-green-600">
                        This certificate is authentic and valid
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <h3 className="text-xl font-bold text-red-800">
                        ❌ Certificate Not Found
                      </h3>
                      <p className="text-red-600">
                        This certificate could not be verified
                      </p>
                    </div>
                  </>
                )}
              </div>

              {verificationResult.exists && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <span className="font-semibold">Student Name:</span>
                        <br />
                        {verificationResult.studentName}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <span className="font-semibold">Degree:</span>
                        <br />
                        {verificationResult.degree}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <span className="font-semibold">Graduation Date:</span>
                        <br />
                        {verificationResult.graduationDate}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <span className="font-semibold">Issue Date:</span>
                        <br />
                        {formatTimestamp(verificationResult.issueTimestamp)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start">
                      <Hash className="w-5 h-5 text-gray-600 mr-3 mt-1" />
                      <div>
                        <span className="font-semibold">Blockchain Hash:</span>
                        <br />
                        <code className="text-sm bg-gray-100 p-2 rounded break-all block mt-1">
                          {verificationResult.certificateHash}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded">
                    <strong>Verification Details:</strong>
                    <br />
                    This certificate has been cryptographically verified on the
                    blockchain. The hash above proves the certificate data has
                    not been tampered with since it was issued by{" "}
                    {verificationResult.institution}.
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              This verification system uses blockchain technology to ensure the
              authenticity and immutability of academic credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyCredential;
