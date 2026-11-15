const _state = {
  usuario: null,
  sessionChecked: false,
  sessionCheckedAt: 0,
};

const _listeners = new Set();

export function getState() {
  return { ..._state };
}

export function setState(patch) {
  Object.assign(_state, patch);
  _listeners.forEach((fn) => fn(getState()));
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function resetSession() {
  setState({ usuario: null, sessionChecked: false, sessionCheckedAt: 0 });
}
