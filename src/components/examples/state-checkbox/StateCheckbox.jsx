"use client";
import styles from "./StateCheckbox.module.css";
import SingleCB from "./single-cb/SingleCB"; // Import child component
import MultiCB from "./multi-cb/MultiCB"

// Parent container to hold future child components
export default function StateCheckbox() {
  return (
    <div className={styles.container}>
      <h2>State Checkbox Examples</h2>
      {/* Child components will be called here */}
      <SingleCB />
      <MultiCB />
    </div>
  );
}