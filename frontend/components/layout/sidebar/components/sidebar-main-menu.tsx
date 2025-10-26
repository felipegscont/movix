import Link from "next/link"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { NavMainItem } from "../types"

interface SidebarMainMenuProps {
  navItems: NavMainItem[]
  activeItem: NavMainItem | null
  onItemClick: (item: NavMainItem) => void
}

/**
 * Menu principal do sidebar (ícones laterais)
 */
export function SidebarMainMenu({
  navItems,
  activeItem,
  onItemClick,
}: SidebarMainMenuProps) {
  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            tooltip={{
              children: item.title,
              hidden: false,
            }}
            onClick={() => onItemClick(item)}
            isActive={activeItem?.title === item.title}
            className="px-2.5 md:px-2"
            asChild={item.items.length === 0}
          >
            {item.items.length === 0 ? (
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            ) : (
              <>
                <item.icon />
                <span>{item.title}</span>
              </>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

