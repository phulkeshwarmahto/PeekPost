import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import NotificationPanel from "../components/notifications/NotificationPanel";
import { setNotifications } from "../redux/slices/notificationSlice";
import { api } from "../services/api";
import { MOCK_NOTIFICATIONS } from "../utils/mockData";

const Notifications = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.notification.items);

  const load = async () => {
    try {
      const { data } = await api.get("/notifications");
      dispatch(setNotifications(data));
    } catch {
      dispatch(setNotifications(MOCK_NOTIFICATIONS));
    }
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

      <section className="ig-notification-canvas modern">
        <div className="ig-notification-summary-card">
          <h3>Activity overview</h3>
          <p className="ig-muted">Track follows, likes, comments, and message activity in one place.</p>
          <div className="ig-notification-stats">
            <div><strong>{items.filter((item) => !item.read).length}</strong><span>Unread</span></div>
            <div><strong>{items.length}</strong><span>Total</span></div>
          </div>
          <div className="ig-notification-tip">Tip: keep your inbox clean by marking older updates as read weekly.</div>
        </div>
      </section>
    </div>
  );
};

export default Notifications;