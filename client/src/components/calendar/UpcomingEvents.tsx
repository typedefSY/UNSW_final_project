import React from "react";

import { CalendarProps } from "./Calendar";
import { getBgColor, getSubjectColor } from "./colorScheme";
import Link from "next/link";

interface UpcomingEventsProps extends CalendarProps {
  showEventNumber?: number;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  today,
  events,
  showEventNumber,
}) => {
  // filter events that are after yesterday
  const upcomingEvents = Object.entries(events).filter(
    ([date]) => new Date(date) >= today,
  );

  // sort events by date
  upcomingEvents.sort(([date1], [date2]) => {
    if (date1 < date2) {
      return -1;
    } else if (date1 > date2) {
      return 1;
    } else {
      return 0;
    }
  });

  const flattenedAndLimitedEvents = upcomingEvents
    .flatMap(([date, events]) => events.map((event) => ({ date, event })))
    .slice(0, showEventNumber);

  return (
    <div className="px-4 py-4 bg-white lg:min-w-[260px] flex flex-col h-full">
      <p className="mb-2 text-sm font-semibold text-gray-800">
        Upcoming Events
      </p>
      <p className="text-xs text-gray-600">Don&apos;t Miss Scheduled Events</p>
      {flattenedAndLimitedEvents.map(({ date, event }, index) => (
        <Link href={event.url} key={`${date}-${index}`}>
          <div className="px-4 py-4 mt-4 border border-gray-200 rounded-sm hover:shadow-md">
            <div className="flex justify-between">
              <div className="flex gap-x-2">
                <div
                  className={`w-2 h-2 rounded-full mt-[2px] bg-${getSubjectColor(
                    event.type,
                  )}`}
                />
                <p className="text-xs font-medium leading-3 text-gray-800">
                  {new Date(date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p
                className={`p-1 text-xs font-medium leading-3 rounded-sm bg-${getBgColor(
                  event.type,
                )} text-${getSubjectColor(event.type)}`}
              >
                {event.time}
              </p>
            </div>
            <p className="text-xs leading-3 text-gray-600">{event.name}</p>
          </div>
        </Link>
      ))}
      {flattenedAndLimitedEvents.length === 0 && (
        <div className="flex flex-col justify-center items-center h-full flex-1">
          <p className="text-center text-gray-500 text-xs py-4">
            No upcoming events! Take a break, grab a coffee!
          </p>
        </div>
      )}
    </div>
  );
};
