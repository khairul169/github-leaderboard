import * as cheerio from "cheerio";
import { intval } from "./utils";
import dayjs from "dayjs";

const GITHUB_URL = "https://github.com";
const GITHUB_API_URL = "https://api.github.com";

const selectors = {
  user: {
    name: "h1.vcard-names > span.vcard-fullname",
    location: "li[itemprop='homeLocation'] span",
    followers: ".js-profile-editable-area a[href$='?tab=followers'] > span",
    following: ".js-profile-editable-area a[href$='?tab=following'] > span",
    achievement: "img.achievement-badge-sidebar",
  },

  repo: {
    list: "div#user-repositories-list li",
    listForked: ':contains("Forked")',
    listLanguage: "span[itemprop='programmingLanguage']",
    listStars: "a[href$='stargazers']",
    listForks: "a[href$='forks']",
    langList: ".Layout-sidebar h2:contains('Languages')",
  },
};

const github = {
  async getUser(username: string) {
    const response = await this.fetch(username);
    const $ = cheerio.load(response);

    const name = $(selectors.user.name).text().trim();
    if (typeof name !== "string" || !name?.length) {
      throw new Error("User not found");
    }

    const location = $(selectors.user.location).text().trim();
    const followers = intval($(selectors.user.followers).text().trim());
    const following = intval($(selectors.user.following).text().trim());
    const achievements = [] as { name: string; image?: string }[];

    $(selectors.user.achievement).each((_i, el) => {
      const name = $(el).attr("alt")?.split(" ")[1] || "";
      const image = $(el).attr("src");
      achievements.push({ name, image });
    });

    return { name, username, location, followers, following, achievements };
  },

  async getRepositories(
    username: string,
    params?: Partial<GetRepositoriesParams>
  ) {
    const response = await this.fetch(username, {
      params: {
        tab: "repositories",
        type: "public",
        ...params,
      },
    });
    const $ = cheerio.load(response);
    let repositories = [] as {
      name: string;
      uri: string;
      language: string;
      stars: number;
      forks: number;
      lastUpdate: Date;
    }[];

    $(selectors.repo.list).each((_i, el) => {
      const isForked = $(el).find(selectors.repo.listForked).length > 0;
      if (isForked) return;

      const name = $(el).find("h3 > a").text().trim();
      const language = $(el).find(selectors.repo.listLanguage).text().trim();
      const stars = intval($(el).find(selectors.repo.listStars).text().trim());
      const forks = intval($(el).find(selectors.repo.listForks).text().trim());
      const lastUpdate = $(el).find("relative-time").attr("datetime");

      repositories.push({
        name,
        uri: `${username}/${name}`,
        language,
        stars,
        forks,
        lastUpdate: dayjs(lastUpdate).toDate(),
      });
    });

    const prevPage = intval(
      $("a.prev_page")
        .attr("href")
        ?.match(/page=(\d+)/)?.[1]
    );
    const nextPage = intval(
      $("a.next_page")
        .attr("href")
        ?.match(/page=(\d+)/)?.[1]
    );

    if (params?.fetchAll && nextPage > 1 && nextPage < 10) {
      try {
        const nextPageRes = await this.getRepositories(username, {
          ...params,
          page: nextPage,
        });
        if (nextPageRes.repositories?.length > 0) {
          repositories = [...repositories, ...nextPageRes.repositories];
        }
      } catch (err) {
        //
      }
    }

    return { repositories, prevPage, nextPage };
  },

  async getRepoDetails(repo: string) {
    const response = await this.fetch(repo);
    const $ = cheerio.load(response);

    const languages = [] as { lang: string; amount: number }[];

    $(selectors.repo.langList)
      .parent()
      .find("ul > li > a")
      .each((_i, el) => {
        const lang = $(el).children().eq(1).text().trim();
        const percentage = $(el).children().eq(2).text().trim();
        const amount = parseFloat(percentage?.replace(/[^0-9.]/, "")) || 0;
        languages.push({ lang, amount });
      });

    return { languages };
  },

  async getRepoContributors(repo: string, options?: Partial<FetchOptions>) {
    const response = await this.fetch(`repos/${repo}/stats/contributors`, {
      ...options,
      ghApi: true,
      headers: { accept: "application/json", ...(options?.headers || {}) },
    });

    if (!Array.isArray(response)) {
      throw new Error("Invalid response: " + JSON.stringify(response));
    }

    const result = response
      .map((item: any) => {
        const { author, total, weeks } = item;
        let additions = 0;
        let deletions = 0;
        let commits = 0;

        weeks.forEach((week: any) => {
          additions += week.a || 0;
          deletions += week.d || 0;
          commits += week.c || 0;
        });

        return { author, total, additions, deletions, commits };
      })
      .sort((a, b) => b.total - a.total);

    return result;
  },

  async getAllData(username: string, options?: Partial<GetAllDataOptions>) {
    const user = await this.getUser(username);
    const repositories = [] as (Repository & {
      languages: Language[];
      contributors: Contributors;
    })[];

    const _repos = await this.getRepositories(username, {
      sort: "stargazers",
      fetchAll: true,
    });

    const repoCount = Math.min(
      _repos.repositories.length,
      options?.maxRepo || Number.POSITIVE_INFINITY
    );

    for (let idx = 0; idx < repoCount; idx++) {
      const repo = _repos.repositories[idx];
      const [details, contributors] = await Promise.all([
        this.getRepoDetails(repo.uri),
        this.getRepoContributors(repo.uri),
      ]);

      repositories.push({
        ...repo,
        languages: details.languages,
        contributors,
      });
    }

    return { user, repositories };
  },

  async fetch<T = any>(path: string, options?: Partial<FetchOptions>) {
    const url = new URL(
      "/" + path,
      options?.ghApi ? GITHUB_API_URL : GITHUB_URL
    );

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value as string);
      });
    }

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      ...(options?.headers || {}),
    };

    if (options?.xhr) {
      headers["X-Requested-With"] = "XMLHttpRequest";
    }

    const init = {
      method: "GET",
      headers,
      referrer: options?.referrer || GITHUB_URL,
    };

    const res = await fetch(url, init);
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const type = res.headers.get("Content-Type");

    if (type?.includes("application/json")) {
      return res.json() as T;
    }

    return res.text();
  },
};

type FetchOptions = {
  xhr: boolean;
  ghApi: boolean;
  params: any;
  headers: any;
  referrer: string;
};

type GetRepositoriesParams = {
  page: string | number;
  sort: "stargazers" | "name" | null;
  fetchAll: boolean;
};

type GetAllDataOptions = {
  maxRepo: number;
};

export type GithubUser = Awaited<ReturnType<typeof github.getUser>>;

export type Repository = Awaited<
  ReturnType<typeof github.getRepositories>
>["repositories"][number];

export type Language = Awaited<
  ReturnType<typeof github.getRepoDetails>
>["languages"][number];

export type Contributors = Awaited<
  ReturnType<typeof github.getRepoContributors>
>;

export type Contributor = NonNullable<Contributors>[number];

export type Achievement = GithubUser["achievements"][number];

export default github;
