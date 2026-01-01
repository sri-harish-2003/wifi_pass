import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [countdown, setCountdown] = useState(60);

  // Get the actual URL for QR code (replace localhost with your server IP)
  const qrUrl = window.location.origin;

  // Countdown timer for access granted screen
  useEffect(() => {
    let timer;
    if (step === 3 && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (step === 3 && countdown === 0) {
      // Redirect to login page when countdown completes
      setStep(1);
      setCountdown(60);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const sendOtp = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/send-otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      console.warn("No JSON response from backend");
    }

    console.log("STATUS:", res.status);
    console.log("DATA:", data);

    if (res.ok) {
      setModalMessage("OTP has been sent to your email 📩");
      setModalType("success");
      setShowModal(true);
      setStep(2);
    } else {
      setModalMessage(data.error || "Failed to send OTP");
      setModalType("error");
      setShowModal(true);
    }
  } catch (err) {
    console.error("FETCH ERROR:", err);
    setModalMessage("Server error. Try again later.");
    setModalType("error");
    setShowModal(true);
  }
};


  const verifyOtp = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.verified) {
        setWifiPassword(data.wifi_password);
        setStep(3);
      } else {
        setModalMessage("Invalid OTP ❌");
        setModalType("error");
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage("Verification failed. Try again.");
      setModalType("error");
      setShowModal(true);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">📶 Wi-Fi Access</h2>

        {step === 1 && (
          <>
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={sendOtp}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Verify OTP</h3>

            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={verifyOtp}>Verify</button>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="success">✅ Access Granted</h3>
            <p className="label">Wi-Fi Network</p>
            <div className="network-name">Zigma New Office</div>
            
            <p className="label" style={{ marginTop: "16px" }}>Password</p>
            <div className="password">{wifiPassword}</div>

            <div style={{ marginTop: "16px", textAlign: "center", padding: "12px", backgroundColor: "#f0f9ff", borderRadius: "8px" }}>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 8px 0" }}>Redirecting in</p>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: "#0066cc", margin: "0" }}>{countdown}s</p>
            </div>

            <button 
              onClick={() => {
                setStep(1);
                setCountdown(60);
              }}
              style={{ marginTop: "16px", background: "#6b7280" }}
            >
              Request Access Again
            </button>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className={`modal ${modalType}`}>
            <h3>{modalType === "success" ? "Success" : "Error"}</h3>
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
