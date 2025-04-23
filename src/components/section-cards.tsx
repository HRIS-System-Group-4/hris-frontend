import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Employee</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              230
            </CardTitle>
          </CardHeader>
          <CardFooter className="border-t">
            <p className="text-xs font-normal text-neutral-400">Update: 23 Apr 2025</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Attendance Today</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              90%
            </CardTitle>
          </CardHeader>
          <CardFooter className="border-t">
            <p className="text-xs font-normal text-neutral-400">Update: 23 Apr 2025</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Leaves Today</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              12
            </CardTitle>
          </CardHeader>
          <CardFooter className="border-t">
            <p className="text-xs font-normal text-neutral-400">Update: 23 Apr 2025</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Request Leave</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              1
            </CardTitle>
          </CardHeader>
          <CardFooter className="border-t">
            <p className="text-xs font-normal text-neutral-400">Update: 23 Apr 2025</p>
          </CardFooter>
        </Card>
      </div>
  )
}
