export function toTitleCase(str: string) {
  return str
    .replace(/[-_]/g, " ") // ubah '-' atau '_' jadi spasi
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
