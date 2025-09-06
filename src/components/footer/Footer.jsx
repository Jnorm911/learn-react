// src/app/components/footer/Footer.jsx
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2025 My Site</p>
      <div>
        <span className={styles.socialIcon}>📱</span>
        <span className={styles.socialIcon}>🐦</span>
        <span className={styles.socialIcon}>📷</span>
      </div>
    </footer>
  );
}