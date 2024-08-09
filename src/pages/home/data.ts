//

export const leaderboardTypes: LeaderboardType[] = [
  {
    title: "Pengguna😱",
    value: "user",
  },
  {
    title: "Bahasa☔️",
    value: "lang",
  },
  {
    title: "Javascript👑",
    value: "js",
    query: { type: "lang-users", lang: "javascript,typescript" },
  },
  {
    title: "PHP🐘",
    value: "php",
    query: { type: "lang-users", lang: "php" },
  },
];

export type LeaderboardTypes = "user" | "lang" | "js" | "php";

export type LeaderboardType = {
  title: string;
  value: LeaderboardTypes;
  query?: any;
};
