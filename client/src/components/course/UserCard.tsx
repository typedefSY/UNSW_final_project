import { CourseMembership, User } from "@/backend";
import { Avatar, Button, Card } from "@radix-ui/themes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCallback } from "react";
import { MdPersonOff } from "react-icons/md";

dayjs.extend(relativeTime);
interface UserCardProps {
  user: User;
  membership: CourseMembership;
  onClickRemoveMember?: (user: User, membership: CourseMembership) => void;
}

export const CourseUserCard: React.FC<UserCardProps> = ({
  user,
  membership,
  onClickRemoveMember,
}) => {
  const onClickRemoveMemberInner = useCallback(() => {
    onClickRemoveMember?.(user, membership);
  }, [membership, onClickRemoveMember, user]);

  return (
    <Card>
      <div className="flex md:justify-between md:flex-row md:space-x-4 space-y-4 md:space-y-0 flex-col items-center">
        <div className="flex space-x-4">
          <Avatar fallback={user.firstName[0] ?? "?"} src={user.avatar} />
          <div className="flex flex-col">
            <div className="font-bold">
              {user.title ? `${user.title} ` : ""}
              {user.firstName} {user.lastName}
            </div>
            <div className="text-gray-500 text-xs">{user.email}</div>
          </div>
        </div>
        <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0 items-center">
          <div className="text-gray-500 text-xs">
            Joined {dayjs(membership.createdAt).fromNow()}
          </div>
          {onClickRemoveMember && (
            <Button
              variant="surface"
              className="flex-1"
              onClick={onClickRemoveMemberInner}
            >
              <MdPersonOff />
              Remove Member
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
