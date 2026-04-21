import { useMemo, useState } from "react";

const FeedPost = ({ post }) => {
  const [open, setOpen] = useState(false);

  const mockComments = useMemo(
    () => [
      { id: 1, user: "organic_algorithm", text: "Love this shot. Clean framing.", time: "1d" },
      { id: 2, user: "im_grohit", text: "This looks amazing.", time: "8h" },
      { id: 3, user: "saurabh952", text: "Can you share settings for this?", time: "4h" },
    ],
    [],
  );

  const media = post.media?.[0];

  return (
    <>
      <article className="ig-feed-card">
        <div className="ig-feed-header">
          <div className="ig-feed-user">
            <img
              className="ig-feed-avatar"
              src={post.author?.avatar || "https://placehold.co/64x64?text=U"}
              alt={post.author?.username}
            />
            <div>
              <div className="ig-feed-username">{post.author?.username}</div>
              <div className="ig-feed-sub">{post.location?.name || "PeekPost"}</div>
            </div>
          </div>
          <span style={{ fontSize: 20 }}>...</span>
        </div>

        {media?.url && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{ border: 0, padding: 0, width: "100%", background: "transparent" }}
          >
            {media.type === "video" ? (
              <video className="ig-feed-media" src={media.url} controls />
            ) : (
              <img className="ig-feed-media" src={media.url} alt={post.caption || "post"} />
            )}
          </button>
        )}

        <div className="ig-feed-actions" style={{ fontSize: 14 }}>
          <div className="ig-feed-actions-left">
            <span>Like</span>
            <span>Comment</span>
            <span>Share</span>
          </div>
          <span>Save</span>
        </div>

        <div className="ig-feed-meta">
          <strong>{(post.likes?.length || 0).toLocaleString()} likes</strong>
          <div>
            <strong>{post.author?.username}</strong> {post.caption}
          </div>
          <div className="ig-feed-comments-link">View all {post.comments?.length || 0} comments</div>
          <div className="ig-muted" style={{ fontSize: 12 }}>
            {new Date(post.createdAt || Date.now()).toLocaleDateString()}
          </div>
        </div>

        <div className="ig-feed-comment-box">Add a comment...</div>
      </article>

      {open && (
        <div className="ig-overlay" onClick={() => setOpen(false)}>
          <button className="ig-close" type="button" onClick={() => setOpen(false)}>
            x
          </button>

          <div className="ig-post-modal" onClick={(event) => event.stopPropagation()}>
            <div className="ig-post-modal-media" style={{ position: 'relative' }}>
              <button style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 0, width: 32, height: 32, borderRadius: '50%', fontSize: 18, cursor: 'pointer', zIndex: 10 }}>&#8249;</button>
              <button style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 0, width: 32, height: 32, borderRadius: '50%', fontSize: 18, cursor: 'pointer', zIndex: 10 }}>&#8250;</button>
              
              {media?.type === "video" ? (
                <video src={media.url} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <img src={media?.url} alt={post.caption || "post"} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )}
            </div>

            <div className="ig-post-modal-side">
              <div className="ig-feed-header">
                <div className="ig-feed-user">
                  <img
                    className="ig-feed-avatar"
                    src={post.author?.avatar || "https://placehold.co/64x64?text=U"}
                    alt={post.author?.username}
                  />
                  <div className="ig-feed-username">{post.author?.username}</div>
                </div>
                <span style={{ fontSize: 20 }}>...</span>
              </div>

              <div className="ig-post-modal-comments">
                <div className="ig-comment">
                  <img
                    className="ig-feed-avatar"
                    src={post.author?.avatar || "https://placehold.co/64x64?text=U"}
                    alt={post.author?.username}
                  />
                  <div className="ig-comment-text">
                    <strong>{post.author?.username}</strong> {post.caption}
                    <div className="ig-muted" style={{ fontSize: 12, marginTop: 4 }}>
                      3d
                    </div>
                  </div>
                </div>

                {mockComments.map((comment) => (
                  <div key={comment.id} className="ig-comment">
                    <img className="ig-feed-avatar" src="https://placehold.co/64x64?text=U" alt={comment.user} />
                    <div className="ig-comment-text">
                      <strong>{comment.user}</strong> {comment.text}
                      <div className="ig-muted" style={{ fontSize: 12, marginTop: 4 }}>
                        {comment.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="ig-feed-actions" style={{ fontSize: 24, padding: '6px 16px 8px' }}>
                  <div className="ig-feed-actions-left" style={{ gap: 16 }}>
                    <span style={{ cursor: 'pointer' }}>&#9825;</span>
                    <span style={{ cursor: 'pointer' }}>&#128488;</span>
                    <span style={{ cursor: 'pointer' }}>&#10148;</span>
                  </div>
                  <span style={{ cursor: 'pointer' }}>&#128190;</span>
                </div>
                <div className="ig-feed-meta" style={{ paddingTop: 0, paddingBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                    <img src="https://placehold.co/20x20?text=U" alt="liked by" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                    <span>Liked by <strong>{post.author?.username}</strong> and <strong>1,000 others</strong></span>
                  </div>
                  <div className="ig-muted" style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 4 }}>
                    3 days ago
                  </div>
                </div>
                <div className="ig-feed-comment-box" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>&#9786;</span>
                  <input type="text" placeholder="Add a comment..." style={{ border: 0, flex: 1, outline: 'none' }} />
                  <span style={{ color: 'var(--ig-blue)', fontWeight: 600, cursor: 'pointer' }}>Post</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedPost;