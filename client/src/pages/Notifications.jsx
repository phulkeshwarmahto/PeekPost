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
    <div className="ig-notifications-shell">
      <NotificationPanel
        items={items}
        onMarkAllRead={async () => {
          await api.post("/notifications/mark-all-read");
          load();
        }}
      />

      <section className="ig-notification-canvas">
        <div>
          <div style={{ fontSize: 82, marginBottom: 12 }}>?</div>
          <h2 style={{ margin: 0, fontWeight: 500 }}>Your Messages</h2>
          <p className="ig-muted">Send private photos and messages to a friend or group.</p>
          <button className="ig-btn-primary" type="button">
            Send Message
          </button>
        </div>
      </section>
    </div>
  );
};

export default Notifications;