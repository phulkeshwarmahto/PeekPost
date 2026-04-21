import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFeed } from "../redux/slices/feedSlice";
import FeedPost from "../components/feed/FeedPost";
import FeedAd from "../components/feed/FeedAd";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items, page, hasMore, loading } = useSelector((state) => state.feed);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchFeed(1));
  }, [dispatch]);

  const posts = useMemo(() => items.filter((item) => !item.isAd), [items]);

  const stories = useMemo(() => {
    const unique = new Map();

    for (const post of posts) {
      if (!post.author?._id || unique.has(post.author._id)) continue;
      unique.set(post.author._id, {
        username: post.author.username,
        avatar: post.author.avatar,
        media: post.media?.[0]?.url || `https://picsum.photos/seed/story-${post.author._id}/720/1280`,
      });

      if (unique.size >= 9) break;
    }

    if (!unique.size && user) {
      unique.set(user.id || "me", {
        username: user.username,
        avatar: user.avatar,
        media: "https://picsum.photos/seed/my-story/720/1280",
      });
    }

    return [...unique.values()];
  }, [posts, user]);

  const suggestions = useMemo(() => {
    const unique = new Map();
    for (const post of posts) {
      if (!post.author?._id || post.author.username === user?.username || unique.has(post.author._id)) continue;
      unique.set(post.author._id, post.author);
      if (unique.size >= 5) break;
    }
    return [...unique.values()];
  }, [posts, user?.username]);

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div className="ig-home-wrap">
      <section>
        <div className="ig-stories">
          {stories.map((story, index) => (
            <div className="ig-story" key={story.username}>
              <button
                type="button"
                onClick={() => setActiveStoryIndex(index)}
                style={{ border: 0, background: "transparent", padding: 0, width: "100%" }}
              >
                <div className="ig-story-ring">
                  <img src={story.avatar || "https://placehold.co/80x80?text=U"} alt={story.username} />
                </div>
              </button>
              <div className="ig-story-name">{story.username}</div>
            </div>
          ))}
        </div>

        <div className="ig-feed-list">
          {items.map((item) =>
            item.isAd ? <FeedAd key={item._id} ad={item} /> : <FeedPost key={item._id} post={item} />,
          )}

          {hasMore && (
            <button
              className="ig-btn-ghost"
              type="button"
              disabled={loading}
              onClick={() => dispatch(fetchFeed(page + 1))}
            >
              {loading ? "Loading..." : "Load more posts"}
            </button>
          )}
        </div>
      </section>

      <aside className="ig-suggest-panel">
        <div className="ig-suggest-me">
          <div className="ig-suggest-user">
            <img
              src={user?.avatar || "https://placehold.co/64x64?text=U"}
              alt="me"
              style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.username}</div>
              <div className="ig-muted" style={{ fontSize: 14 }}>
                {user?.fullName || "Your account"}
              </div>
            </div>
          </div>
          <span className="ig-link" style={{ fontSize: 12 }}>
            Switch
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <strong className="ig-muted" style={{ fontSize: 14 }}>
            Suggestions for you
          </strong>
          <span style={{ fontSize: 12, fontWeight: 700 }}>See All</span>
        </div>

        <div className="ig-suggest-list">
          {suggestions.map((suggestion) => (
            <div className="ig-suggest-item" key={suggestion._id}>
              <div className="ig-suggest-user">
                <img
                  src={suggestion.avatar || "https://placehold.co/50x50?text=U"}
                  alt={suggestion.username}
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{suggestion.username}</div>
                  <div className="ig-muted">Followed by friends</div>
                </div>
              </div>
              <span className="ig-link">Follow</span>
            </div>
          ))}
        </div>
      </aside>

      {activeStory && (
        <div className="ig-overlay" onClick={() => setActiveStoryIndex(null)}>
          <button className="ig-close" type="button" onClick={() => setActiveStoryIndex(null)}>
            x
          </button>

          <div className="ig-story-viewer" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="ig-story-nav"
              onClick={() =>
                setActiveStoryIndex((previous) => (previous - 1 + stories.length) % stories.length)
              }
            >
              {'<'}
            </button>

            <div className="ig-story-card">
              <div className="ig-story-progress">
                <span />
                <span />
                <span />
              </div>
              <div className="ig-story-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={activeStory.avatar} alt={activeStory.username} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <strong>{activeStory.username}</strong>
                  <span aria-label="Verified" style={{ display: 'inline-flex', marginLeft: 2 }}>
                    <svg fill="#fff" height="12" viewBox="0 0 40 40" width="12"><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
                  </span>
                  <span className="ig-muted" style={{ marginLeft: 4 }}>3h</span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 18 }}>
                  <span>&#9654;</span>
                  <span>&#128266;</span>
                  <span>...</span>
                </div>
              </div>
              <img className="ig-story-media" src={activeStory.media} alt="story" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '0 4px' }}>
                <input 
                  type="text" 
                  placeholder={`Reply to ${activeStory.username}...`} 
                  style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 24, padding: '10px 16px', color: '#fff', outline: 'none' }} 
                />
                <span style={{ fontSize: 24, color: '#fff', cursor: 'pointer' }}>&#9825;</span>
                <span style={{ fontSize: 24, color: '#fff', cursor: 'pointer' }}>&#10148;</span>
              </div>
            </div>

            <button
              type="button"
              className="ig-story-nav"
              onClick={() => setActiveStoryIndex((previous) => (previous + 1) % stories.length)}
            >
              {'>'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;