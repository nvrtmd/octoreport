export function uniqueArray<T>(array: T[] | null): T[] | null {
  return array ? Array.from(new Set(array)) : null;
}
