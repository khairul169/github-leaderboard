import BottomSheet, {
  BottomSheetDescription,
  BottomSheetTitle,
} from "@client/components/ui/bottom-sheet";
import { memo, useEffect, useMemo } from "react";
import { Avatar, Badge, Card, Dropdown, Progress } from "react-daisyui";
import { useGetUserLeaderboard } from "../hooks";
import { dummyAvatar } from "@client/lib/utils";
import { FiGitMerge, FiStar, FiType, FiUsers } from "react-icons/fi";
import { FaCode, FaRegStar, FaTrophy } from "react-icons/fa";
import { LuFolderGit } from "react-icons/lu";
import { IoMdGitBranch, IoMdGitCommit } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { pointWeights } from "../data";

const ViewSheet = () => {
  const { type, id } = useParams();
  const username = type !== "lang" ? id : null;
  const { data, refetch } = useGetUserLeaderboard(username);
  const navigate = useNavigate();

  const totalRepo = useMemo(() => {
    return data?.repositories.length || 0;
  }, [data]);
  const pendingRepos = useMemo(() => {
    return data?.repositories.filter((i) => i.isPending).length || 0;
  }, [data]);

  useEffect(() => {
    if (!pendingRepos) {
      return;
    }

    const interval = setInterval(refetch, 3000);
    return () => clearInterval(interval);
  }, [pendingRepos]);

  const summary = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        icon: LuFolderGit,
        name: "Personal repo",
        value: totalRepo,
      },
      {
        icon: FaRegStar,
        name: "Stars",
        value: data.repositories.reduce((acc, repo) => acc + repo.stars, 0),
      },
      {
        icon: IoMdGitBranch,
        name: "Forks",
        value: data.repositories.reduce((acc, repo) => acc + repo.forks, 0),
      },
      {
        icon: IoMdGitCommit,
        name: "Commits",
        value: data.user.commits,
      },
      {
        icon: FiType,
        name: "Lines of code",
        value: data.user.lineOfCodes,
      },
      {
        icon: FaCode,
        name: "Languages",
        value: data.languages.length,
      },
    ];
  }, [data, totalRepo]);

  const achievements = useMemo(() => {
    const items: Record<string, { name: string; image?: string }> = {};

    data?.user.achievements?.forEach((item) => {
      items[item.name] = item;
    });

    return Object.values(items);
  }, [data]);

  return (
    <BottomSheet
      open={!!username}
      onOpenChange={(open) => {
        if (!open) navigate(`/${type}`, { replace: true });
      }}
      className="h-[90%]"
    >
      <div className="p-4 md:p-8 flex-1 overflow-y-auto">
        <div className="text-center flex flex-col md:flex-row md:text-left gap-x-8 gap-y-4 items-center">
          <Avatar
            shape="circle"
            size="md"
            src={data?.user.avatar || dummyAvatar(data?.user.id)}
          />

          <div className="md:flex-1">
            <BottomSheetTitle>{data?.user.name}</BottomSheetTitle>
            <BottomSheetDescription>
              {"@" + (data?.user.username || "")}
            </BottomSheetDescription>

            <p className="text-sm mt-4">
              <FiUsers className="inline" />{" "}
              {data?.user?.followers + " followers"}
              {" • "}
              {data?.user?.following + " following"}
            </p>
          </div>

          <Dropdown className="dropdown-end w-full md:w-auto">
            <Dropdown.Toggle button={false}>
              <button className="bg-neutral hover:bg-neutral/80 active:opacity-50 text-neutral-content px-6 py-3 w-full rounded-lg">
                <div className="flex flex-row items-center justify-center font-mono gap-2 text-4xl md:text-3xl text-primary">
                  <FaTrophy size={24} />
                  <p>{data?.user.rank}</p>
                </div>
                <p className="text-xs">{data?.user.points + " pts"}</p>
              </button>
            </Dropdown.Toggle>
            <Dropdown.Menu className="card card-compact w-64 p-2 z-10 shadow-lg bg-base-300 text-base-content my-2 text-left">
              <Card.Body>
                <Card.Title tag="h3" className="text-base">
                  Perhitungan Point
                </Card.Title>

                <pre className="font-mono whitespace-break-spaces">
                  {JSON.stringify(pointWeights, null, 2)}
                </pre>

                <p>
                  Cek lebih lengkap{" "}
                  <a
                    href="https://github.com/khairul169/github-leaderboard/blob/main/server/jobs/calculate-user-points.ts"
                    target="_blank"
                    className="link"
                  >
                    disini
                  </a>
                  .
                </p>
              </Card.Body>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {data && pendingRepos > 0 && (
          <Card compact className="mt-4 md:mt-8 bg-base-300">
            <Card.Body>
              <Card.Title className="text-sm font-normal">
                Mengimport data repositori, mohon tunggu...
              </Card.Title>
              <Progress
                max={100}
                value={((totalRepo - pendingRepos) / totalRepo) * 100}
              />
            </Card.Body>
          </Card>
        )}

        {achievements.length > 0 && (
          <section id="achievements" className="mt-4 md:mt-8">
            <div className="flex flex-row sm:flex-wrap overflow-x-auto sm:overflow-hidden gap-2">
              {achievements.map((item) => (
                <div key={item.name} className="size-12 shrink-0">
                  <img src={item.image} title={item.name} />
                </div>
              ))}
            </div>
          </section>
        )}

        {data?.languages && data.languages.length > 0 && (
          <section id="languages" className="mt-4 md:mt-8">
            <div className="flex flex-row sm:flex-wrap overflow-x-auto gap-2 mt-2">
              {data?.languages.slice(0, 10).map((lang) => (
                <div
                  key={lang.name}
                  className="bg-base-300 shrink-0 rounded-xl px-3 py-2 text-xs inline-flex gap-2"
                >
                  <p>{lang.name}</p>
                  <Badge color="primary" size="sm" className="px-1">
                    {lang.percent.toFixed(1) + "%"}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
          {summary.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-row items-center gap-x-4 bg-base-300 rounded-xl px-4 py-3"
            >
              <item.icon size={24} className="shrink-0 md:ml-2" />
              <div className="flex-1 truncate">
                <p
                  className="text-2xl font-mono truncate"
                  title={String(item.value)}
                >
                  {item.value}
                </p>
                <p className="text-xs truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid">
          <p>Top Repositori</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {data?.repositories.slice(0, 3).map((item, idx) => (
              <a
                href={`https://github.com/${username}/${item.name}`}
                target="_blank"
                key={idx}
                className="rounded-xl px-4 py-3 bg-base-300 hover:bg-base-200 transition-all border border-base-content/50"
              >
                <LuFolderGit size={18} />
                <div className="flex-1 truncate">
                  <p className="mt-1 truncate">{item.name}</p>
                  <p className="text-xs truncate mt-0.5 text-base-content/80">
                    {item.languages?.map((i) => i.name).join(", ") ||
                      item.language}
                  </p>

                  <p className="flex flex-wrap items-center gap-1 text-xs mt-4">
                    <FiStar size={18} /> {item.stars}
                    <FiGitMerge size={18} className="ml-2" /> {item.forks}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </BottomSheet>
  );
};

export default memo(ViewSheet);
