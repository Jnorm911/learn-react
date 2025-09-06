// src/app/components/hero/Hero.jsx
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/hero.jpg"
        alt="Hero image"
        fill
        priority
        className={styles.heroImage}
      />
      <div className={styles.heroContent}>
        <h1>Tentacle Inc</h1>
      </div>
    </section>
  );
}