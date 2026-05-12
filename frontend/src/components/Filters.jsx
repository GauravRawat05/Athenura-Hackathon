import { useState } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { domains } from "../data/hackathons";
import styles from "./Filters.module.css";

export default function Filters({ filters, onChange }) {
  const [open, setOpen] = useState(false);

  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className={styles.wrapper}>
      {/* Status tabs */}
      <div className={styles.tabs}>
        {["all", "upcoming", "ongoing", "past"].map((s) => (
          <button
            key={s}
            className={`${styles.tab} ${filters.status === s ? styles.active : ""}`}
            onClick={() => set("status", s)}
          >
            {s === "all"
              ? "🌐 All"
              : s === "upcoming"
                ? "🕐 Upcoming"
                : s === "ongoing"
                  ? "⚡ Ongoing"
                  : "✅ Past"}
          </button>
        ))}
      </div>

      <button className={styles.filterBtn} onClick={() => setOpen(!open)}>
        <Filter size={16} />
        Filters
        <ChevronDown size={16} className={open ? styles.rotated : ""} />
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.panelGrid}>
            {/* Mode */}
            <div className={styles.group}>
              <label className={styles.label}>Mode</label>
              <div className={styles.pills}>
                {["all", "solo", "team"].map((m) => (
                  <button
                    key={m}
                    className={`${styles.pill} ${filters.mode === m ? styles.pillActive : ""}`}
                    onClick={() => set("mode", m)}
                  >
                    {m === "all" ? "All" : m === "solo" ? "👤 Solo" : "👥 Team"}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain */}
            <div className={styles.group}>
              <label className={styles.label}>Domain</label>
              <div className={styles.pills}>
                {domains.map((d) => (
                  <button
                    key={d}
                    className={`${styles.pill} ${filters.domain === d ? styles.pillActive : ""}`}
                    onClick={() => set("domain", d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee */}
            <div className={styles.group}>
              <label className={styles.label}>Registration Fee</label>
              <div className={styles.pills}>
                {[
                  ["all", "All"],
                  ["free", "Free Only"],
                  ["paid", "Paid"],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    className={`${styles.pill} ${filters.fee === val ? styles.pillActive : ""}`}
                    onClick={() => set("fee", val)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prize Pool */}
            <div className={styles.group}>
              <label className={styles.label}>
                Min Prize Pool:{" "}
                <strong>${filters.minPrize?.toLocaleString() || "0"}</strong>
              </label>
              <input
                type="range"
                min={0}
                max={50000}
                step={5000}
                value={filters.minPrize || 0}
                onChange={(e) => set("minPrize", Number(e.target.value))}
                className={styles.range}
              />
              <div className={styles.rangeLabels}>
                <span>$0</span>
                <span>$50K+</span>
              </div>
            </div>
          </div>

          <button
            className={styles.clearBtn}
            onClick={() =>
              onChange({
                status: "all",
                mode: "all",
                domain: "All",
                fee: "all",
                minPrize: 0,
              })
            }
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
