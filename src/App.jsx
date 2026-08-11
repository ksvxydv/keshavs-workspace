import { SystemProvider } from "./core/system/SystemProvider";
import useSystem from "./core/system/useSystem";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Desktop from "./components/Desktop/Desktop";
import StartupSequence from "./components/Startup/StartupSequence";

function AppContent() {
  const { theme } = useSystem();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const [bootFinished, setBootFinished] = useState(false);

  return (
    <>
      <Desktop />

      <AnimatePresence>
        {!bootFinished && (
          <StartupSequence
            key="startup"
            onComplete={() => setBootFinished(true)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}
