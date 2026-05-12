import styles from './StatsBanner.module.css';

const stats = [
  { value: '250K+', label: 'Participants' },
  { value: '10+', label: 'Years Running' },
  { value: '99%', label: 'Satisfaction Rate' },
  { value: '200K+', label: 'Prizes Awarded' },
];

export default function StatsBanner() {
  return (
    <section className={styles.banner}>
      <div className={`container ${styles.grid}`}>
        {stats.map((s, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.value}>{s.value}</div>
            <div className={styles.label}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
