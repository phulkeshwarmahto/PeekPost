const ReelCard = ({ reel }) => {
  if (reel.isAd) {
    return (
      <article className="ig-reel-card">
        <div className="ig-feed-header">
          <div className="ig-feed-user">
            <img className="ig-feed-avatar" src={reel.imageUrl} alt={reel.title} />
            <div>
              <div className="ig-feed-username">Sponsored</div>
              <div className="ig-feed-sub">Reel ad</div>
            </div>
          </div>
        </div>
        <img className="ig-feed-media" src={reel.imageUrl} alt={reel.title} />
      </article>
    );
  }

  return (
    <article className="ig-reel-card">
      <div className="ig-feed-header">
        <div className="ig-feed-user">
          <img
            className="ig-feed-avatar"
            src={reel.author?.avatar || "https://placehold.co/64x64?text=U"}
            alt={reel.author?.username}
          />
          <div className="ig-feed-username">{reel.author?.username || "user"}</div>
        </div>
      </div>

      <video controls src={reel.videoUrl} style={{ width: "100%", maxHeight: 650, background: "#000" }} />

      <div className="ig-feed-meta">
        <strong>{reel.caption || "No caption"}</strong>
      </div>
    </article>
  );
};

export default ReelCard;