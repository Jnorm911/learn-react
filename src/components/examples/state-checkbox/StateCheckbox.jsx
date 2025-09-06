"use client";
import { useState } from "react";
import styles from "./StateCheckbox.module.css";

export default function StateCheckbox() {
  // list of options
  const options = ["JavaScript", "TypeScript", "React", "Angular"];
  // track selected items
  const [selected, setSelected] = useState([]);

  const toggleSelection = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Pick your skills</h2>
      {options.map((option) => (
        <label key={option} className={styles.option}>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggleSelection(option)}
          />
          {option}
        </label>
      ))}

      <p>
        Selected:{" "}
        {selected.length > 0 ? selected.join(", ") : "None"}
      </p>
    </div>
  );
}