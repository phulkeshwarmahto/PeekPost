const ExploreGrid = ({ items = [] }) => (
  <section className="ig-explore-masonry">
    {items.map((item) => (
      <div key={item._id} className="ig-explore-item">
        <img
          src={item.isAd ? item.imageUrl : item.media?.[0]?.url}
          alt={item.title || item.caption || "explore item"}
        />
        {/* Optional overlay for likes/comments can go here */}
      </div>
    ))}
  </section>
);

export default ExploreGrid;