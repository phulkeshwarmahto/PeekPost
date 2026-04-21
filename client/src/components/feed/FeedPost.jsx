import Avatar from "../common/Avatar";

const FeedPost = ({ post }) => (
  <article className="card" style={{ display: "grid", gap: "0.7rem" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <Avatar src={post.author?.avatar} />
      <div>
        <strong>{post.author?.username}</strong>
        <p style={{ margin: 0, color: "var(--muted)" }}>{post.author?.fullName}</p>
      </div>
    </div>
    {post.media?.[0]?.url && (
      <img
        src={post.media[0].url}
        alt="post"
        style={{ width: "100%", borderRadius: 12, maxHeight: 560, objectFit: "cover" }}
      />
    )}
    <p style={{ margin: 0 }}>{post.caption}</p>
    <small style={{ color: "var(--muted)" }}>{post.likes?.length || 0} likes</small>
  </article>
);

export default FeedPost;