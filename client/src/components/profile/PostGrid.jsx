const PostGrid = ({ posts = [] }) => (
  <section className="card">
    <h3>Posts</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
      {posts.map((post) => (
        <img
          key={post._id}
          src={post.media?.[0]?.url}
          alt={post.caption || "post"}
          style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 10 }}
        />
      ))}
    </div>
  </section>
);

export default PostGrid;