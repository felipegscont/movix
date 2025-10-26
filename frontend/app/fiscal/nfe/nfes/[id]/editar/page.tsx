"use client"

import { useParams, useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { NfeWizard } from "@/components/nfe/nfe-wizard"

export default function EditarNfePage() {
  const params = useParams()
  const router = useRouter()
  const nfeId = params.id as string

  const handleSuccess = () => {
    router.push('/nfes')
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
              <NfeWizard nfeId={nfeId} onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

