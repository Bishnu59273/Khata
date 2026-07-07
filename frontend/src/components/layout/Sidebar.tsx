import {
  Home,
  PlusCircle,
  Receipt,
  BarChart3,
  Wallet,
  Layers,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import {
  Sidebar as SidebarPrimitive,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/animate-ui/components/radix/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", icon: Home, key: "nav.home", end: true },
  {
    to: "/transactions/new",
    icon: PlusCircle,
    key: "nav.addTransaction",
    end: false,
  },
  { to: "/transactions", icon: Receipt, key: "nav.transactions", end: true },
  { to: "/reports", icon: BarChart3, key: "nav.reports", end: false },
  { to: "/expenses", icon: Wallet, key: "nav.expenses", end: false },
  { to: "/services", icon: Layers, key: "nav.services", end: false },
] as const;

export function Sidebar() {
  const { t } = useTranslation("common");
  const { t: tAuth } = useTranslation("auth");
  const { shop, user, logoutMutation } = useAuth();
  const { pathname } = useLocation();

  return (
    <SidebarPrimitive collapsible="icon" className="border-r border-border">
      {shop && (
        <SidebarHeader>
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3d6c2] text-sm font-bold text-[#8a6a42]">
              {shop.name.charAt(0)}
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="truncate text-base font-bold leading-tight text-ink-900">
                {shop.name}
              </div>
              <div className="truncate text-xs text-ink-600">{t("appSub")}</div>
            </div>
          </div>
        </SidebarHeader>
      )}
      <SidebarContent className="px-2">
        <SidebarMenu>
          {NAV_ITEMS.map(({ to, icon: Icon, key, end }) => {
            const isActive = end ? pathname === to : pathname.startsWith(to);
            return (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton asChild isActive={isActive} size="lg">
                  <Link to={to} className="text-base font-semibold">
                    <Icon size={22} />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {t(key)}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {shop && (
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-xl border border-border-soft bg-brand-50 p-3 text-left transition-colors hover:bg-brand-500/[8%] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3d6c2] text-sm font-bold text-[#8a6a42]">
                  {user?.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <div className="truncate text-sm font-semibold text-ink-900">
                    {user?.name}
                  </div>
                  <div className="truncate text-xs text-ink-600">
                    {user?.email}
                  </div>
                </div>
                <ChevronsUpDown
                  size={16}
                  className="shrink-0 text-ink-600 group-data-[collapsible=icon]:hidden"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-64">
              <DropdownMenuLabel>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3d6c2] text-sm font-bold text-[#8a6a42]">
                  {user?.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-ink-900">
                    {user?.name}
                  </div>
                  <div className="truncate text-xs text-ink-600">
                    {user?.email}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => logoutMutation.mutate()}
              >
                <LogOut />
                {tAuth("logout.label")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </SidebarPrimitive>
  );
}
