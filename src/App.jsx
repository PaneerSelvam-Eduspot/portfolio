import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "./hooks/useTheme";
import { sections } from "./data/sections";
import Brand from "./components/Brand/Brand";
import SideNav from "./components/SideNav/SideNav";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import SocialIcons from "./components/SocialIcons/SocialIcons";
import Header from "./components/Header/Header";
import About from "./components/About/About";
import Portfolio from "./components/Portfolio/Portfolio";
import Contact from "./components/Contact/Contact";
import "./App.css";

const pages = {
  home: Header,
  about: About,
  portfolio: Portfolio,
  contact: Contact,
};

function App() {
  const [active, setActive] = useState("home");
  const { theme, toggleTheme } = useTheme();
  const observerRef = useRef(null);
 .
  const isNavigatingRef = useRef(false);
  const navigateTimeoutRef = useRef(null);

  const goTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    isNavigatingRef.current = true;
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.clearTimeout(navigateTimeoutRef.current);

    navigateTimeoutRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, 900);
  }, []);



  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    const ratios = new Map(elements.map((el) => [el.id, 0]));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        if (isNavigatingRef.current) return;

        let bestId = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActive(bestId);
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(navigateTimeoutRef.current), []);

  return (
    <div className="app">
      <Brand onNavigate={goTo} />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <main>
        {sections.map((section) => {
          const Page = pages[section.id];
          return (
            <section
              key={section.id}
              id={section.id}
              className="section"
              aria-label={section.label}
            >
              <Page onNavigate={goTo} />
            </section>
          );
        })}
      </main>

      <SideNav active={active} onNavigate={goTo} />
      <SocialIcons />
    <footer className="footer">
      <p>&copy; 2026 PaneerSelvam. All rights reserved.</p>
    </footer>

    </div>
  );
}

export default App;
