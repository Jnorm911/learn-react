"use client"; // Marks this as a client component so we can use state and events (basically a component that requires interaction)
import { useState } from "react"; // React hook for local state
import styles from "./SingleCB.module.css"; // Scoped CSS module, styles can be called and used

// Function using React Hook
export default function StateCheckbox() {
  // value, setValue, in this case boolean because we use (false), can be other types
  const [checked, setChecked] = useState(false); // checked = state, setChecked = updater
  return (
    <div className={styles.container}>
      {/* Header for the checkbox example */}
      <h2 className={styles.heading}>Checkpoint 1: Single Checkbox</h2>
      {/* Label wraps checkbox and text for better accessibility */}
      <label className={styles.option}>
        {/* Controlled checkbox: checked is state, onChange toggles it */}
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        Accept terms
      </label>
      {/* Status text reflects checkbox state */}
      <p className={styles.status}>
        Status: {checked ? "Checked" : "Not checked"}
      </p>
    </div>
  );
}