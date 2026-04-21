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
    <div className="ig-explore-wrap">
      <ExploreSearch />

      <div className="ig-tags">
        {trending.slice(0, 12).map((tag) => (
          <span key={tag.tag} className="ig-tag">
            #{tag.tag} ({tag.count})
          </span>
        ))}
      </div>

      <ExploreGrid items={items} />
    </div>
  );
};

export default Explore;