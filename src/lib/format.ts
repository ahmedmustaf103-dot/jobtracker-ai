/** Format a count with correct singular/plural noun. */
export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return count === 1 ? singular : plural;
}

export function formatCountLabel(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${pluralize(count, singular, plural)}`;
}
