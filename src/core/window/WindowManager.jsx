import useWindowManager from "./useWindowManager";
import { WindowManagerContext } from "./WindowManagerContext";

export default function WindowManager({ children }) {
  const windowManager = useWindowManager();

  return (
    <WindowManagerContext.Provider value={windowManager}>
      {typeof children === "function" ? children(windowManager) : children}
    </WindowManagerContext.Provider>
  );
}
