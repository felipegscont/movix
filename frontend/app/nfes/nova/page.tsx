import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { NfeFormWrapper } from "@/components/nfe/nfe-form-wrapper"

export default function NovaFePage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Nova NFe</h1>
                <p className="text-muted-foreground">
                  Preencha os dados para emitir uma nova Nota Fiscal Eletrônica
                </p>
              </div>
              <NfeFormWrapper />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

