"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import LogoutButton from "./logout-button";
import { ExitIcon } from "@radix-ui/react-icons";
const UserButton = () => {
  const loggedInUser = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={loggedInUser?.image || ""} />
          <AvatarFallback className="bg-gradient-to-b from-c-green to-c-green-l">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30" align="end">
        <LogoutButton>
          <DropdownMenuItem className="justify-center items-center">
            Logout <ExitIcon className="h-4 w-4 ml-2" />
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
