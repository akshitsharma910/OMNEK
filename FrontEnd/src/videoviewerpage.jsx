import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function VideoViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9999/u/profile", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCurrentUser(data);
      })
      .catch((err) => console.error("Error fetching current user:", err));
  }, []);

  useEffect(() => {
    async function fetchVideo() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:9999/video/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch video");
        }
        const data = await res.json();
        setVideo(data.video);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id]);

  async function handleVideoDelete() {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`http://localhost:9999/video/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete video");
      }

      alert("Video deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Error deleting video: " + err.message);
    }
  }

  const handleLikeVideo = async () => {
    if (!currentUser) {
      alert("Please log in first to like this video.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:9999/video/${id}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to like video");

      const updatedVideo = await res.json();
      setVideo((prev) => ({
        ...prev,
        likes: updatedVideo.likes,
        dislikes: updatedVideo.dislikes,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislikeVideo = async () => {
    if (!currentUser) {
      alert("Please log in first to dislike this video.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:9999/video/${id}/dislike`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to dislike video");

      const updatedVideo = await res.json();
      setVideo((prev) => ({
        ...prev,
        likes: updatedVideo.likes,
        dislikes: updatedVideo.dislikes,
      }));
    } catch (err) {
      console.error(err);
    }
  };

 const handleToggleSubscribe = async () => {
  if (!currentUser) {
    alert("Please log in first to subscribe.");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:9999/video/${video.uploader._id}/subscribe`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to subscribe");

    const updated = await res.json();

    setVideo((prev) => ({
      ...prev,
      uploader: {
        ...prev.uploader,
        subscribers: updated.channelSubscribers, 
      },
      isSubscribed: updated.subscribed,
    }));
  } catch (err) {
    console.error("Subscribe error:", err);
  }
}

  if (loading) return <p>Loading video...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!video) return <p>Video not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{video.title}</h1>
      <video
        src={video.videoURL}
        controls
        style={{ width: "100%", maxHeight: "500px", borderRadius: "8px" }}
      />
      <p>{video.description}</p>
      <p>
        <strong>Category:</strong> {video.category}
      </p>
      <p>
        <strong>Views:</strong> {video.views}
      </p>

      {video?.uploader && (!currentUser || currentUser._id !== video.uploader._id) && (
        <button
          onClick={handleToggleSubscribe}
          style={{
            marginRight: "10px",
            border: "1px solid black",
            padding: "5px",
            background: video.isSubscribed ? "red" : "green",
            color: "white",
          }}
        >
          {video.isSubscribed ? "Unsubscribe" : "Subscribe"}
          {" ("}
          {(video.uploader.subscribers)}
          {") "}
        </button>
      )}

      <button
        onClick={handleLikeVideo}
        style={{ border: "1px solid black", padding: "2px" }}
      >
        Like ({video.likes?.length || 0})
      </button>
      <button
        onClick={handleDislikeVideo}
        style={{ border: "1px solid black", padding: "2px", marginLeft: "5px" }}
      >
        Dislike ({video.dislikes?.length || 0})
      </button>

      {currentUser?._id === video?.uploader?._id && (
        <button
          onClick={handleVideoDelete}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default VideoViewerPage;
