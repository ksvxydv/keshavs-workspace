import { FaWifi, FaBluetoothB, FaMoon, FaBroadcastTower } from "react-icons/fa";

import useSystem from "../../core/system/useSystem";
import { useDesktopSettings } from "../../context/useDesktopSettings";

import ToggleButton from "./ToggleButton";
import BrightnessSlider from "./BrightnessSlider";
import VolumeSlider from "./VolumeSlider";
import BatteryCard from "./BatteryCard";

export default function ControlCenter() {
  const {
    wifi,
    setWifi,
    bluetooth,
    setBluetooth,
    airdrop,
    setAirdrop,
    brightness,
    setBrightness,
    volume,
    setVolume,
  } = useSystem();

  const { theme, setTheme } = useDesktopSettings();

  const darkMode = theme === "dark";

  return (
    <div
      className="w-[340px] rounded-[22px] border p-3"
      style={{
        background: "var(--glass)",
        borderColor: "var(--glass-border)",
        backdropFilter: "blur(34px) saturate(180%)",
        WebkitBackdropFilter: "blur(34px) saturate(180%)",
        boxShadow: "var(--window-shadow)",
      }}
    >
      <div className="mb-3 px-1">
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--text)" }}
        >
          Control Center
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <ToggleButton icon={FaWifi} title="Wi‑Fi" subtitle={wifi ? "Connected" : "Off"} active={wifi} onClick={() => setWifi(v => !v)} />
        <ToggleButton icon={FaBluetoothB} title="Bluetooth" subtitle={bluetooth ? "On" : "Off"} active={bluetooth} onClick={() => setBluetooth(v => !v)} />
        <ToggleButton
          icon={FaBroadcastTower}
          title="AirDrop"
          subtitle={airdrop ? "Contacts Only" : "Off"}
          active={airdrop}
          onClick={() => setAirdrop((v) => !v)}
        />
        <ToggleButton
          icon={FaMoon}
          title="Dark Mode"
          subtitle={darkMode ? "On" : "Off"}
          active={darkMode}
          onClick={() => setTheme(darkMode ? "light" : "dark")}
        />
      </div>

      <div className="mt-2.5 space-y-2.5">
        <BrightnessSlider value={brightness} onChange={setBrightness} />
        <VolumeSlider value={volume} onChange={setVolume} />
        <BatteryCard charging={false} />
      </div>
    </div>
  );
}