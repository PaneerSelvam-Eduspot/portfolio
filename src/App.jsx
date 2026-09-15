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
  // Guards the scroll-spy from fighting a nav click: while a smooth
  // scroll triggered by clicking a nav item is still in flight, the
  // sections it scrolls past would otherwise flicker the highlight.
  const isNavigatingRef = useRef(false);
  const navigateTimeoutRef = useRef(null);

  const goTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    isNavigatingRef.current = true;
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.clearTimeout(navigateTimeoutRef.current);
    // Matches roughly how long a smooth scroll across the page takes to
    // settle — long enough that the observer won't override the click
    // mid-scroll, short enough to resume normal scroll-spy right after.
    navigateTimeoutRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, 900);
  }, []);

  // Scroll-spy: highlight whichever section currently occupies the
  // middle of the viewport, so the side nav (and Brand) track normal
  // scrolling the same way the reference site's nav dots do.
  //
  // Each IntersectionObserver callback is incremental — it only reports
  // entries whose ratio crossed a threshold since the last check, not
  // the current state of every observed element. During a fast scroll,
  // a single callback can easily contain just one or two of the four
  // sections. Picking "the most visible" from only that batch (rather
  // than from all four sections' latest known state) means whichever
  // section didn't happen to be in the last batch keeps stale data —
  // in practice this showed up as the nav getting stuck on "Portfolio"
  // even once Contact filled the entire viewport. Keeping a persistent
  // ratio map across every callback, and deciding from that full map
  // each time, fixes it.
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
        // A tall horizontal band through the vertical middle of the
        // viewport — a section only counts once it's genuinely the one
        // being read, not just peeking in at the very top or bottom.
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
    </div>
  );
}

export default App;
