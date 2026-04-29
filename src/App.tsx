import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { SideNav } from "@/components/SideNav";
import { Hero } from "@/components/sections/Hero";
import { Snapshot } from "@/components/sections/Snapshot";
import { Phase1 } from "@/components/sections/Phase1";
import { Phase2 } from "@/components/sections/Phase2";
import { Phase3 } from "@/components/sections/Phase3";
import { Phase4 } from "@/components/sections/Phase4";
import { Phase5 } from "@/components/sections/Phase5";
import { Recovery } from "@/components/sections/Recovery";
import { Outcome } from "@/components/sections/Outcome";
import { Footer } from "@/components/sections/Footer";
import { Timeline } from "@/components/sections/Timeline";

export type View = "report" | "timeline";

function readHash(): View {
  if (typeof window === "undefined") return "report";
  const h = window.location.hash.replace(/^#/, "").toLowerCase();
  return h.startsWith("timeline") ? "timeline" : "report";
}

export default function App() {
  const [view, setViewState] = useState<View>(readHash());

  const setView = (v: View) => {
    setViewState(v);
    if (v === "timeline") {
      window.location.hash = "timeline";
    } else if (window.location.hash === "#timeline") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  useEffect(() => {
    const onHash = () => setViewState(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-ink">
      <TopBar view={view} onChange={setView} />
      {view === "report" && <SideNav />}
      <main>
        <AnimatePresence mode="wait">
          {view === "report" ? (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Hero />
              <Snapshot />
              <Phase1 />
              <Phase2 />
              <Phase3 />
              <Phase4 />
              <Phase5 />
              <Recovery />
              <Outcome />
              <Footer />
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Timeline />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
