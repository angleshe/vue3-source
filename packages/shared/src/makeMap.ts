export function makeMap(str: string): (key: string) => boolean {
  const set = str.split(',').reduce((prev, curr) => {
    prev.add(curr);
    return prev;
  }, new Set<string>());

  return (key: string) => set.has(key);
}
