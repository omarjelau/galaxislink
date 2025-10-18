
'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const barChartData = [
  { link: "Portfolio", clicks: 186 },
  { link: "Twitter", clicks: 305 },
  { link: "GitHub", clicks: 237 },
  { link: "Shop", clicks: 73 },
  { link: "Blog", clicks: 209 },
]

const barChartConfig = {
  clicks: {
    label: "Clicks",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const pieChartData = [
    { source: "Direct", visitors: 275, fill: "var(--color-direct)" },
    { source: "Instagram", visitors: 350, fill: "var(--color-instagram)" },
    { source: "Twitter", visitors: 200, fill: "var(--color-twitter)" },
    { source: "Other", visitors: 175, fill: "var(--color-other)" },
]

const pieChartConfig = {
    visitors: {
        label: "Visitors",
    },
    direct: {
        label: "Direct",
        color: "hsl(var(--chart-1))",
    },
    instagram: {
        label: "Instagram",
        color: "hsl(var(--chart-2))",
    },
    twitter: {
        label: "Twitter / X",
        color: "hsl(var(--chart-3))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig


export function AnalyticsPreview() {
  return (
    <div className="space-y-4 p-4 overflow-y-auto h-full bg-secondary/30">
        <h1 className="text-2xl font-bold tracking-tight font-headline px-2">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle className="text-base font-medium">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                    <div className="text-2xl font-bold">1,005</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle className="text-base font-medium">Top Link</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                    <div className="text-2xl font-bold truncate">Twitter</div>
                    <p className="text-xs text-muted-foreground">305 clicks</p>
                </CardContent>
            </Card>
        </div>
      
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Link Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="min-h-[150px] w-full">
              <BarChart accessibilityLayer data={barChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="link" tickLine={false} tickMargin={10} axisLine={false} fontSize={10} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="clicks" radius={4} fill="var(--color-clicks)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={pieChartData} dataKey="visitors" nameKey="source" innerRadius={60} strokeWidth={5}>
                    {pieChartData.map((entry) => (
                      <Cell key={`cell-${entry.source}`} fill={entry.fill} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
    </div>
  )
}
