const meta = navigator.platform.indexOf("Mac") > -1 ? "⌘" : "Ctrl";

export function prettyPrintHotKey(hotKeys: string): string {
  return hotKeys.replace("Shift", "⇧").replace("Meta", meta);
}
