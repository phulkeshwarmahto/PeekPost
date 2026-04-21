import NotificationItem from "./NotificationItem";

const NotificationPanel = ({ items = [] }) => (
  <section className="card">
    {items.length === 0 && <p style={{ margin: 0 }}>No notifications yet.</p>}
    {items.map((item) => (
      <NotificationItem key={item._id} item={item} />
    ))}
  </section>
);

export default NotificationPanel;