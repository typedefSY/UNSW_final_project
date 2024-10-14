import React, { PropsWithChildren, useCallback } from "react";
import { Logo } from "../Logo";
import { AiOutlineMenu } from "react-icons/ai";
import { User } from "@/backend";
import { useCurrentUser, useResetSession } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { Avatar, DropdownMenu } from "@radix-ui/themes";
import Cookies from "js-cookie";

interface Props extends PropsWithChildren {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onClickMenu?: () => void;
  isSideMenuActive?: boolean;
  className?: string;
}

const UserDisplay: React.FC<{ user: User }> = ({ user }) => {
  const router = useRouter();

  const onClickUserAvatar = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const destroySession = useResetSession();

  const onClickLogOut = useCallback(() => {
    Cookies.remove("token");
    destroySession?.();
  }, [destroySession]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div>
          <Avatar src={user.avatar} fallback={user.firstName[0] ?? "?"} />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content variant="soft" size="2" className="min-w-28">
        <DropdownMenu.Item onClick={onClickUserAvatar}>
          <div>Profile</div>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        {/* <DropdownMenu.Item>Invite Friends</DropdownMenu.Item>
        <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
        <DropdownMenu.Separator /> */}
        <DropdownMenu.Item color="red" onClick={onClickLogOut}>
          <div>Log out</div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export const TopNav = ({
  title,
  left,
  right,
  onClickMenu,
  isSideMenuActive,
  className,
}: Props) => {
  const user = useCurrentUser();

  const router = useRouter();

  const onClickLogo = useCallback(() => {
    void router.push("/");
  }, [router]);

  return (
    <div
      className={`border-b py-4 text-center left-0 top-0 w-full backdrop-blur-md bg-white bg-opacity-80 flex px-4 items-center ${className}`}
    >
      <div className="w-1/3 min-w-fit flex space-x-4 items-center px-4 flex-shrink-0">
        <div className="space-x-6 flex items-center">
          {onClickMenu && (
            <div
              className={`p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 cursor-pointer select-none ${
                isSideMenuActive ? "bg-gray-100" : ""
              }`}
              onClick={onClickMenu}
            >
              <AiOutlineMenu className="text-2xl" stroke="2" />
            </div>
          )}
          <Logo
            size="xs"
            onClick={onClickLogo}
            className="cursor-pointer hover:bg-gray-100 rounded-md"
          ></Logo>
        </div>
        {left}
      </div>
      <div className="font-bold flex-1">{title}</div>
      <div className="w-1/3 min-w-fit flex space-x-4 justify-end">
        {right}
        <div className="flex-shrink-0">
          {user ? (
            <UserDisplay user={user} />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-300">Log in</div>
          )}
        </div>
      </div>
    </div>
  );
};
