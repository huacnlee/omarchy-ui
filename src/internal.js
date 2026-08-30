// @ts-check

/** @param {string} component @param {unknown} id @returns {string} */
export function stableId(component, id) {
  if (typeof id !== "string" || id.trim() === "") {
    throw new Error(`${component} id must be a non-blank string`);
  }
  return id;
}
