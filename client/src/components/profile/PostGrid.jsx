const PostGrid = ({ posts = [] }) => {
  const minimumTiles = 12;
  const placeholders = Array.from({ length: Math.max(0, minimumTiles - posts.length) });

  return (
    <section className="ig-post-grid">
      {posts.map((post) => (
        <div key={post._id} className="ig-post-tile">
          <img src={post.media?.[0]?.url} alt={post.caption || "post"} />
        </div>
      ))}

      {placeholders.map((_, index) => (
        <div key={`placeholder-${index}`} className="ig-post-tile" />
      ))}
    </section>
  );
};

export default PostGrid;