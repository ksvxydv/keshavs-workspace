import { useEffect, useMemo, useState } from "react";
import { SystemContext } from "./SystemContext";

export function SystemProvider({ children }) {
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(60);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airdrop, setAirdrop] = useState(false);
  const [battery, setBattery] = useState(100);

  useEffect(() => {
    let batteryManager;
    let updateBattery;
    let simulationInterval;

    async function initBattery() {
      if (typeof navigator.getBattery !== "function") {
        let level = 100;
        setBattery(level);

        simulationInterval = window.setInterval(() => {
          level = level <= 5 ? 100 : level - 1;
          setBattery(level);
        }, 60000);

        return;
      }

      try {
        batteryManager = await navigator.getBattery();

        updateBattery = () => {
          const level = batteryManager?.level;

          if (typeof level === "number" && Number.isFinite(level)) {
            setBattery(Math.round(level * 100));
          } else {
            setBattery(100);
          }
        };

        updateBattery();
        batteryManager.addEventListener("levelchange", updateBattery);
      } catch {
        let level = 100;
        setBattery(level);

        simulationInterval = window.setInterval(() => {
          level = level <= 5 ? 100 : level - 1;
          setBattery(level);
        }, 60000);
      }
    }

    initBattery();

    return () => {
      if (!batteryManager) return;

      if (updateBattery) {
        batteryManager.removeEventListener("levelchange", updateBattery);
      }

      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      brightness,
      setBrightness,
      volume,
      setVolume,
      wifi,
      setWifi,
      bluetooth,
      setBluetooth,
      airdrop,
      setAirdrop,
      battery,
      setBattery,
    }),
    [brightness, volume, wifi, bluetooth, airdrop, battery],
  );

  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
}
