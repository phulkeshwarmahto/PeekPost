import { useEffect, useState } from "react";
import ReelPlayer from "../components/reels/ReelPlayer";
import { api } from "../services/api";
import { MOCK_REELS } from "../utils/mockData";

const Reels = () => {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchY, setTouchY] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/reels/feed");
      setItems(data.length ? data : MOCK_REELS);
    } catch {
      setItems(MOCK_REELS);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeReel = items[activeIndex];
  const goNext = () => {
    if (!items.length) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  };
  const goPrev = () => {
    if (!items.length) return;
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const onWheel = (event) => {
    if (!items.length) return;
    if (event.deltaY > 8) goNext();
    if (event.deltaY < -8) goPrev();
  };

  useEffect(() => {
    const onKey = (event) => {
      if (!items.length) return;
      if (event.key === "ArrowUp") {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      }
      if (event.key === "ArrowDown") {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length]);

  return (
    <div
      className="ig-reels-wrap"
      onWheel={onWheel}
      onTouchStart={(event) => setTouchY(event.changedTouches[0].clientY)}
      onTouchEnd={(event) => {
        if (touchY === null) return;
        const delta = event.changedTouches[0].clientY - touchY;
        if (delta < -20) goNext();
        if (delta > 20) goPrev();
        setTouchY(null);
      }}
    >
      {activeReel && (
        <article className="ig-reel-active">
          <ReelPlayer src={activeReel.videoUrl} />
          <div className="ig-reel-overlay">
            <div className="ig-reel-author">@{activeReel.author?.username}</div>
            <div className="ig-reel-caption">{activeReel.caption}</div>
            <div className="ig-reel-controls">
              <button type="button" className="ig-profile-btn" onClick={goPrev}>Previous</button>
              <button type="button" className="ig-profile-btn" onClick={goNext}>Next</button>
            </div>
            <div className="ig-reel-hint">Swipe, scroll, or use arrow keys</div>
          </div>
        </article>
      )}
    </div>
  );
};

export default Reels;