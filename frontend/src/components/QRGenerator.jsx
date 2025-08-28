import React from "react";
import { QRCodeSVG } from "qrcode.react";

function QRGenerator({ value, size = 200 }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <QRCodeSVG value={value} size={size} level="H" includeMargin={true} />
      </div>
    </div>
  );
}

export default QRGenerator;
