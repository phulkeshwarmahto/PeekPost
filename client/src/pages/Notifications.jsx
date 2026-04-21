import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import NotificationPanel from "../components/notifications/NotificationPanel";
import { setNotifications } from "../redux/slices/notificationSlice";
import { api } from "../services/api";

const Notifications = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.notification.items);

  const load = async () => {
    const { data } = await api.get("/notifications");
    dispatch(setNotifications(data));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Notifications</h3>
        <button
          type="button"
          className="btn-ghost"
          onClick={async () => {
            await api.post("/notifications/mark-all-read");
            load();
          }}
        >
          Mark all read
        </button>
      </div>
      <NotificationPanel items={items} />
    </div>
  );
};

export default Notifications;