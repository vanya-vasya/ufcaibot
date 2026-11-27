export const normalizeName = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** True when two fighter names plausibly refer to the same person. */
export const namesMatch = (candidate: string, target: string): boolean => {
  const a = normalizeName(candidate);
  const b = normalizeName(target);
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;

  const lastNameA = a.split(" ").pop();
  const lastNameB = b.split(" ").pop();
  return lastNameA === lastNameB && a[0] === b[0];
};
