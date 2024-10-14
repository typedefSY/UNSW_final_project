import React from "react";
import { getBgColor, getSubjectColor } from "./colorScheme";
import { type Event, type CalendarProps } from "./Calendar";
import { Tooltip } from "@radix-ui/themes";
import Link from "next/link";

export const CalendarBoard: React.FC<CalendarProps> = ({
  today,
  events,
  warpperClassName,
}) => {
  function getMonthDetails(year: number, month: number): [number, number] {
    const firstDay = new Date(year, month - 1, 1);
    const dayOfWeek = firstDay.getDay();

    const totalDays = new Date(year, month, 0).getDate();

    return [dayOfWeek, totalDays];
  }

  function eventsInDay(day: Date) {
    const todayString = day.toISOString().split("T")[0]!;
    const todayEvents: Event[] = events[todayString] ?? [];
    return (
      <>
        {todayEvents.map((event, index) => (
          <div
            className={`absolute w-full ${
              index == 0
                ? "lg:mt-[-115px] mt-[-55px]"
                : "lg:mt-[-60px] mt-[-100px]"
            } rounded overflow-hidden my-1`}
            key={`${day.getDay()}-${index}`}
          >
            <Tooltip
              content={
                <span className="flex items-center gap-x-1 flex-col">
                  <span className="text-xs font-medium leading-4">
                    {event.name}
                  </span>
                  <span className="text-xs font-medium leading-4">
                    ({event.time})
                  </span>
                </span>
              }
              side="top"
            >
              <Link href={event.url}>
                <div
                  className={`m-1 flex items-center gap-x-1 py-3 px-2 bg-${getBgColor(
                    event.type,
                  )} rounded`}
                >
                  <div
                    className={`lg:w-2 lg:h-2 min-w-[8px] min-h-[8px] bg-${getSubjectColor(
                      event.type,
                    )} rounded-full lg:mt-[1px] mt-[-16px]`}
                  />
                  <div tabIndex={0} className="ml-1 flex-grow min-w-0">
                    <p
                      className={`truncate max-w-full text-xs font-medium leading-normal text-${getSubjectColor(
                        event.type,
                      )}`}
                    >
                      {event.name} {event.time}
                    </p>
                  </div>
                </div>
              </Link>
            </Tooltip>
          </div>
        ))}
      </>
    );
  }

  function calendarMonth(year: number, month: number) {
    const [startDay, totalDays] = getMonthDetails(year, month);
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
      <tbody>
        {/* Create rows */}
        {Array.from({ length: Math.ceil((totalDays + startDay - 1) / 7) }).map(
          (_, weekIndex) => (
            <tr className="border-b border-gray-300" key={weekIndex}>
              {/* Create cells for each day */}
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day =
                  daysArray[weekIndex * 7 + dayIndex - (startDay - 1)];
                return (
                  <td
                    className="border-r border-gray-300 relative"
                    key={dayIndex}
                  >
                    {day && (
                      <p className="pt-2 pb-32 pl-2 text-xs font-medium text-gray-600">
                        {day}
                      </p>
                    )}
                    {day && eventsInDay(new Date(year, month - 1, day + 1))}
                  </td>
                );
              })}
            </tr>
          ),
        )}
      </tbody>
    );
  }

  return (
    <div className={`w-full xl:overflow-x-hidden ${warpperClassName}`}>
      <table className="min-w-full bg-white">
        <thead className="items-center">
          <tr className="h-12 border border-gray-200 rounded-lg bg-gray-50">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <th className="px-10" key={day}>
                <p className="text-sm font-medium text-center text-gray-800 cursor-pointer">
                  {day}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        {calendarMonth(today.getFullYear(), today.getMonth() + 1)}
      </table>
    </div>
  );
};
