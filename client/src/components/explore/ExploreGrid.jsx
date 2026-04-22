import { useState } from "react";

const ExploreGrid = ({ items = [] }) => {
  const [activeMedia, setActiveMedia] = useState(null);

  return (
    <>
      <section className="ig-explore-masonry">
        {items.map((item) => {
          const mediaURL = item.isAd ? item.imageUrl : item.media?.[0]?.url;
          const isVideo = item.media?.[0]?.type === "video";
          return (
            <div key={item._id} className="ig-explore-item" onClick={() => setActiveMedia(item)}>
              {isVideo ? (
                <video src={mediaURL} style={{ objectFit: "cover", width: "100%", height: "100%" }} muted />
              ) : (
                <img src={mediaURL} alt={item.title || item.caption || "explore item"} />
              )}
              {isVideo && (
                <div style={{ position: "absolute", top: 8, right: 8, color: "white", zIndex: 2 }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }}>
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {activeMedia && (
        <div
          className="ig-overlay"
          onClick={() => setActiveMedia(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <button
            style={{ position: "absolute", top: 20, right: 24, color: "#fff", fontSize: 26, background: "transparent", border: "none", cursor: "pointer", zIndex: 101 }}
            type="button"
            onClick={() => setActiveMedia(null)}
          >
            ✕
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "80%", maxHeight: "80%", display: "flex", justifyContent: "center" }}>
            {activeMedia.media?.[0]?.type === "video" ? (
              <video src={activeMedia.media?.[0]?.url} controls autoPlay style={{ maxWidth: "100%", maxHeight: "85vh", outline: "none", borderRadius: 8 }} />
            ) : (
              <img src={activeMedia.isAd ? activeMedia.imageUrl : activeMedia.media?.[0]?.url} alt="media" style={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain", borderRadius: 8 }} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ExploreGrid;