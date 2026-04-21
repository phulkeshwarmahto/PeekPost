const NotificationItem = ({ item }) => (
  <div style={{ padding: "0.65rem", borderBottom: "1px solid #ececf7" }}>
    <strong>{`@${item.actor?.username || "user"}`}</strong> {item.message || item.type}
  </div>
);

export default NotificationItem;
