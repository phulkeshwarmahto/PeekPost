const PremiumBadge = ({ enabled }) => (
  <span
    style={{
      display: "inline-block",
      background: enabled ? "#f8d56a" : "#e8e9f5",
      padding: "0.2rem 0.55rem",
      borderRadius: 999,
      fontWeight: 700,
      fontSize: "0.82rem",
      marginTop: "0.4rem",
    }}
  >
    {enabled ? "Premium" : "Free"}
  </span>
);

export default PremiumBadge;