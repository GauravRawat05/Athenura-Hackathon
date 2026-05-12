import { useState } from 'react';
import { Search, Menu, X, Zap } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo}>
          <div className={styles.logoIcon}><Zap size={18} /></div>
          <span>HackVerse</span>
        </a>

        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search hackathons..."
            value={searchVal}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.links}>
          <a href="#listings" className={styles.link}>Explore</a>
          <a href="#" className={styles.link}>Leaderboard</a>
          <a href="#" className={styles.link}>Blog</a>
          <button className={styles.btnOutline}>Log In</button>
          <button className={styles.btnPrimary}>Sign Up</button>
        </div>

        <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a href="#listings">Explore</a>
          <a href="#">Leaderboard</a>
          <a href="#">Blog</a>
          <button className={styles.btnPrimary}>Sign Up</button>
        </div>
      )}
    </nav>
  );
}
