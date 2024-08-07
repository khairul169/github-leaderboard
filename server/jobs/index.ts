import { calculateUserPoints } from "./calculate-user-points";
import { fetchRepoContributors } from "./fetch-repo-contributors";
import { fetchRepoData } from "./fetch-repo-data";
import { fetchUserProfile } from "./fetch-user-profile";
import { fetchUserRepos } from "./fetch-user-repos";

export const jobs = {
  fetchUserRepos,
  fetchRepoData,
  fetchRepoContributors,
  calculateUserPoints,
  fetchUserProfile,
};

export type JobNames = keyof typeof jobs;
