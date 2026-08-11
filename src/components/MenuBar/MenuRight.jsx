import {
  IconDeviceAirpods,
  IconWifi,
  IconBattery3,
  IconAdjustmentsHorizontal,
} from "@tabler/icons-react";

import useSystem from "../../core/system/useSystem";

export default function MenuRight({
  children,
  onMusic,
  onWifi,
  onBattery,
  onControlCenter,
}) {
  const { wifi, battery } = useSystem();
  const iconProps = { size: 16, stroke: 1.65 };

  const Item = ({ children: icon, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md px-1.5 transition-all duration-150"
      style={{ color: "var(--text)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
    </button>
  );

  return (
    <div
      className="flex items-center gap-1 text-[13px] font-medium"
      style={{ color: "var(--text)" }}
    >
      <Item onClick={onMusic}>
        <IconDeviceAirpods {...iconProps} />
      </Item>

      <Item onClick={onWifi}>
        <IconWifi
          {...iconProps}
          style={{ opacity: wifi ? 1 : 0.4 }}
        />
      </Item>

      <Item onClick={onBattery}>
        <IconBattery3
          {...iconProps}
          style={{ color: battery <= 20 ? "var(--accent)" : "var(--text)" }}
        />
        <span className="ml-1 text-[12px] font-medium leading-none">
          {battery}%
        </span>
      </Item>

      <div
        className="ml-1 rounded-md px-2 py-1 transition-colors duration-150"
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {children}
      </div>

      <Item onClick={onControlCenter}>
        <IconAdjustmentsHorizontal {...iconProps} />
      </Item>
    </div>
  );
}
