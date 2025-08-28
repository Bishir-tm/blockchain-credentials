import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Eye,
  Printer,
  Calendar,
  User,
  GraduationCap,
  Hash,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

function CertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/admin/certificates"
      );
      setCertificates(response.data.certificates);
      setError("");
    } catch (error) {
      setError("Failed to fetch certificates");
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewCertificate = async (certificateId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/certificates/${certificateId}`
      );
      setSelectedCertificate(response.data);
    } catch (error) {
      console.error("Error fetching certificate details:", error);
    }
  };

  const printCertificate = (certificate) => {
    // Get current institution name
    const institutionName =
      localStorage.getItem("institutionName") || "Tech University";

    const printWindow = window.open("", "_blank");
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Academic Certificate</title>
        <style>
          @page { margin: 1in; }
          body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.6; 
            color: #333;
            background: white;
          }
          .certificate { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px;
            border: 3px solid #2563eb;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            position: relative;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 1px solid #cbd5e1;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px;
            position: relative;
            z-index: 1;
          }
          .institution { 
            font-size: 32px; 
            font-weight: bold; 
            color: #1e40af;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .subtitle { 
            font-size: 18px; 
            color: #64748b;
            margin-bottom: 30px;
          }
          .title { 
            font-size: 28px; 
            font-weight: bold; 
            text-align: center; 
            margin: 40px 0;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .content { 
            text-align: center; 
            font-size: 18px; 
            margin: 30px 0;
            position: relative;
            z-index: 1;
          }
          .student-name { 
            font-size: 32px; 
            font-weight: bold; 
            color: #dc2626;
            margin: 20px 0;
            text-decoration: underline;
            text-decoration-color: #dc2626;
          }
          .degree { 
            font-size: 24px; 
            font-weight: bold; 
            color: #1e40af;
            margin: 20px 0;
          }
          .footer { 
            margin-top: 60px; 
            display: flex; 
            justify-content: space-between;
            position: relative;
            z-index: 1;
          }
          .signature-section { 
            text-align: center; 
            width: 200px;
          }
          .signature-line { 
            border-top: 2px solid #374151; 
            margin-bottom: 10px;
            padding-top: 40px;
          }
          .details { 
            margin: 30px 0; 
            text-align: left;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .detail-row { 
            margin: 15px 0; 
            font-size: 14px;
            display: flex;
            justify-content: space-between;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(37, 99, 235, 0.1);
            font-weight: bold;
            z-index: 0;
            user-select: none;
            pointer-events: none;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="watermark">VERIFIED</div>
          
          <div class="header">
            <div class="institution">${institutionName}</div>
            <div class="subtitle">Blockchain Verified Academic Credential</div>
          </div>
          
          <div class="title">Certificate of Achievement</div>
          
          <div class="content">
            <p style="font-size: 20px; margin-bottom: 30px;">
              This is to certify that
            </p>
            
            <div class="student-name">${certificate.studentName}</div>
            
            <p style="font-size: 20px; margin: 30px 0;">
              has successfully completed the requirements for the degree of
            </p>
            
            <div class="degree">${certificate.degree}</div>
            
            <p style="font-size: 18px; margin: 30px 0;">
              and is hereby awarded this certificate on
            </p>
            
            <p style="font-size: 20px; font-weight: bold; color: #1e40af;">
              ${new Date(certificate.graduationDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span><strong>Certificate ID:</strong></span>
              <span style="font-family: monospace; font-size: 12px;">${
                certificate.certificateId || "N/A"
              }</span>
            </div>
            <div class="detail-row">
              <span><strong>Issue Date:</strong></span>
              <span>${new Date(
                parseInt(certificate.issueTimestamp) * 1000
              ).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span><strong>Blockchain Hash:</strong></span>
              <span style="font-family: monospace; font-size: 10px; word-break: break-all;">${
                certificate.certificateHash
              }</span>
            </div>
            <div class="detail-row">
              <span><strong>Verification:</strong></span>
              <span>Blockchain Verified & Tamper-Proof</span>
            </div>
          </div>
          
          <div class="footer">
            <div class="signature-section">
              <div class="signature-line"></div>
              <div style="font-weight: bold;">Registrar</div>
              <div style="font-size: 14px; color: #64748b;">Academic Office</div>
            </div>
            
            <div class="signature-section">
              <div class="signature-line"></div>
              <div style="font-weight: bold;">Dean</div>
              <div style="font-size: 14px; color: #64748b;">${institutionName}</div>
            </div>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Print Certificate
          </button>
          <button onclick="window.close()" style="background: #64748b; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const formatTimestamp = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading certificates...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Issued Certificates
        </h2>
        <button
          onClick={fetchCertificates}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No certificates have been issued yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((certificate) => (
            <div
              key={certificate.certificateId}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                <div className="lg:col-span-2">
                  <div className="flex items-center mb-3">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {certificate.studentName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-gray-600 mr-2" />
                      <span>{certificate.degree}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                      <span>Graduated: {certificate.graduationDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Hash className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-xs font-mono truncate">
                        {certificate.certificateId}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                      <span>
                        Issued: {formatTimestamp(certificate.issueTimestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => viewCertificate(certificate.certificateId)}
                    className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>

                  <button
                    onClick={() => printCertificate(certificate)}
                    className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Certificate
                  </button>

                  <a
                    href={`/verify?id=${certificate.certificateId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Verify
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Details Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Certificate Details
                </h3>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student Name
                    </label>
                    <p className="text-lg font-semibold">
                      {selectedCertificate.studentName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Degree
                    </label>
                    <p className="text-lg">{selectedCertificate.degree}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Graduation Date
                    </label>
                    <p>{selectedCertificate.graduationDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Institution
                    </label>
                    <p>{selectedCertificate.institution}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Certificate ID
                  </label>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {selectedCertificate.certificateId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Blockchain Hash
                  </label>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {selectedCertificate.certificateHash}
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QR Code
                    </label>
                    <img
                      src={selectedCertificate.qrCode}
                      alt="QR Code"
                      className="mx-auto border rounded"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => printCertificate(selectedCertificate)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Print Certificate
                  </button>
                  <a
                    href={selectedCertificate.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-center"
                  >
                    Verify Online
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateList;
