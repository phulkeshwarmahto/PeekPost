import { useEffect, useState } from "react";

import ReelCard from "../components/reels/ReelCard";
import ReelUpload from "../components/reels/ReelUpload";
import { api } from "../services/api";

const Reels = () => {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get("/reels/feed");
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ig-reels-wrap">
      <ReelUpload onUploaded={load} />
      {items.map((item) => (
        <ReelCard key={item._id} reel={item} />
      ))}
    </div>
  );
};

export default Reels;