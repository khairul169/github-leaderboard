import { useFetch } from "@client/hooks/useFetch";
import api from "@client/lib/api";
import { InferResponseType } from "hono";
import { useParams } from "react-router-dom";
import { leaderboardTypes } from "./data";

export const useLeaderboardType = () => {
  const { type } = useParams();
  const item =
    leaderboardTypes.find((t) => t.value === type) || leaderboardTypes[0];

  return [item.value, item] as const;
};

export type Leaderboard = InferResponseType<typeof api.leaderboard.$get>;
export type LeaderboardColumn = Leaderboard["columns"][number];
export type LeaderboardEntry = Leaderboard["rows"][number];

export const useLeaderboard = (query?: any) => {
  return useFetch<Leaderboard>(["leaderboard", query], () =>
    api.leaderboard.$get({ query })
  );
};

export type UserLeaderboard = InferResponseType<
  (typeof api.leaderboard)[":username"]["$get"]
>;

export const useGetUserLeaderboard = (username?: string | null) => {
  return useFetch<UserLeaderboard>(
    ["leaderboard", username],
    () => api.leaderboard[":username"].$get({ param: { username: username! } }),
    { enabled: !!username }
  );
};
