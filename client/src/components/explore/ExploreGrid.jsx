const ExploreGrid = ({ items = [] }) => (
  <section className="ig-explore-grid">
    {items.map((item) => (
      <div key={item._id} className="ig-post-tile">
        <img
          src={item.isAd ? item.imageUrl : item.media?.[0]?.url}
          alt={item.title || item.caption || "explore item"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    ))}
  </section>
);

export default ExploreGrid;