import { useState } from "react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:9999/u/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password,username }),
        credentials:"include"
      });
      console.log(res);
      let data=await res.json()
      if (res.ok) {
        setMessage("✅ Signup Successful! Please log in.");
        setFullName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("⚠️ Something went wrong!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Signup</h2>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              border: "1px solid black",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              border: "1px solid black",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              border: "1px solid black",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              border: "1px solid black",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Signup
        </button>
      </form>
      {message && (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>{message}</p>
      )}
    </div>
  );
}
