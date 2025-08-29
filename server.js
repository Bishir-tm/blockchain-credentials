const express = require("express");
const cors = require("cors");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const BlockchainService = require("./blockchain");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const blockchain = new BlockchainService();

// Admin authentication endpoint
app.post("/api/admin/login", async (req, res) => {
  try {
    const { address } = req.body;
    const adminAddress = await blockchain.getAdminAddress();

    if (address.toLowerCase() === adminAddress.toLowerCase()) {
      res.json({ success: true, message: "Admin authenticated" });
    } else {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get admin address
app.get("/api/admin/address", async (req, res) => {
  try {
    const adminAddress = await blockchain.getAdminAddress();
    res.json({ adminAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all certificates issued by admin
app.get("/api/admin/certificates", async (req, res) => {
  try {
    console.log("Fetching certificates issued by admin...");

    // Check if pagination parameters are provided
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 100; // Default to 100 for "all"

    if (req.query.paginated === "true") {
      console.log(
        `Fetching paginated certificates: offset=${offset}, limit=${limit}`
      );
      const result = await blockchain.getCertificatesPaginated(offset, limit);
      console.log(
        `Paginated certificates fetched: ${result.certificates.length}/${result.total}`
      );
      res.json(result);
    } else {
      console.log("Fetching all certificates...");
      const certificates = await blockchain.getCertificatesByAdmin();
      console.log("Certificates fetched:", certificates.length);
      res.json({
        certificates,
        total: certificates.length,
      });
    }
  } catch (error) {
    console.error("Error in /api/admin/certificates:", error);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Get certificate count only (for quick metrics)
app.get("/api/admin/certificates/count", async (req, res) => {
  try {
    console.log("Fetching certificate count...");
    const count = await blockchain.getCertificateCount();
    console.log("Certificate count:", count);
    res.json({ count });
  } catch (error) {
    console.error("Error getting certificate count:", error);
    res.status(500).json({ error: error.message });
  }
});

// Issue certificate
app.post("/api/certificates/issue", async (req, res) => {
  try {
    const { studentName, studentId, degree, graduationDate, institution } =
      req.body;

    console.log("Issuing certificate for:", studentName);

    const certificateId = uuidv4();
    const certificateData = {
      certificateId,
      studentId,
      studentName,
      degree,
      graduationDate,
      institution,
      issueDate: new Date().toISOString().split("T")[0],
    };

    console.log("Certificate data:", certificateData);

    const result = await blockchain.issueCertificate(certificateData);

    if (result.success) {
      console.log("Certificate issued successfully:", result.certificateId);

      // Generate QR code
      const verificationUrl = `http://localhost:5173/verify?id=${certificateId}`;
      const qrCode = await QRCode.toDataURL(verificationUrl);

      res.json({
        success: true,
        certificate: {
          ...certificateData,
          certificateHash: result.certificateHash,
          transactionHash: result.transactionHash,
          qrCode,
          verificationUrl,
        },
      });
    } else {
      console.error("Certificate issuance failed:", result.error);
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error in certificate issuance:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify certificate
app.get("/api/certificates/verify/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Verifying certificate:", id);

    const result = await blockchain.verifyCertificate(id);

    if (result.exists) {
      console.log("Certificate verified successfully:", id);
    } else {
      console.log("Certificate not found:", id);
    }

    res.json(result);
  } catch (error) {
    console.error("Error verifying certificate:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single certificate details for admin
app.get("/api/certificates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching certificate details:", id);

    const result = await blockchain.verifyCertificate(id);

    if (result.exists) {
      const verificationUrl = `http://localhost:5173/verify?id=${id}`;
      const qrCode = await QRCode.toDataURL(verificationUrl);

      console.log("Certificate details retrieved:", id);

      res.json({
        ...result,
        certificateId: id,
        qrCode,
        verificationUrl,
      });
    } else {
      console.log("Certificate not found for details:", id);
      res.status(404).json({ error: "Certificate not found" });
    }
  } catch (error) {
    console.error("Error getting certificate details:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get blockchain accounts (for demo purposes)
app.get("/api/accounts", async (req, res) => {
  try {
    const accounts = await blockchain.getAccounts();
    res.json({ accounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEW: Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const accounts = await blockchain.getAccounts();
    const adminAddress = await blockchain.getAdminAddress();
    const certificateCount = await blockchain.getCertificateCount();

    res.json({
      status: "healthy",
      blockchain: {
        connected: true,
        accounts: accounts.length,
        adminAddress,
        certificateCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});
