import { useContext } from "react";
import { SystemContext } from "./SystemContext";

export default function useSystem() {
  const context = useContext(SystemContext);

  if (!context) {
    throw new Error("useSystem must be used inside SystemProvider");
  }

  return context;
}
