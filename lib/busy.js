// Tiny client-side busy store. Operations call showBusy(message) before
// their fetch and hideBusy() in finally — which runs only after the full
// response body is received and parsed, never on headers alone.
let listeners = new Set();
let state = { on: false, message: "" };

function emit() {
  listeners.forEach((fn) => fn(state));
}

export function showBusy(message) {
  state = { on: true, message: message || "" };
  emit();
}

export function hideBusy() {
  state = { on: false, message: "" };
  emit();
}

export function subscribeBusy(fn) {
  listeners.add(fn);
  fn(state);
  return () => {
    listeners.delete(fn);
  };
}
