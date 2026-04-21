import { useEffect, useState } from "react";

import ExploreGrid from "../components/explore/ExploreGrid";
import ExploreSearch from "../components/explore/ExploreSearch";
import { api } from "../services/api";

const Explore = () => {
  const [items, setItems] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [feedRes, trendRes] = await Promise.all([api.get("/explore"), api.get("/explore/trending")]);
      setItems(feedRes.data);
      setTrending(trendRes.data);
    };

    load();
  }, []);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <ExploreSearch />
      <section className="card">
        <h3>Trending hashtags</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {trending.map((tag) => (
            <span key={tag.tag} className="btn-ghost" style={{ borderRadius: "999px", padding: "0.35rem 0.7rem" }}>
              #{tag.tag} ({tag.count})
            </span>
          ))}
        </div>
      </section>
      <ExploreGrid items={items} />
    </div>
  );
};

export default Explore;