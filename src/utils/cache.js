export function cache(self, prop, func) {
  const cache = self[prop];
  if (cache !== undefined) return cache;
  const result = func();
  self[prop] = result;
  return result;
}
