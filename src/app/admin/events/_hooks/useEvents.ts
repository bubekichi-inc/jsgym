"use client";

import { useState, useEffect } from "react";
import { useFetch } from "@/app/_hooks/useFetch";

export type EventCountByName = {
  name: string;
  count: number;
  typeBreakdown: {
    type: string;
    count: number;
  }[];
};

export type EventsResponse = {
  events: EventCountByName[];
  totalCount: number;
};

export const useEvents = (monthParam: string, isAllPeriods: boolean) => {
  const [debouncedMonth, setDebouncedMonth] = useState<string>(monthParam);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMonth(monthParam);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [monthParam]);

  const queryParam = isAllPeriods ? `all=true` : `month=${debouncedMonth}`;

  const { data, error, isLoading } = useFetch<EventsResponse>(
    `/api/admin/events?${queryParam}`
  );

  return {
    events: data?.events || [],
    totalCount: data?.totalCount || 0,
    error,
    isLoading,
  };
};
