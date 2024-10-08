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

export const pointWeights = {
  followers: 20,
  following: 10,
  achievements: 100,
  repositories: 1,
  contributorsAmount: 25,
  stars: 10,
  forks: 10,
  languagesKnown: 50,
  commits: 1,
  lineOfCodes: 0.01,
};
