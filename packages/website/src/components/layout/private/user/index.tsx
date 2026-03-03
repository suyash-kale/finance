import { type FC } from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropDown } from "@/components/layout/private/user/drop-down";
import { useSessionStore } from "@/store/session";
import { getFallback } from "@/lib/get-fallback";

export const User: FC = () => {
  const { user } = useSessionStore();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="flex items-center justify-center h-8 w-8">
                <AvatarFallback>
                  {getFallback(user?.fname ?? "NA")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1">
                <span className="truncate font-semibold">{user?.fname}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropDown />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
