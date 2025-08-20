import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate(); 
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:9999/", {
          credentials: "include"
        });
        const data = await res.json();

        if (res.ok) {
          setVideos(data.data.videos);
          setUser(data.data.user);
        } else {
          console.error("Failed to fetch videos:", data.message);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:9999/u/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        navigate("/u/login");
      } else {
        console.error("Logout failed", res.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) return <p>Loading videos...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>🎥 OMNEK</h2>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: "10px" }}>Welcome, {user.fullName}</span>
              <button onClick={handleLogout} style={{ marginRight: "5px",borderRadius:"5px",border:"1px solid black",padding:"2px",backgroundColor:"red" }}>Logout</button>
              <button onClick={() => navigate("/u/profile")} style={{marginRight:"5px",borderRadius:"5px",border:"1px solid black",padding:"2px",backgroundColor:"purple" }}>Profile</button>
              <button onClick={()=>navigate("/video/upload")} style={{marginRight:"5px",borderRadius:"5px",border:"1px solid black",padding:"2px",backgroundColor:"green" }}>Upload</button>
              <button onClick={()=>navigate("/u/videos")} style={{marginRight:"5px",borderRadius:"5px",border:"1px solid black",padding:"2px",backgroundColor:"yellow" }}>My Videos</button>
            </>

          ) : (
            <button onClick={() => navigate("/u/login")}>Login</button>
          )}
        </div>
      </div>

      {/* Videos List */}
      {videos.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
          {videos.map((video) => (
            <div 
              key={video._id} 
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#fff",
                cursor: "pointer"
              }}
              onClick={() => navigate(`/video/${video._id}`)}
            >
              <img 
                src={video.thumbnailURL || "https://via.placeholder.com/250x140?text=No+Thumbnail"} 
                alt={video.title} 
                style={{ width: "100%", height: "140px", objectFit: "cover" }}
              />
              <div style={{ padding: "0.5rem" }}>
                <h4 style={{ margin: "0 0 0.3rem 0" }}>{video.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "#555" }}>{video.category}</p>
                <p style={{ fontSize: "0.8rem", color: "#777" }}>
                  By {video.uploader?.fullName || "Unknown"} • {video.views} views
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No videos available</p>
      )}
    </div>
  );
}
