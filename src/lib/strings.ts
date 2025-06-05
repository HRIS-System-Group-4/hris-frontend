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