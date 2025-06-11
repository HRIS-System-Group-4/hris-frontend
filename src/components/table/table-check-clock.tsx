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
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { formatWorkType } from "@/lib/utils/workType"

type CheckClock = {
  id: string
  name: string
  totalEmployee: string
  type: "wfo" | "wfa" | "hybrid"
}

type SortDirection = "asc" | "desc" | undefined
type SortField = keyof CheckClock | undefined

export function TableCheckClock({ data }: { data: CheckClock[] }) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  // const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  // const [selectedJobTitle, setSelectedJobTitle] = useState<string | null>(null)
  // const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>(undefined)
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Get unique values for filters
  const getUniqueValues = <T extends keyof CheckClock>(field: T): CheckClock[T][] => {
    return Array.from(new Set(data.map((data) => data[field])))
  }

  // const branches = getUniqueValues("branch")
  // const jobTitles = getUniqueValues("jobTitle")
  // const grades = getUniqueValues("grade")
  const types = getUniqueValues("type")

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
      const allIds = filteredDatas.map((data) => data.id)
      setSelectedRows(new Set(allIds))
    } else {
      setSelectedRows(new Set())
    }
  }

  // // Handle view details
  // const handleViewDetails = (data: CheckClock) => {
  //   toast({
  //     title: "View Employee Details",
  //     description: `Viewing details for ${data.firstName} ${employee.lastName}`,
  //   })
  // }

  // Handle delete
  const handleDelete = (data: CheckClock) => {
    toast({
      title: "Delete Employee",
      description: `Are you sure you want to delete ${data.name} ?`,
      variant: "destructive",
    })
  }

  // Filter employees based on search and filters
  const filteredDatas = data.filter((data) => {
    const matchesSearch = searchQuery ? data.name.includes(searchQuery.toLowerCase()) : true

    const matchesTypes = selectedTypes ? data.type === selectedTypes : true

    return matchesSearch && matchesTypes
  })

  // Sort employees
  const sortedDatas = [...filteredDatas].sort((a, b) => {
    if (!sortField || !sortDirection) return 0

    const fieldA = a[sortField] ?? ""
    const fieldB = b[sortField] ?? ""

    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    return 0
  })


  // Pagination
  const totalPages = Math.ceil(sortedDatas.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedDatas = sortedDatas.slice(startIndex, startIndex + rowsPerPage)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedTypes])

  return (

    <div className="space-y-4">
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search check clock..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">

          {/* Status Filter */}
          <Select
            value={selectedTypes || ""}
            onValueChange={(value) => setSelectedTypes(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[130px] h-10">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Type</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  Check Clock Name
                  <SortIcon field="name" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("totalEmployee")}>
                <div className="flex items-center">
                  Total Employee
                  <SortIcon field="totalEmployee" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                <div className="flex items-center">
                  Type
                  <SortIcon field="type" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDatas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDatas.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.totalEmployee}</TableCell>
                  <TableCell>
                    {formatWorkType(data.type)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/check-clock/${data.id}`}>
                        <Button variant="ghost" size="icon">
                          <EyeIcon className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
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
          Showing <strong>{paginatedDatas.length > 0 ? startIndex + 1 : 0}</strong> to{" "}
          <strong>{Math.min(startIndex + rowsPerPage, filteredDatas.length)}</strong> of{" "}
          <strong>{filteredDatas.length}</strong> employees
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
