const ExploreGrid = ({ items = [] }) => (
  <section className="card">
    <h3>Explore Grid</h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: "0.7rem",
      }}
    >
      {items.map((item) => (
        <div key={item._id} style={{ borderRadius: 12, overflow: "hidden", background: "#fafafd" }}>
          <img
            src={item.isAd ? item.imageUrl : item.media?.[0]?.url}
            alt={item.title || item.caption || "explore item"}
            style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  </section>
);

export default ExploreGrid;