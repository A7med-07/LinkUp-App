import {Card, Skeleton} from "@heroui/react";

export default function LoadingPage() {
  return <>
  <div className="bg-[#0f1419] min-h-screen py-10">
 <Card className="space-y-5 p-6 w-full max-w-2xl m-auto bg-[#1a1f2e] border border-gray-800 shadow-2xl" radius="lg">
 <div className="w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12 bg-gray-700" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg bg-gray-700" />
        <Skeleton className="h-3 w-4/5 rounded-lg bg-gray-700" />
      </div>
    </div>
      <Skeleton className="rounded-xl bg-gray-700">
        <div className="h-24 rounded-xl bg-gray-700" />
      </Skeleton>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg bg-gray-700">
          <div className="h-3 w-3/5 rounded-lg bg-gray-700" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg bg-gray-700">
          <div className="h-3 w-4/5 rounded-lg bg-gray-700" />
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg bg-gray-700">
          <div className="h-3 w-2/5 rounded-lg bg-gray-700" />
        </Skeleton>
      </div>
    </Card>
  </div>
  
  
  </>
}