import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CircleCheck, CircleAlert } from "lucide-react";
import { contactInfo } from "../../data/contact";
import styles from "./Contact.module.css";

const initialForm = { name: "", email: "", message: "" };

const titleReveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const leftStack = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const leftItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};


const infoGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const infoItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const formStack = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const formItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};


export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function domainAcceptsMail(email) {
    const domain = email.split("@")[1];
    if (!domain) return false;

    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      const data = await res.json();
      return Boolean(data.Answer && data.Answer.length > 0);
    } catch {
      return true;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      console.error("Missing VITE_FORMSPACE_ENDPOINT - check your .env file.")
      setStatus("error");
      return;
    }

    setStatus("checking");

    const validEmail = await domainAcceptsMail(form.email);
    if (!validEmail) {
      setStatus("invalid-email");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("sent");
        setForm(initialForm);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error");
    }
  }

  return (
    <div className={styles.contactContainer}>
      <motion.div
        className="main-title"
        variants={titleReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.6 }}
      >
        <h2>
          Contact <span>Me</span>
          <span className="bg-text" aria-hidden="true">
            Talk
          </span>
        </h2>
      </motion.div>

      <div className={styles.contactContentCon}>
        <motion.div
          className={styles.leftContact}
          variants={leftStack}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.h4 variants={leftItem}>Get In Touch</motion.h4>
          <motion.div className={styles.contactInfo} variants={infoGrid}>
            {contactInfo.map((item) => (
              <motion.a
                href={item.href}
                className={styles.contactItem}
                key={item.id}
                variants={infoItem}
              >
                <div className={styles.icon}>
                  <img src={item.icon} alt="" aria-hidden="true" />
                </div>
                <span>{item.value}</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <div className={styles.rightContact}>
          <motion.form
            className={styles.contactForm}
            onSubmit={handleSubmit}
            variants={formStack}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.div className={styles.inputControl} variants={formItem}>
              <input
                type="text"
                name="name"
                required
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
              />
            </motion.div>
            <motion.div className={styles.inputControl} variants={formItem}>
              <input
                type="email"
                name="email"
                required
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
              />
            </motion.div>
            <motion.div className={styles.inputControl} variants={formItem}>
              <textarea
                name="message"
                cols="15"
                rows="6"
                required
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
              ></textarea>
            </motion.div>
            <motion.div className={styles.submitRow} variants={formItem}>
              <div className="btn-con">
                <button type="submit" className="main-btn" disabled={status === "sending" || status === "checking"}>
                  <span className="btn-icon">
                    <Send size={16} strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <span className="btn-text">
                    {status === "checking" ? "Checking...": status === "sending" ? "Sending..." : "Send Message"}
                  </span>
                </button>
              </div>
              <AnimatePresence mode="wait">
                {status === "sent" && (
                  <motion.p
                    key="sent"
                    className={styles.sentNote}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    role="status"
                  >
                    <CircleCheck size={15} strokeWidth={2.25} aria-hidden="true" />{" "}
                    Thanks - Your message is on its way. I'll get back to you soon.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                   key="error"
                   className={styles.errorNote}
                   initial={{ opacity: 0, y: 6 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 6 }}
                   role="status"
                  >
                   <CircleAlert size={15} strokeWidth={2.25} aria-hidden="true" />{" "}
                   Something went wrong -please try again, or email me directly.
                  </motion.p>
                )}
                {status === "invalid-email" && (
                  <motion.p
                   key="invalid-email"
                   className={styles.errorNote}
                   initial={{ opacity: 0, y: 6 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 6 }}
                   role="status"
                  >
                    <CircleAlert size={15} strokeWidth={2.25} aria-hidden="true" /> {" "}
                    That email address doesn't look deliverable - please double check it.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
