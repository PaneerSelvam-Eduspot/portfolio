import { motion } from "framer-motion";
import { Download, Code2, ChevronDown } from "lucide-react";
import styles from "./Header.module.css";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// The photo + orbiting badges animate as one coordinated group, and —
// unlike the text beside them — replay every time this group scrolls
// into view (not just on first load): scroll down away from the hero
// and the whole cluster zooms back out, scroll back up and it zooms
// back in, picture and icons together.
const heroVisual = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const photoZoom = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    y: 16,
    transition: { duration: 0.3, ease: "easeIn" },
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      // opacity/y get their own plain tween — letting them share the
      // spring below (meant for "scale") left opacity sitting stuck at
      // 0 for the entire bounce, only snapping to 1 once the spring
      // fully settled, instead of fading in smoothly alongside it
      opacity: { duration: 0.3, ease: "easeOut" },
      y: { duration: 0.4, ease: "easeOut" },
      scale: { type: "spring", stiffness: 190, damping: 13, mass: 0.9 },
    },
  },
};

const badgeZoom = {
  hidden: {
    opacity: 0,
    scale: 0.25,
    transition: { duration: 0.25, ease: "easeIn" },
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: 0.25, ease: "easeOut" },
      scale: { type: "spring", stiffness: 320, damping: 10 },
    },
  },
};

export default function Header({ onNavigate }) {
  return (
    <div className={styles.headerContent}>
      <motion.div
        className={styles.leftHeader}
        variants={heroVisual}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
      >
        <div className={styles.aura} aria-hidden="true"></div>
        <div className={styles.auraDrift} aria-hidden="true"></div>
        <div className={styles.ring} aria-hidden="true"></div>
        <motion.div className={styles.image} variants={photoZoom}>
          <img src="/img/port_dp_.png" alt="Portrait of Paneer Selvam" />
        </motion.div>

        {/* floating skill badges around the photo — a nod to the
            reference hero's orbiting tech-icon bubbles, using icons
            for skills that are already in the About section. They
            zoom in/out as one group with the photo (variants above),
            then keep floating gently in sync with it once settled
            (see the shared "float" animation in Header.module.css). */}
        <motion.div
          className={`${styles.badge} ${styles.badgeCode}`}
          variants={badgeZoom}
        >
          <Code2 size={18} strokeWidth={2.25} aria-hidden="true" />
        </motion.div>
        <motion.div
          className={`${styles.badge} ${styles.badgeReact}`}
          variants={badgeZoom}
        >
          <img src="/img/react-2.svg" alt="" aria-hidden="true" />
        </motion.div>
        <motion.div
          className={`${styles.badge} ${styles.badgeJs}`}
          variants={badgeZoom}
        >
          <img src="/img/JavaScript.svg" alt="" aria-hidden="true" />
        </motion.div>
        <motion.div
          className={`${styles.badge} ${styles.badgeTs}`}
          variants={badgeZoom}
        >
          <img src="/img/TypeScript.svg" alt="" aria-hidden="true" />
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.rightHeader}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p className={styles.eyebrow} variants={item}>
          Hi, I'm{" "}
          <img
            src="/img/Hello.png"
            alt=""
            className={styles.wave}
            aria-hidden="true"
          />
        </motion.p>
        <motion.h1 className={styles.bigName} variants={item}>
          Paneer Selvam
        </motion.h1>
        <motion.p className={styles.role} variants={item}>
          Software <span>Engineer</span>
        </motion.p>
        <motion.p className={styles.tagline} variants={item}>
          A passionate SDE 1 who loves building clean, user-centric web
          applications.
        </motion.p>
        <motion.div className="btn-con" variants={item}>
          <a href="/resume.pdf" className="main-btn" download>
            <span className="btn-icon">
              <Download size={17} strokeWidth={2.25} aria-hidden="true" />
            </span>
            <span className="btn-text">Download CV</span>
          </a>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        className={styles.scrollCue}
        onClick={() => onNavigate?.("about")}
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <span>Scroll</span>
        <ChevronDown size={16} strokeWidth={2.25} aria-hidden="true" />
      </motion.button>
    </div>
  );
}
