export function ms({
  minutes = 0,
  hours = 0,
  seconds = 0,
}: {
  minutes?: number;
  hours?: number;
  seconds?: number;
}) {
  const totalSeconds = minutes * 60 + hours * 3600 + seconds;
  return totalSeconds * 1000;
}
