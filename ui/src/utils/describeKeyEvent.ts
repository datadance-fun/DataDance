export function describeKeyEvent(ev: KeyboardEvent) {
  const result: Array<string> = [];
  if (ev.metaKey) {
    result.push("Cmd");
  }
  if (ev.ctrlKey) {
    result.push("Ctrl");
  }
  if (ev.altKey) {
    result.push("Alt");
  }
  if (ev.shiftKey) {
    result.push("Shift");
  }
  result.push(ev.key);
  return result.join("+");
}
