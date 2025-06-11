import { GalleryVerticalEnd } from "lucide-react"

import { LoginTabs } from "@/components/login-form"
import Image from "next/image"
import PreviewDashboard from "@/components/preview/preview-dashboard"
import PreviewDashboardAdmin from "@/components/preview/preview-dashboard-admin"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2 ">
            <div className="relative hidden bg-muted lg:block overflow-hidden">
                <PreviewDashboard className="scale-75 origin-top-right absolute top-20 right-20" ><PreviewDashboardAdmin /></PreviewDashboard>
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Image src="/logo/Logo HRIS-1.png" alt="Logo" width={62} height={100} />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                        <LoginTabs />
                    </div>
                </div>
            </div>
        </div >
    )
}