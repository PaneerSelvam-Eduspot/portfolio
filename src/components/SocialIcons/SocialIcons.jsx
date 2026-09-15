import { GithubIcon, LinkedinIcon, XIcon } from "../icons/BrandIcons";
import { socials } from "../../data/socials";
import styles from "./SocialIcons.module.css";

const ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
};

export default function SocialIcons() {
  return (
    <div className={styles.contactIcon}>
      {socials.map((social) => {
        const Icon = ICONS[social.icon];
        return (
          <a
            key={social.id}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
          >
            <Icon size={16} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
