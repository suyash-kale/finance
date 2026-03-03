import { useCallback, type FC } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

import {
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getFallback } from "@/lib/get-fallback";
import { useSessionStore } from "@/store/session";

export const DropDown: FC = () => {
  const navigate = useNavigate();

  const { user, signOut } = useSessionStore();

  const onSignOut = useCallback(() => {
    signOut();
    navigate("/sign-in");
  }, [signOut, navigate]);

  return (
    <DropdownMenuContent side="right" align="end" sideOffset={4}>
      <DropdownMenuLabel className="font-normal">
        <div className="flex items-center gap-2">
          <Avatar className="flex items-center justify-center h-10 w-10">
            <AvatarFallback>{getFallback(user?.fname ?? "NA")}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1">
            <span className="truncate font-semibold">{user?.fname}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" onClick={onSignOut}>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
