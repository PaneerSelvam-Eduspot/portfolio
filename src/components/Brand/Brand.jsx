import styles from "./Brand.module.css";

export default function Brand({ onNavigate }) {
  return (
    <button
      type="button"
      className={styles.brand}
      onClick={() => onNavigate("home")}
      aria-label="Paneer Selvam — go to home section"
    >
      Paneer Selvam
    </button>
  );
}
