"use client"

import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "@radix-ui/react-progress";

export default function SubsOverview() {
    return (
        <Card className="rounded-md">
            <CardHeader>
                <CardTitle>Subscription Overview</CardTitle>
                <CardDescription>You have <span className="font-medium text-black">12 days</span> remaining in your free trial.</CardDescription>
            </CardHeader>
            {/* <CardContent>
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 items-center">
                        <p className="text-muted-foreground text-sm">Current Plan:</p>
                        <Badge variant="secondary" className="text-sm">Free</Badge>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <p className="text-muted-foreground text-sm"><span className="font-medium text-primary">78</span> / 100 Employees</p>
                        <Progress value={78} />
                    </div>
                </div>
            </CardContent> */}
            <CardFooter>
                <Link href={"/dashboard/pricing"} className="w-full">
                    <Button variant="outline" className="w-full">
                        Upgrade
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}