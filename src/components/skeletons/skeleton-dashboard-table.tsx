"use client"

import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleContainer } from "../ui/custom-page";
import { Skeleton } from "../ui/skeleton";
import { SkeletonDataTable } from "./table/skeleton-data-table";

export default function SkeletonDashboardTable() {
    return (
        <CustomPage>
            <CustomPageHeader>
                <CustomPageTitleContainer>
                    <CustomPageTitle>
                        <Skeleton className="h-6 w-48" />
                    </CustomPageTitle>
                    <CustomPageSubtitle>
                        <Skeleton className="h-6 w-80" />
                    </CustomPageSubtitle>
                </CustomPageTitleContainer>
            </CustomPageHeader>
            <SkeletonDataTable
                columnCount={5}
                rowCount={5}
                showToolbar={true}
                showPagination={true}
            />
            {/* Komponen client yang akan fetch data dan render tabel */}
            {/* <AttendanceTableClient columns={columnsEmployee} /> */}
        </CustomPage>
    );
}