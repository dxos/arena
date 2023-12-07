export function arrayToPairs<T>(arr: T[]): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += 2) {
    result.push(arr.slice(i, i + 2));
  }

  return result;
}
