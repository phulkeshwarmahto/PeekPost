const PlanCard = ({ title, price, actionLabel, onAction, disabled }) => (
  <section className="card" style={{ display: "grid", gap: "0.6rem" }}>
    <h4 style={{ margin: 0 }}>{title}</h4>
    <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>{price}</p>
    <button className="btn-primary" type="button" onClick={onAction} disabled={disabled}>
      {actionLabel}
    </button>
  </section>
);

export default PlanCard;