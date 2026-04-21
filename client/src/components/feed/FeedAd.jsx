const FeedAd = ({ ad }) => (
  <article className="ig-feed-card">
    <div className="ig-feed-header">
      <div className="ig-feed-user">
        <img className="ig-feed-avatar" src={ad.imageUrl} alt={ad.advertiser} />
        <div>
          <div className="ig-feed-username">{ad.advertiser}</div>
          <div className="ig-feed-sub">Sponsored</div>
        </div>
      </div>
      <span style={{ fontSize: 24 }}>?</span>
    </div>

    <img className="ig-feed-media" src={ad.imageUrl} alt={ad.title} />

    <div className="ig-feed-meta" style={{ paddingTop: 10 }}>
      <strong>{ad.title}</strong>
      <div className="ig-muted">{ad.linkUrl}</div>
      <a href={ad.linkUrl} target="_blank" rel="noreferrer" className="ig-link">
        Visit advertiser
      </a>
    </div>
  </article>
);

export default FeedAd;