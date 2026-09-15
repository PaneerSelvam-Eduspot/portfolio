import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { GithubIcon } from "../icons/BrandIcons";
import { projects } from "../../data/projects";
import styles from "./Portfolio.module.css";

const titleReveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function Portfolio() {
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
          My <span>Portfolio</span>
          <span className="bg-text" aria-hidden="true">
            Work
          </span>
        </h2>
      </motion.div>
      <motion.p
        className={styles.portText}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      >
        Here are some of my recent works and projects that I have completed.
      </motion.p>

      <motion.div
        className={styles.portfolios}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
      >
        {projects.map((project) => (
          <motion.article
            className={styles.portfolioItem}
            key={project.id}
            variants={item}
          >
            <div className={styles.image}>
              <img src={project.image} alt={project.title} loading="lazy" />
            </div>
            <div className={styles.hoverItems}>
              <h3>{project.title}</h3>
              <div className={styles.icons}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.icon}
                  aria-label={`${project.title} on GitHub`}
                >
                  <GithubIcon size={17} aria-hidden="true" />
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.icon}
                  aria-label={`View ${project.title} live`}
                >
                  <Eye size={17} strokeWidth={2.25} aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </>
  );
}
