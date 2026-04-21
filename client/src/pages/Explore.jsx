import { useEffect, useState } from "react";
import ExploreGrid from "../components/explore/ExploreGrid";
import { api } from "../services/api";

const ExploreSearch = ({ query, setQuery }) => (
  <div className="ig-explore-search-bar">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, color: "var(--tcl-muted)" }}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      type="text"
      placeholder="Search curated collections, creators, or styles..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  </div>
);

const MOCK_EXPLORE_DATA = [
  "https://picsum.photos/seed/curated-1/400/800",
  "https://picsum.photos/seed/curated-2/500/500",
  "https://picsum.photos/seed/curated-3/600/400",
  "https://picsum.photos/seed/curated-4/400/600",
  "https://picsum.photos/seed/curated-5/400/900",
  "https://picsum.photos/seed/curated-6/500/1000",
  "https://picsum.photos/seed/curated-7/700/500",
  "https://picsum.photos/seed/curated-8/500/500",
  "https://picsum.photos/seed/curated-9/400/400",
  "https://picsum.photos/seed/curated-10/400/800",
].map((url, i) => ({
  _id: `mock-exp-${i}`,
  media: [{ url }],
}));

const Explore = () => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/explore");
        setItems(data.length ? data : MOCK_EXPLORE_DATA);
      } catch {
        setItems(MOCK_EXPLORE_DATA);
      }
    };
    load();
  }, []);

  return (
    <div className="ig-explore-wrap">
      <ExploreSearch query={query} setQuery={setQuery} />
      <ExploreGrid items={items} />
    </div>
  );
};

export default Explore;