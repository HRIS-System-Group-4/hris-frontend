import { usePathname } from "next/navigation"

export function useBreadcrumbSegments() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return segments.map((segment, index) => {
    // Kustomisasi label breadcrumb
    const label = (() => {
      if (segment === "dashboard") return null
      if (segment === "add") return "Add"
      if (/^[0-9a-fA-F-]+$/.test(segment)){
          if (segments[index - 1] === "employee")
          return "Detail"
        }
      if (segment === "edit") return "Edit"
      return segment.charAt(0).toUpperCase() + segment.slice(1)
    })()

    const href = "/" + segments.slice(0, index + 1).join("/")

    return label ? { label, href, isLast: index === segments.length - 1 } : null
  }).filter(Boolean) as { label: string; href: string; isLast: boolean }[];
}
