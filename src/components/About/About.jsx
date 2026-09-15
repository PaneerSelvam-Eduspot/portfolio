import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { stats, skills, education } from "../../data/about";
import styles from "./About.module.css";

// Section heading — a small fade + rise, replaying every time it
// scrolls into view (not just the first time).
const titleReveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Text blocks: the heading, then the paragraph, then the button — each
// one its own "brick", laid down in sequence rather than all appearing
// at once.
const textStack = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const textItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// Icon/stat grids — same idea, tighter stagger since there are more items.
const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Skills & Graduation only: a slight left-to-right drift instead of the
// plain rise used everywhere else, so this block reads a little
// differently from the stat cards above it.
const slideRight = {
  hidden: { opacity: 0, x: -22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function About() {
  return (
    <>
      <motion.div
        className="main-title"
        variants={titleReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.6 }}
      >
        <h2>
          About <span>Me</span>
          <span className="bg-text" aria-hidden="true">
            About
          </span>
        </h2>
      </motion.div>

      <div className={styles.aboutContainer}>
        <motion.div
          className={styles.leftAbout}
          variants={textStack}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.h4 variants={textItem}>Information About Me</motion.h4>
          <motion.p variants={textItem}>
         Passionate SDE 1 focused on building innovative, user-centric web applications with strong front-end expertise. Eager to contribute to scalable, efficient solutions while continuously learning, writing high-quality code, and improving user experiences.
          </motion.p>
          <motion.div className="btn-con" variants={textItem}>
            <a href="/resume.pdf" className="main-btn" download>
              <span className="btn-icon">
                <Download size={17} strokeWidth={2.25} aria-hidden="true" />
              </span>
              <span className="btn-text">Download CV</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.rightAbout}
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
        >
          {stats.map((stat) => (
            <motion.div
              className={styles.aboutItem}
              key={stat.label}
              variants={gridItem}
            >
              <div className={styles.abtText}>
                <p className={styles.largeText}>{stat.value}</p>
                <p className={styles.smallText}>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.aboutStats}>
        <motion.h4
          variants={textItem}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.6 }}
        >
          Skills &amp; Graduation
        </motion.h4>

        <div className={styles.statGrid}>
          <motion.div
            className={styles.imgDir}
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
          >
            {skills.map((skill) => (
              <motion.div
                className={styles.skillIcon}
                key={skill.name}
                variants={slideRight}
                style={{ "--accent": skill.accent }}
                title={skill.name}
              >
                <img src={skill.icon} alt={skill.name} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.education}
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 }}
          >
            <div className={styles.yr}>
              <p>{education.years}</p>
            </div>
            <div className={styles.degree}>
              <p>{education.degree}</p>
              <p>
                <span>{education.institute}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
