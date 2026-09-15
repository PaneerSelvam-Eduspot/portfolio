import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={styles.themeBtn}
      onClick={onToggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {isLight ? (
        <Sun size={18} strokeWidth={2.25} className={styles.sunIcon} aria-hidden="true" />
      ) : (
        <Moon size={18} strokeWidth={2.25} className={styles.moonIcon} aria-hidden="true" />
      )}
    </button>
  );
}
