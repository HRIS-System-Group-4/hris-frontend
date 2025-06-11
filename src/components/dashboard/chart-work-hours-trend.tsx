"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getWorkHoursTrend } from "@/services/dashboardService"

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-accent-1)",
    },
} satisfies ChartConfig

export function ChartWorkHoursTrend() {
    const [timeRange, setTimeRange] = React.useState("90d")
    const [chartData, setChartData] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getWorkHoursTrend()
                setChartData(data)
            } catch (error) {
                console.error("Error fetching work hours trend:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredData = React.useMemo(() => {
        const referenceDate = new Date()
        let daysToSubtract = 90
        if (timeRange === "30d") daysToSubtract = 30
        else if (timeRange === "7d") daysToSubtract = 7

        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)

        return chartData.filter((item) => {
            const date = new Date(item.date)
            return date >= startDate
        })
    }, [chartData, timeRange])

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Work Hours Trend</CardTitle>
                    <CardDescription>
                        Track your daily work hours and identify patterns over time
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select time range">
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d">Last 3 months</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[360px] w-full">
                        <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) =>
                                            new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="desktop"
                                type="linear"
                                fill="url(#fillDesktop)"
                                stroke="var(--color-desktop)"
                                stackId="a"
                            />
                            <Area
                                dataKey="mobile"
                                type="linear"
                                fill="url(#fillMobile)"
                                stroke="var(--color-mobile)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
