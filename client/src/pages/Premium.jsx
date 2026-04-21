import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PlanCard from "../components/premium/PlanCard";
import PremiumBadge from "../components/premium/PremiumBadge";
import PremiumModal from "../components/premium/PremiumModal";
import { setPremiumStatus } from "../redux/slices/premiumSlice";
import { api } from "../services/api";

const Premium = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.premium.status);
  const [plans, setPlans] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState("");

  const loadStatus = async () => {
    const [{ data: plansData }, { data: statusData }] = await Promise.all([
      api.get("/premium/plans"),
      api.get("/premium/status"),
    ]);
    setPlans(plansData);
    dispatch(setPremiumStatus(statusData));
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const subscribe = async (plan) => {
    setLoadingPlan(plan);
    try {
      const { data } = await api.post("/premium/create-order", { plan, currency: "INR", gateway: "razorpay" });
      await api.post("/premium/webhook", {
        orderId: data.orderId,
        paymentId: `pay_${Date.now()}`,
        status: "success",
      });
      await loadStatus();
    } finally {
      setLoadingPlan("");
    }
  };

  const cancel = async () => {
    await api.post("/premium/cancel");
    await loadStatus();
  };

  if (!plans) return <div className="card">Loading plans...</div>;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <PremiumModal />
      <section className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0 }}>InstaClone Premium</h3>
          <p style={{ margin: "0.3rem 0 0", color: "var(--muted)" }}>
            Remove feed, story, reel, and explore ads.
          </p>
        </div>
        <PremiumBadge enabled={status.isPremium} />
      </section>

      <div className="grid-2">
        <PlanCard
          title="Monthly"
          price={`INR ${(plans.monthly.inr / 100).toFixed(2)}`}
          actionLabel={loadingPlan === "monthly" ? "Processing..." : "Subscribe Monthly"}
          disabled={loadingPlan === "monthly"}
          onAction={() => subscribe("monthly")}
        />
        <PlanCard
          title="Yearly"
          price={`INR ${(plans.yearly.inr / 100).toFixed(2)}`}
          actionLabel={loadingPlan === "yearly" ? "Processing..." : "Subscribe Yearly"}
          disabled={loadingPlan === "yearly"}
          onAction={() => subscribe("yearly")}
        />
      </div>

      {status.isPremium && (
        <section className="card" style={{ display: "grid", gap: "0.5rem" }}>
          <p style={{ margin: 0 }}>
            Active plan: <strong>{status.premiumPlan}</strong>
          </p>
          <p style={{ margin: 0 }}>
            Expires: <strong>{new Date(status.premiumExpiry).toLocaleDateString()}</strong>
          </p>
          <button className="btn-ghost" type="button" onClick={cancel}>
            Cancel subscription
          </button>
        </section>
      )}
    </div>
  );
};

export default Premium;