import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFeed, prependPost } from "../redux/slices/feedSlice";
import { api } from "../services/api";
import FeedPost from "../components/feed/FeedPost";
import FeedAd from "../components/feed/FeedAd";

const Home = () => {
  const dispatch = useDispatch();
  const { items, page, hasMore, loading } = useSelector((state) => state.feed);
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("https://picsum.photos/seed/newpost/1080/1080");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    dispatch(fetchFeed(1));
  }, [dispatch]);

  const submitPost = async (event) => {
    event.preventDefault();
    setPosting(true);
    try {
      const { data } = await api.post("/posts", {
        caption,
        media: [{ url: mediaUrl, type: "image", publicId: "" }],
      });
      dispatch(prependPost(data));
      setCaption("");
      setMediaUrl(`https://picsum.photos/seed/${Date.now()}/1080/1080`);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <section className="card">
        <h3>Create Post</h3>
        <form onSubmit={submitPost} style={{ display: "grid", gap: "0.6rem" }}>
          <input
            className="input"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Write a caption with #tags"
          />
          <input
            className="input"
            value={mediaUrl}
            onChange={(event) => setMediaUrl(event.target.value)}
            placeholder="Image URL"
          />
          <button className="btn-primary" type="submit" disabled={posting}>
            {posting ? "Posting..." : "Post"}
          </button>
        </form>
      </section>

      {items.map((item) =>
        item.isAd ? <FeedAd key={item._id} ad={item} /> : <FeedPost key={item._id} post={item} />,
      )}

      {hasMore && (
        <button
          className="btn-ghost"
          type="button"
          disabled={loading}
          onClick={() => dispatch(fetchFeed(page + 1))}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default Home;
