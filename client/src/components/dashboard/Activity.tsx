import { UserSevenDayActivity } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip } from "recharts";

// Define and export the ActivityProps type

interface Props {
  activities?: UserSevenDayActivity;
}

// The Activity component now takes ActivityProps as props
const UserSevenDayActivitiesDisplay: React.FC<Props> = ({ activities }) => {
  const getLast7DaysDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(`${date.getDate()}-${date.getMonth() + 1}`);
    }
    return dates;
  };

  const data = activities?.activities.map((activity, index) => ({
    day: getLast7DaysDates()[index],
    count: activity,
  }));

  return (
    <div className="flex flex-col ml-1 font-bold">
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <Tooltip />
        <Bar dataKey="count" fill="#2755a1" radius={[10, 10, 0, 0]} />
      </BarChart>
    </div>
  );
};

export const StatefulUserSevenDayActivitiesDisplay: React.FC = () => {
  const [activities, setActivities] = useState<UserSevenDayActivity>();

  const backend = useBackend();

  useEffect(() => {
    const inner = async () => {
      // Fetch the user's activities
      const { activity } = await backend.fetchUserSevenDayActivity({});
      setActivities(activity);
    };

    void inner();
  }, [backend]);

  return <UserSevenDayActivitiesDisplay activities={activities} />;
};
