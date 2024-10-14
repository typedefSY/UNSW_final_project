"use client";

import {
  type Event,
  Calendar as CalendarComponent,
} from "@/components/calendar/Calendar";
import { PageFrame } from "@/components/structural/PageFrame";
import { useBackend } from "@/hooks/useBackend";

import React, { useEffect } from "react";

const Calendar: React.FC = () => {
  const [events, setEvents] = React.useState<Record<string, Event[]>>({});

  const backend = useBackend();

  useEffect(() => {
    const inner = async () => {
      const { events } = await backend.getUserEvents({});
      setEvents(events);
    };
    void inner();
  }, [backend]);

  return (
    <PageFrame title="Calendar" standardWidth={false}>
      <div className="flex flex-col gap-4">
        <CalendarComponent today={new Date()} events={events} />
      </div>
    </PageFrame>
  );
};

export default Calendar;
