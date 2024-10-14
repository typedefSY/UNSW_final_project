import React from "react";
import { CalendarBoard } from "@/components/calendar/CalendarBoard";
import { CalendarBoardMini } from "@/components/calendar/CalendarBoardMini";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { getBgColor, getSubjectColor } from "@/components/calendar/colorScheme";

export type Event = {
  name: string;
  time: string;
  type: string;
  url: string;
};

export interface CalendarProps {
  today: Date;
  events: Record<string, Event[]>;
  warpperClassName?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ today, events }) => {
  return (
    <div className="bg-gray-200">
      <div className="w-full px-5 py-10 mx-auto">
        <div className="flex flex-col bg-white lg:flex-row">
          {/* SIDEBAR */}
          <div className="flex flex-col pt-4 pb-0 bg-gray-200 border-r md:pb-6 lg:pb-0 lg:pr-5 lg:flex-col md:justify-between lg:justify-start gap-x-2 lg:items-start md:items-center">
            <div className="px-4 py-4 bg-white lg:min-w-[260px] w-full">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.5 3.75H4.5C3.25736 3.75 2.25 4.75736 2.25 6V19.5C2.25 20.7426 3.25736 21.75 4.5 21.75H19.5C20.7426 21.75 21.75 20.7426 21.75 19.5V6C21.75 4.75736 20.7426 3.75 19.5 3.75Z"
                  stroke="#4F46E5"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.875 12C14.4963 12 15 11.4963 15 10.875C15 10.2537 14.4963 9.75 13.875 9.75C13.2537 9.75 12.75 10.2537 12.75 10.875C12.75 11.4963 13.2537 12 13.875 12Z"
                  fill="#4F46E5"
                />
                <path
                  d="M17.625 12C18.2463 12 18.75 11.4963 18.75 10.875C18.75 10.2537 18.2463 9.75 17.625 9.75C17.0037 9.75 16.5 10.2537 16.5 10.875C16.5 11.4963 17.0037 12 17.625 12Z"
                  fill="#4F46E5"
                />
                <path
                  d="M13.875 15.75C14.4963 15.75 15 15.2463 15 14.625C15 14.0037 14.4963 13.5 13.875 13.5C13.2537 13.5 12.75 14.0037 12.75 14.625C12.75 15.2463 13.2537 15.75 13.875 15.75Z"
                  fill="#4F46E5"
                />
                <path
                  d="M17.625 15.75C18.2463 15.75 18.75 15.2463 18.75 14.625C18.75 14.0037 18.2463 13.5 17.625 13.5C17.0037 13.5 16.5 14.0037 16.5 14.625C16.5 15.2463 17.0037 15.75 17.625 15.75Z"
                  fill="#4F46E5"
                />
                <path
                  d="M6.375 15.75C6.99632 15.75 7.5 15.2463 7.5 14.625C7.5 14.0037 6.99632 13.5 6.375 13.5C5.75368 13.5 5.25 14.0037 5.25 14.625C5.25 15.2463 5.75368 15.75 6.375 15.75Z"
                  fill="#4F46E5"
                />
                <path
                  d="M10.125 15.75C10.7463 15.75 11.25 15.2463 11.25 14.625C11.25 14.0037 10.7463 13.5 10.125 13.5C9.50368 13.5 9 14.0037 9 14.625C9 15.2463 9.50368 15.75 10.125 15.75Z"
                  fill="#4F46E5"
                />
                <path
                  d="M6.375 19.5C6.99632 19.5 7.5 18.9963 7.5 18.375C7.5 17.7537 6.99632 17.25 6.375 17.25C5.75368 17.25 5.25 17.7537 5.25 18.375C5.25 18.9963 5.75368 19.5 6.375 19.5Z"
                  fill="#4F46E5"
                />
                <path
                  d="M10.125 19.5C10.7463 19.5 11.25 18.9963 11.25 18.375C11.25 17.7537 10.7463 17.25 10.125 17.25C9.50368 17.25 9 17.7537 9 18.375C9 18.9963 9.50368 19.5 10.125 19.5Z"
                  fill="#4F46E5"
                />
                <path
                  d="M13.875 19.5C14.4963 19.5 15 18.9963 15 18.375C15 17.7537 14.4963 17.25 13.875 17.25C13.2537 17.25 12.75 17.7537 12.75 18.375C12.75 18.9963 13.2537 19.5 13.875 19.5Z"
                  fill="#4F46E5"
                />
                <path
                  d="M6 2.25V3.75"
                  stroke="#4F46E5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 2.25V3.75"
                  stroke="#4F46E5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.75 7.5H2.25"
                  stroke="#4F46E5"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-3 mb-4 text-sm font-semibold leading-none text-gray-800">
                Welcome!
              </p>
              <p className="text-xs leading-normal text-gray-600 lg:max-w-[228px] w-full">
                Event that applications book will appear here. Click on an event
                to see the details and manage applicants event.
              </p>
            </div>
            <div className="px-4 py-4 bg-white lg:min-w-[260px] my-4 w-full">
              <p className="mb-4 text-sm font-semibold leading-none text-gray-800">
                Event Types
              </p>
              {["Lecture", "Tutorial", "Assignment", "Exam"].map(
                (type, index) => (
                  <div
                    className={`flex items-center px-2 py-3 rounded gap-x-1 bg-${getBgColor(
                      type.toLowerCase(),
                    )} ${index === 0 ? "" : "mt-3"}`}
                    key={type}
                  >
                    <div
                      className={`w-2 h-2 bg-${getSubjectColor(
                        type.toLowerCase(),
                      )} rounded-full mt-[1px]`}
                    />
                    <div tabIndex={0} className="ml-1">
                      <p
                        className={`text-xs font-medium leading-3 text-${getSubjectColor(
                          type.toLowerCase(),
                        )}`}
                      >
                        {type}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
            <UpcomingEvents today={today} events={events} showEventNumber={5} />
          </div>
          {/* MAIN PART */}
          <CalendarBoard
            today={today}
            events={events}
            warpperClassName="hidden md:block"
          />
        </div>
        <CalendarBoardMini
          today={today}
          events={events}
          warpperClassName="md:hidden"
        />
      </div>
    </div>
  );
};
