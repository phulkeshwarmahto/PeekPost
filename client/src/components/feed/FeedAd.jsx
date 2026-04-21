const FeedAd = ({ ad }) => (
  <article className="card" style={{ border: "1px solid #ffd5d9" }}>
    <small style={{ color: "#b5122f", fontWeight: 700 }}>Sponsored</small>
    <h4>{ad.title}</h4>
    <img src={ad.imageUrl} alt={ad.title} style={{ width: "100%", borderRadius: 12 }} />
    <a href={ad.linkUrl} target="_blank" rel="noreferrer" className="btn-ghost" style={{ display: "inline-block", marginTop: 8 }}>
      Visit advertiser
    </a>
  </article>
);

export default FeedAd;