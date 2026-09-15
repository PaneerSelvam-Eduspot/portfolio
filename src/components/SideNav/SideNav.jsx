import { House, User, Briefcase, Mail } from "lucide-react";
import { sections } from "../../data/sections";
import styles from "./SideNav.module.css";

const ICONS = {
  home: House,
  about: User,
  portfolio: Briefcase,
  contact: Mail,
};

export default function SideNav({ active, onNavigate }) {
  return (
    <nav className={styles.controls} aria-label="Section navigation">
      {sections.map((section) => {
        const Icon = ICONS[section.icon];
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            type="button"
            className={`${styles.control} ${isActive ? styles.activeBtn : ""}`}
            onClick={() => onNavigate(section.id)}
            aria-label={section.label}
            aria-current={isActive}
          >
            <Icon size={17} strokeWidth={2.25} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
