const ReelCard = ({ reel }) => {
  if (reel.isAd) {
    return (
      <article className="card">
        <small style={{ color: "#b5122f", fontWeight: 700 }}>Reel Ad</small>
        <h4>{reel.title}</h4>
        <img src={reel.imageUrl} alt={reel.title} style={{ width: "100%", borderRadius: 12 }} />
      </article>
    );
  }

  return (
    <article className="card" style={{ display: "grid", gap: "0.6rem" }}>
      <h4 style={{ margin: 0 }}>{`@${reel.author?.username || "user"}`}</h4>
      <video controls src={reel.videoUrl} style={{ width: "100%", borderRadius: 12, maxHeight: 420 }} />
      <p style={{ margin: 0 }}>{reel.caption}</p>
    </article>
  );
};

export default ReelCard;
