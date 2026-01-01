export default function QRPrint() {
  // Change this to your actual server IP or domain
  const serverUrl = "http://192.168.1.100:5173"; // Change 192.168.1.100 to your actual IP
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-print-page">
      <div className="qr-print-card">
        <h1>📶 Wi-Fi Access</h1>
        <p className="network-name-large">Zigma New Office</p>
        
        <div className="qr-print-container">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(serverUrl)}`}
            alt="QR Code for Wi-Fi Access"
            className="qr-print-image"
          />
        </div>
        
        <p className="instruction">
          Scan this QR code to request Wi-Fi access
        </p>
        
        <div className="button-group">
          <button onClick={handlePrint} className="print-btn">
            🖨️ Print QR Code
          </button>
          <p className="hint">Print and display on your office board</p>
        </div>
      </div>
    </div>
  );
}
