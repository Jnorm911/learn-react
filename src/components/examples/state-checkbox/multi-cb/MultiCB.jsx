"use client";
import { useState } from "react";
import styles from "./MultiCB.module.css";

export default function MultiCB() {
  const [checked, setChecked] = useState([]);
  const options = ["React", "Next.js", "TypeScript", "Node.js"];
  const handleChange = (option) => {
    setChecked((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Checkpoint 2: Multi Checkbox</h2>
      {options.map((option) => (
        <label className={styles.option} key={option}>
          <input
            type="checkbox"
            value={option}
            checked={checked.includes(option)}
            onChange={() => handleChange(option)}
          />
          {option}
        </label>
      ))}
      <div>
        Selected: {checked.join(", ")}
      </div>
    </div>
  );
}
