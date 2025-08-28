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

// Issue certificate
app.post("/api/certificates/issue", async (req, res) => {
  try {
    const { studentName, studentId, degree, graduationDate, institution } =
      req.body;

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

    const result = await blockchain.issueCertificate(certificateData);

    if (result.success) {
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
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify certificate
app.get("/api/certificates/verify/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await blockchain.verifyCertificate(id);
    res.json(result);
  } catch (error) {
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

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
