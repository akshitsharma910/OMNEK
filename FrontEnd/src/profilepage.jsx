import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:9999/u/profile", {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not logged in</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Profile</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          background: "#f9f9f9"
        }}
      >
        <p><strong>Full Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>ID:</strong> {user._id}</p>
      </div>
    </div>
  );
}
