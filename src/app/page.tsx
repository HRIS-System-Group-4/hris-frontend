import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-svh w-svw bg-neutral-50 md:grid-cols-12 md:p-12 lg:p-20">
      <div className="col-span-12 w-full h-full flex">
        {/* <CardContent className="flex h-full"> */}
        <div className="flex flex-col w-1/2 h-full justify-between">
          <div className="flex flex-col gap-9 w-full">
            <Link href={"/auth/register"} className="flex gap-3 py-2 pl-2 pr-3 bg-primary-50 rounded-xl w-fit">
              <div className="flex items-center gap-2 bg-primary-100 pl-1 pr-2 rounded-sm">
                <Lightbulb size={20} className="text-primary-300 stroke-2" ></Lightbulb>
                <p className="font-medium text-sm text-primary-300">First Release</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-medium text-lg text-primary-500">Human Resource Information System</p>
                {/* <ChevronRight size={20}></ChevronRight> */}
              </div>
            </Link>
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-5 w-full">
                <h1 className="text-6xl font-semibold text-black">It's Time to Simplify Your HR Operations</h1>
                <p className="text-xl font-normal text-neutral-500">Say goodbye to scattered tools and confusing systems. Our centralized platform gives you full control over your team, attendance, and daily operations.</p>
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <Link href={"/auth/register"} >
                <Button size={"lg"}>Register</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-base font-normal text-neutral-500">Associated with</p>
          </div>
        </div>
        <div className="w-1/2  h-full">

        </div>
        {/* </CardContent> */}
      </div>
    </div>
  );
}
