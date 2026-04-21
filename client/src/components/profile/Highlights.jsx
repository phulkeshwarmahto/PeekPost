const Highlights = ({ posts = [] }) => {
  const covers = posts.slice(0, 4).map((post) => post.media?.[0]?.url).filter(Boolean);
  const labels = ["BTS", "Frisbee", "Travel", "Studio"];

  return (
    <section className="ig-highlights">
      {labels.map((label, index) => (
        <div key={label} className="ig-highlight-item">
          <div className="ig-highlight-circle">
            <img src={covers[index] || `https://placehold.co/100x100?text=${label[0]}`} alt={label} />
          </div>
          <div>{label}</div>
        </div>
      ))}
    </section>
  );
};

export default Highlights;