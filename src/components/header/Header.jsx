import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image
            src="/tentacle_logo.png"
            alt="Tentacle Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
        </Link>
        <Link href="/examples/state-checkbox" className={styles.link}>
          State + Checkboxes
        </Link>
        <Link href="/examples/task-manager" className={styles.link}>
          Task Manager
        </Link>
      </nav>
    </header>
  );
}