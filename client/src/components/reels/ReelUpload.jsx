import { useState } from "react";

import { api } from "../../services/api";

const ReelUpload = ({ onUploaded }) => {
  const [videoUrl, setVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");
  const [caption, setCaption] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/reels", { videoUrl, caption });
    setCaption("");
    onUploaded?.();
  };

  return (
    <section className="card" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 10px" }}>Upload Reel</h3>
      <form onSubmit={submit} style={{ display: "grid", gap: "0.5rem" }}>
        <input className="ig-input" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} />
        <input
          className="ig-input"
          placeholder="Caption"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
        <button className="ig-btn-primary" type="submit">
          Publish Reel
        </button>
      </form>
    </section>
  );
};

export default ReelUpload;