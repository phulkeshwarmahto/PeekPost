import { useState } from "react";

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const ReelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z" />
  </svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

/* Placeholder landscape images for demo posts when API returns none */
const DEMO_IMGS = [
  "https://picsum.photos/seed/lake-sunset/600/600",
  "https://picsum.photos/seed/forest-sun/600/600",
  "https://picsum.photos/seed/red-house/600/600",
  "https://picsum.photos/seed/mountains-snow/600/600",
  "https://picsum.photos/seed/green-hills/600/600",
  "https://picsum.photos/seed/beach-aerial/600/600",
  "https://picsum.photos/seed/grass-drops/600/600",
  "https://picsum.photos/seed/pillars-sky/600/600",
  "https://picsum.photos/seed/portrait-dark/600/600",
];

const PostGrid = ({ posts = [] }) => {
  const [activeTab, setActiveTab] = useState("posts");

  /* Merge real posts + padded demo tiles */
  const allPosts = posts.length > 0 ? posts : DEMO_IMGS.map((url, i) => ({
    _id: `demo-${i}`, media: [{ url, type: "image" }], caption: ""
  }));

  const tabs = [
    { key: "posts",  label: "POSTS",  Icon: GridIcon },
    { key: "reels",  label: "REELS",  Icon: ReelIcon },
    { key: "tagged", label: "TAGGED", Icon: TagIcon },
  ];

  return (
    <>
      {/* Tabs */}
      <div className="ig-profile-tabs">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            className={`ig-profile-tab${activeTab === key ? " active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <section className="ig-post-grid">
        {allPosts.map((post) => (
          <div key={post._id} className="ig-post-tile">
            {post.media?.[0]?.url ? (
              <img src={post.media[0].url} alt={post.caption || "post"} />
            ) : null}
          </div>
        ))}
      </section>
    </>
  );
};

export default PostGrid;