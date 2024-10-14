import React, { useEffect, useState } from "react";
import { UserStats } from "@/backend";
import { useBackend } from "@/hooks/useBackend";

// Define and export the StatsProps type
export type StatsProps = {
  stats?: UserStats;
  className?: string;
};

interface StatsCardProps {
  title: string;
  value?: number;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, className }) => {
  return (
    <div className={`w-40 ${className ?? ""}`}>
      <div className="flex flex-col justify-between w-full h-28 space-y-2 leading-tight border-l-2 border-blue-400 px-4">
        {value === undefined ? (
          <div className="text-5xl text-blue-600">-</div>
        ) : (
          <div className="text-5xl text-blue-600 font-bold">{value}</div>
        )}
        <div className="font-semibold">{title}</div>
      </div>
    </div>
  );
};

// Update the component to accept StatsProps
export const UserStatsDisplay: React.FC<StatsProps> = ({
  stats,
  className,
}) => {
  return (
    <div className={`flex flex-col w-fit ${className}`}>
      <div className="flex flex-wrap mt-3">
        <StatsCard
          title="Courses in progress"
          value={stats?.coursesInProgress}
          className="p-2"
        />
        <StatsCard
          title="Courses completed"
          value={stats?.coursesCompleted}
          className="p-2"
        />
        <StatsCard
          title="Tasks finished"
          value={stats?.tasksFinished}
          className="p-2"
        />
      </div>
    </div>
  );
};

interface StatefulUserStatsDisplayProps {
  className?: string;
}

export const StatefulUserStatsDisplay: React.FC<
  StatefulUserStatsDisplayProps
> = ({ className }) => {
  const backend = useBackend();

  const [stats, setStats] = useState<UserStats>();

  useEffect(() => {
    const inner = async () => {
      const { stats } = await backend.fetchUserStats({});
      setStats(stats);
    };

    void inner();
  }, [backend]);

  return (
    <UserStatsDisplay stats={stats} className={className}></UserStatsDisplay>
  );
};
