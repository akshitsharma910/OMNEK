import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VideoUploadPage() {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate=useNavigate()

  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const handleVideoChange = (e) => setVideo(e.target.files[0]);
  const handleThumbnailChange = (e) => setThumbnail(e.target.files[0]);

  const handleUpload = async () => {

    if (!title || !video) {
      alert("Title and video are required!");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Upload Video
      const videoForm = new FormData();
      videoForm.append("file", video);
      videoForm.append("upload_preset", "uploads"); // your unsigned preset
      videoForm.append("folder", "omnek/videos");

      const videoRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dv4hrlvk8/video/upload",
        videoForm,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((e.loaded * 100) / e.total));
          },
        }
      );

      
      let thumbRes = null;
      if (thumbnail) {
        const thumbForm = new FormData();
        thumbForm.append("file", thumbnail);
        thumbForm.append("upload_preset", "uploads");
        thumbForm.append("folder", "omnek/thumbnails");

        thumbRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dv4hrlvk8/image/upload",
          thumbForm
        );
      }
  

      await axios.post("http://localhost:9999/video/metaData", {
        title,
        description,
        category,
        videoURL: videoRes.data.secure_url,
        videoPublicId: videoRes.data.public_id,
        thumbnailURL: thumbRes?.data?.secure_url || null,
        thumbnailPublicId: thumbRes?.data?.public_id || null,
      },
    {withCredentials:true}
    );

      alert("✅ Upload successful!");
      setTitle("");
      setDescription("");
      setCategory("");
      setVideo(null);
      setThumbnail(null);
      navigate("/")

     
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed.");
    }

    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">Upload Video</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div>
        <label className="block font-medium">Select Video</label>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
        />
      </div>

      <div>
        <label className="block font-medium">Select Thumbnail (optional)</label>
        <input
          ref={thumbInputRef}
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
        />
      </div>

      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
