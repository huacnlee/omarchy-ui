// @ts-check

/** @type {Array<{name: string, args: unknown[]}>} */
export const calls = [];

export function record(name, ...args) {
  calls.push({ name, args });
  return { name, args };
}

export function reset() {
  calls.length = 0;
}
