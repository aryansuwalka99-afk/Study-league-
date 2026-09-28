import { useQuery } from "@tanstack/react-query";
import { getLeague, getMe, getMemberDetail } from "./api";
import type { Metric, Period } from "./types";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });
}

export function useLeague(period: Period, metric: Metric, today: string) {
  return useQuery({
    queryKey: ["league", period, metric, today],
    queryFn: () => getLeague({ data: { period, metric, today } }),
  });
}

export function useMemberDetail(memberId: number) {
  return useQuery({
    queryKey: ["member", memberId],
    queryFn: () => getMemberDetail({ data: { memberId } }),
    enabled: Number.isFinite(memberId) && memberId > 0,
  });
}
