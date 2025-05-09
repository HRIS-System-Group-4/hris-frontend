"use client"

import * as React from "react"
import { useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDown,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EyeIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Define types
type Billing = {
  id: string
  invoiceDate: string
  plan: string
  ammount: string
  status: "pending" | "processing" | "paid" | "failed"
}

type SortDirection = "asc" | "desc" | undefined
type SortField = keyof Billing | undefined

// Status badge component
const StatusBadge = ({ status }: { status: Billing["status"] }) => {
  const statusConfig = {
    pending: { label: "Pending", variant: "outline" as const },
    processing: { label: "Processing", variant: "outline" as const },
    paid: { label: "Paid", variant: "outline" as const },
    failed: { label: "Failed", variant: "destructive" as const },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  )
}


export function TableBilling({ data }: { data: Billing[] }) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>(undefined)
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Get unique values for filters
  const getUniqueValues = <T extends keyof Billing>(field: T): Billing[T][] => {
    return Array.from(new Set(data.map((data) => data[field])))
  }

  const plans = getUniqueValues("plan")
  const statuses = getUniqueValues("status")

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(undefined)
        setSortDirection(undefined)
      } else {
        setSortDirection("asc")
      }
    } else {
      // New field, set to asc
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle row selection
  const toggleRowSelection = (id: string) => {
    const newSelectedRows = new Set(selectedRows)
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id)
    } else {
      newSelectedRows.add(id)
    }
    setSelectedRows(newSelectedRows)
  }

  const toggleAllRows = (checked: boolean) => {
    if (checked) {
      const allIds = filteredData.map((data) => data.id)
      setSelectedRows(new Set(allIds))
    } else {
      setSelectedRows(new Set())
    }
  }


  // Filter Billing based on search and filters
  const filteredData = data.filter((data) => {
    const matchesPlan = selectedPlan ? data.plan === selectedPlan : true
    const matchesStatus = selectedStatus ? data.status === selectedStatus : true

    return matchesPlan && matchesStatus
  })

  // Sort Billing
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField || !sortDirection) return 0

    const fieldA = a[sortField] ?? ""
    const fieldB = b[sortField] ?? ""

    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    return 0
  })


  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedPlan, selectedStatus])

  return (

    <div className="space-y-4">
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Billing..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Branch Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10">
                {selectedPlan || "Plan"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search branch..." />
                <CommandList>
                  <CommandEmpty>No branch found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem onSelect={() => setSelectedPlan(null)} className="justify-between">
                      All
                      {selectedPlan === null && <CheckIcon className="h-4 w-4" />}
                    </CommandItem>
                    {plans.map((plan) => (
                      <CommandItem
                        key={plan}
                        onSelect={() => setSelectedPlan(plan)}
                        className="justify-between"
                      >
                        {plan}
                        {selectedPlan === plan && <CheckIcon className="h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Select
            value={selectedStatus || ""}
            onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[130px] h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("invoiceDate")}>
                <div className="flex items-center">
                  Date
                  <SortIcon field="invoiceDate" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("plan")}>
                <div className="flex items-center">
                  Plan
                  <SortIcon field="plan" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("ammount")}>
                <div className="flex items-center">
                  Ammount
                  <SortIcon field="ammount" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center">
                  Status
                  <SortIcon field="status" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No Billing found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>{data.invoiceDate}</TableCell>
                  <TableCell>{data.plan}</TableCell>
                  <TableCell>{data.ammount}</TableCell>
                  <TableCell>
                    <StatusBadge status={data.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{paginatedData.length > 0 ? startIndex + 1 : 0}</strong> to{" "}
          <strong>{Math.min(startIndex + rowsPerPage, filteredData.length)}</strong> of{" "}
          <strong>{filteredData.length}</strong> Billing
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
            >
              <ChevronsRightIcon className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper components
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-4 w-4", className)}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const SortIcon = ({
  field,
  currentField,
  direction,
}: {
  field: SortField
  currentField: SortField
  direction: SortDirection
}) => {
  if (field !== currentField) {
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  if (direction === "asc") {
    return <ArrowUpIcon className="ml-2 h-4 w-4" />
  }

  if (direction === "desc") {
    return <ArrowDownIcon className="ml-2 h-4 w-4" />
  }

  return <ArrowUpDown className="ml-2 h-4 w-4" />
}
