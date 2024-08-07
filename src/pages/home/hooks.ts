import { useFetch } from "@client/hooks/useFetch";
import api from "@client/lib/api";
import { InferResponseType } from "hono";

export type Leaderboard = InferResponseType<typeof api.leaderboard.$get>;
export type LeaderboardEntry = Leaderboard[number];

export const useLeaderboard = () => {
  return useFetch<Leaderboard>("leaderboard", api.leaderboard.$get);
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
