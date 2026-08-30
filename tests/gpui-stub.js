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

/** @typedef {{method: string, args: unknown[]}} ElementCall */

/**
 * A chainable element recording only the gpui operations our component tests
 * observe. It deliberately models the library boundary, not gpui itself.
 * @param {string} name
 * @param {unknown[]} [args]
 */
export function element(name, args = []) {
  /** @type {ElementCall[]} */
  const elementCalls = [];
  const target = { name, args, calls: elementCalls };
  /** @type {any} */
  let proxy;
  proxy = new Proxy(target, {
    get(value, property) {
      if (property in value) return value[/** @type {keyof typeof value} */ (property)];
      return (...methodArgs) => {
        elementCalls.push({ method: String(property), args: methodArgs });
        if (property === "when") {
          const [condition, callback] = methodArgs;
          if (condition && typeof callback === "function") {
            return callback(proxy);
          }
        }
        return proxy;
      };
    },
  });
  return proxy;
}

export const div = () => element("div");
/** @param {string} asset */
export const svg = (asset) => element("svg", [asset]);
export const h_flex = () => element("h_flex");
export const v_flex = () => element("v_flex");
export const Button = { new: (id) => element("Button", [id]) };
export const Input = { new: (state) => element("Input", [state]) };
