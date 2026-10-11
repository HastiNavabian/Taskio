// Generates a UUID v4. randomUUID() only exists in secure contexts (HTTPS/localhost),
// so we fall back to getRandomValues(), which works everywhere (e.g. http://192.168.x.x on a phone).
export function newId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}
