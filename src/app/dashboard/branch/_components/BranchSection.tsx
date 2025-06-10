"use client"

import { Button } from "@/components/ui/button";
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTableBranch } from "@/components/table/branch/admin/data-table";
import { columns } from "@/components/table/branch/admin/columns";
import { useEffect, useState } from "react";
import { overview } from "@/services/branchService";
import SkeletonDashboardTable from "@/components/skeletons/skeleton-dashboard-table";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

type BranchDetail = {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    status: "active" | "inactive";
    latitude: string;
    longitude: string;
};


export default function BranchSection() {

    const [data, setData] = useState<BranchDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);

    async function fetchData() {
        try {
            const branches = await overview();
            setData(branches);
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const refreshData = () => {
        setIsLoading(true)
        fetchData()
    }

    if (!user || isLoading) {
        return <SkeletonDashboardTable />
    }

    return (
        <CustomPage>
            <CustomPageHeader>
                <CustomPageTitleContainer>
                    <CustomPageTitle>Branch Management</CustomPageTitle>
                    <CustomPageSubtitle>Manage and organize all your branch offices</CustomPageSubtitle>
                </CustomPageTitleContainer>
                <CustomPageTitleButtons>
                    <Link href={'/dashboard/branch/add'}>
                        <Button variant="default" size={"lg"}>
                            <Plus />
                            Add Branch
                        </Button>
                    </Link>
                </CustomPageTitleButtons>
            </CustomPageHeader>
            <DataTableBranch data={data} columns={columns} isLoading={false} skeletonRowCount={5} />
            {/* Client-side data fetching handled here */}
        </CustomPage>
    )
}