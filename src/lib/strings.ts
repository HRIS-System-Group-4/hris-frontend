export function toTitleCase(str: string) {
  return str
    .replace(/[-_]/g, " ") // ubah '-' atau '_' jadi spasi
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getInitials(text: string): string {
  return text
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatTimeToDuration(timeString: string | null): string {
  if (!timeString) return "-";

  const [hoursStr, minutesStr] = timeString.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Tambahkan 1 jam jika jam tidak 0 (karena seperti 08 dianggap 9 jam mungkin dari feedback user)
  const finalHours = hours === 0 ? 0 : hours;

  return `${finalHours}h ${minutes}m`;
}
