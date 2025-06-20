import React, { useState, useRef } from "react";
import { upload } from "@imagekit/react";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_MEGAPIXELS = 25;

function ImageUpload({ onUpload }) {
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size check
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 25MB.");
      return;
    }

    // File type check
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed!");
      return;
    }

    // Megapixel check
    const img = new window.Image();
    img.onload = async () => {
      const megapixels = (img.width * img.height) / 1_000_000;
      if (megapixels > MAX_MEGAPIXELS) {
        setError("Image exceeds 25 megapixels (too large for ImageKit free plan).");
        return;
      }
      setError("");

      // Get ImageKit Auth parameters
      const authRes = await fetch("http://localhost:4000/imagekit/auth");
      const auth = await authRes.json();

      try {
        const result = await upload({
          file,
          fileName: file.name,
          urlEndpoint: "https://ik.imagekit.io/ejzfsxdp8l",
          publicKey: "public_xjww/ZFOYhWUMIHA6O5qHmJFq18=",
          ...auth,
        });
        onUpload(result.url);
      } catch (err) {
        setError("Upload failed. Please try again.");
      }
    };
    img.onerror = () => setError("Invalid image file.");
    img.src = URL.createObjectURL(file);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ marginBottom: 8 }}
      />
      {error && (
        <div style={{ color: "#e53e3e", marginTop: 6, fontSize: 14 }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
