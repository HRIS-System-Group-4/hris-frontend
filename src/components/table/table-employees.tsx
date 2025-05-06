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
type Employee = {
  id: string
  firstName: string
  lastName: string
  avatar?: string
  jobTitle: string
  grade: string
  branch: string
  status: "active" | "inactive" | "pending" | "suspended"
  email: string
  phone: string
  startDate: string
  department: string
}

type SortDirection = "asc" | "desc" | undefined
type SortField = keyof Employee | undefined

// Status badge component
const StatusBadge = ({ status }: { status: Employee["status"] }) => {
  const statusConfig = {
    active: { label: "Active", variant: "outline" as const },
    inactive: { label: "Inactive", variant: "outline" as const },
    pending: { label: "Pending", variant: "outline" as const },
    suspended: { label: "Suspended", variant: "destructive" as const },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  )
}

export function TableEmployees({ data }: { data: Employee[] }) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [selectedJobTitle, setSelectedJobTitle] = useState<string | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>(undefined)
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Get unique values for filters
  const getUniqueValues = <T extends keyof Employee>(field: T): Employee[T][] => {
    return Array.from(new Set(data.map((employee) => employee[field])))
  }

  const branches = getUniqueValues("branch")
  const jobTitles = getUniqueValues("jobTitle")
  const grades = getUniqueValues("grade")
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
      const allIds = filteredEmployees.map((employee) => employee.id)
      setSelectedRows(new Set(allIds))
    } else {
      setSelectedRows(new Set())
    }
  }

  // Handle view details
  const handleViewDetails = (employee: Employee) => {
    toast({
      title: "View Employee Details",
      description: `Viewing details for ${employee.firstName} ${employee.lastName}`,
    })
  }

  // Handle delete
  const handleDelete = (employee: Employee) => {
    toast({
      title: "Delete Employee",
      description: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`,
      variant: "destructive",
    })
  }

  // Filter employees based on search and filters
  const filteredEmployees = data.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase()
    const matchesSearch = searchQuery ? fullName.includes(searchQuery.toLowerCase()) : true
    const matchesBranch = selectedBranch ? employee.branch === selectedBranch : true
    const matchesJobTitle = selectedJobTitle ? employee.jobTitle === selectedJobTitle : true
    const matchesGrade = selectedGrade ? employee.grade === selectedGrade : true
    const matchesStatus = selectedStatus ? employee.status === selectedStatus : true

    return matchesSearch && matchesBranch && matchesJobTitle && matchesGrade && matchesStatus
  })

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortField || !sortDirection) return 0

    const fieldA = a[sortField] ?? ""
    const fieldB = b[sortField] ?? ""

    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    return 0
  })


  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + rowsPerPage)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedBranch, selectedJobTitle, selectedGrade, selectedStatus])

  return (

    <div className="space-y-4">
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
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
                {selectedBranch || "Branch"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search branch..." />
                <CommandList>
                  <CommandEmpty>No branch found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem onSelect={() => setSelectedBranch(null)} className="justify-between">
                      All Branches
                      {selectedBranch === null && <CheckIcon className="h-4 w-4" />}
                    </CommandItem>
                    {branches.map((branch) => (
                      <CommandItem
                        key={branch}
                        onSelect={() => setSelectedBranch(branch)}
                        className="justify-between"
                      >
                        {branch}
                        {selectedBranch === branch && <CheckIcon className="h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Job Title Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10">
                {selectedJobTitle || "Job Title"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search job title..." />
                <CommandList>
                  <CommandEmpty>No job title found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem onSelect={() => setSelectedJobTitle(null)} className="justify-between">
                      All Job Titles
                      {selectedJobTitle === null && <CheckIcon className="h-4 w-4" />}
                    </CommandItem>
                    {jobTitles.map((title) => (
                      <CommandItem
                        key={title}
                        onSelect={() => setSelectedJobTitle(title)}
                        className="justify-between"
                      >
                        {title}
                        {selectedJobTitle === title && <CheckIcon className="h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Grade Filter */}
          <Select
            value={selectedGrade || ""}
            onValueChange={(value) => setSelectedGrade(value === "" ? null : value)}
          >
            <SelectTrigger className="w-[100px] h-10">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    paginatedEmployees.length > 0 &&
                    paginatedEmployees.every((employee) => selectedRows.has(employee.id))
                  }
                  onCheckedChange={(checked) => toggleAllRows(!!checked)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("firstName")}>
                <div className="flex items-center">
                  Employee Name
                  <SortIcon field="firstName" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("jobTitle")}>
                <div className="flex items-center">
                  Job Title
                  <SortIcon field="jobTitle" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("grade")}>
                <div className="flex items-center">
                  Grade
                  <SortIcon field="grade" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("branch")}>
                <div className="flex items-center">
                  Branch
                  <SortIcon field="branch" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center">
                  Account Status
                  <SortIcon field="status" currentField={sortField} direction={sortDirection} />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(employee.id)}
                      onCheckedChange={() => toggleRowSelection(employee.id)}
                      aria-label={`Select ${employee.firstName} ${employee.lastName}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={employee.avatar || "/placeholder.svg"}
                          alt={`${employee.firstName} ${employee.lastName}`}
                        />
                        <AvatarFallback>
                          {employee.firstName[0]}
                          {employee.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">{employee.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>{employee.grade}</TableCell>
                  <TableCell>{employee.branch}</TableCell>
                  <TableCell>
                    <StatusBadge status={employee.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/employee/${employee.id}`}> 
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(employee)}>
                          <EyeIcon className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(employee)}
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
          Showing <strong>{paginatedEmployees.length > 0 ? startIndex + 1 : 0}</strong> to{" "}
          <strong>{Math.min(startIndex + rowsPerPage, filteredEmployees.length)}</strong> of{" "}
          <strong>{filteredEmployees.length}</strong> employees
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
