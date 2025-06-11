import { usePathname } from "next/navigation"

function toTitleCase(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function useBreadcrumbSegments() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return segments.map((segment, index) => {
    // Kustomisasi label breadcrumb
    const label = (() => {
      if (segment === "dashboard" && segments[index + 1] != null) return null
      if (segment === "add") return "Add"
      if (/^[0-9a-fA-F-]+$/.test(segment)) {
        if (segments[index - 1] === "edit")
          return "Edit"
        if (segments[index - 1] != null)
          return "Detail"
      }
      if (segment.includes("=")) {
        return "Detail";
      }
      if (segment === "edit") return null
      return toTitleCase(segment)
    })()

    const href = "/" + segments.slice(0, index + 1).join("/")

    return label ? { label, href, isLast: index === segments.length - 1 } : null
  }).filter(Boolean) as { label: string; href: string; isLast: boolean }[];
}
