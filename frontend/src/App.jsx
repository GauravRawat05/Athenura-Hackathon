import { useState, useMemo, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
//import HackathonCard from './components/HackathonCard';
import HackathonModal from "./components/HackathonModal";
import StatsBanner from "./components/StatsBanner";
//import Footer from './components/Footer';
import { hackathons } from "./data/hackathons";
import styles from "./App.module.css";
const defaultFilters = {
  status: "all",
  mode: "all",
  domain: "All",
  fee: "all",
  minPrize: 0,
};

export default function App() {
  const [filters, setFilters] = useState(defaultFilters);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const listingsRef = useRef(null);

  const filtered = useMemo(() => {
    return hackathons.filter((h) => {
      if (filters.status !== "all" && h.status !== filters.status) return false;
      if (filters.mode !== "all" && h.mode !== filters.mode) return false;
      if (filters.domain !== "All" && h.domain !== filters.domain) return false;
      if (filters.fee === "free" && h.fee !== 0) return false;
      if (filters.fee === "paid" && h.fee === 0) return false;
      if (h.prizePool < filters.minPrize) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          h.title.toLowerCase().includes(q) ||
          h.tagline.toLowerCase().includes(q) ||
          h.domain.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [filters, search]);

  return (
    <div>
      <Navbar onSearch={setSearch} />
      <Hero
        onExplore={() =>
          listingsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <StatsBanner />
      <main
        className={`container ${styles.main}`}
        ref={listingsRef}
        id="listings"
      >
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Discover Hackathons</h2>
            <p className={styles.sectionSub}>
              {filtered.length} hackathon{filtered.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>
        </div>
        <Filters filters={filters} onChange={setFilters} />
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No hackathons found</h3>
            <p>Try adjusting your filters or search query</p>
            <button
              className={styles.resetBtn}
              onClick={() => {
                setFilters(defaultFilters);
                setSearch("");
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((h, i) => (
              <div key={h.id} onClick={() => setSelected(h)}>
                {h.title}
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && (
        <HackathonModal
          hackathon={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
