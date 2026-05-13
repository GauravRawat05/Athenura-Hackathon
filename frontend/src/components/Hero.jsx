import { ArrowRight, Trophy, Users, Zap } from 'lucide-react';
import styles from './Hero.module.css';

const stats = [
  { icon: <Trophy size={20} />, label: 'Prize Pool', value: '$2M+' },
  { icon: <Users size={20} />, label: 'Participants', value: '50K+' },
  { icon: <Zap size={20} />, label: 'Hackathons', value: '200+' },
];

export default function Hero({ onExplore }) {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grid} />
      </div>

      <div className={`container ${styles.content}`}>
        <div className={`${styles.badge} animate-fade-up`}>
          <span className={styles.badgeDot} />
          🔥 Live hackathons happening now
        </div>

        <h1 className={`${styles.title} animate-fade-up delay-1`}>
          Where Builders
          <br />
          <span className={styles.gradient}>Win Big.</span>
        </h1>

        <p className={`${styles.subtitle} animate-fade-up delay-2`}>
          Discover hackathons across AI, Blockchain, CleanTech & more.
          Compete solo or as a team. Earn prizes, gain recognition, and launch your next big idea.
        </p>

        <div className={`${styles.actions} animate-fade-up delay-3`}>
          <button className={styles.btnPrimary} onClick={onExplore}>
            Explore Hackathons
            <ArrowRight size={18} />
          </button>
          <button className={styles.btnSecondary}>
            How It Works
          </button>
        </div>

        <div className={`${styles.stats} animate-fade-up delay-4`}>
          {stats.map((s, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.floatingCards}>
        <div className={`${styles.card} ${styles.card1}`}>
          <span>🤖</span> AI Frontier Challenge
          <span className={styles.prize}>$50K Prize</span>
        </div>
        <div className={`${styles.card} ${styles.card2}`}>
          <span>⛓️</span> Web3 BuildWeek
          <span className={styles.live}>● LIVE</span>
        </div>
        <div className={`${styles.card} ${styles.card3}`}>
          <span>🌿</span> GreenTech Sprint
          <span className={styles.soon}>Soon</span>
        </div>
      </div>
    </section>
  );
}
