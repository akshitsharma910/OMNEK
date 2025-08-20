import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserVideos = async () => {
      try {
        const res = await fetch("http://localhost:9999/u/videos", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    handleUserVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Uploaded Videos</h2>
      {videos.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {videos.map((video) => (
            <div
              key={video._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#fff",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
              onClick={() => navigate(`/video/${video._id}`)}
            >
              <img
                src={
                  video.thumbnailURL ||
                  "https://via.placeholder.com/250x140?text=No+Thumbnail"
                }
                alt={video.title}
                style={{ width: "100%", height: "140px", objectFit: "cover" }}
              />
              <div style={{ padding: "0.5rem" }}>
                <h4 style={{ margin: "0 0 0.3rem 0" }}>{video.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "#555" }}>
                  {video.category}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#777" }}>
                  By {video.uploader.fullName || "Unknown"} •{" "}
                  {video.views || 0} views
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
