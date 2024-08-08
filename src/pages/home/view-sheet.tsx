import BottomSheet, {
  BottomSheetDescription,
  BottomSheetTitle,
} from "@client/components/ui/bottom-sheet";
import { setHashUrl, useHashUrl } from "@client/hooks/useHashUrl";
import { memo, useMemo } from "react";
import { Avatar, Badge } from "react-daisyui";
import { useGetUserLeaderboard } from "./hooks";
import { dummyAvatar } from "@client/lib/utils";
import { FiType, FiUsers } from "react-icons/fi";
import { FaCode, FaRegStar, FaTrophy } from "react-icons/fa";
import { LuFolderGit } from "react-icons/lu";
import { IoMdGitBranch, IoMdGitCommit } from "react-icons/io";

const ViewSheet = () => {
  const username = useHashUrl();
  const { data } = useGetUserLeaderboard(username);

  const summary = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        icon: LuFolderGit,
        name: "Personal repo",
        value: data.repositories.length,
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
        name: "Line of codes",
        value: data.user.lineOfCodes,
      },
      {
        icon: FaCode,
        name: "Languages",
        value: data.languages.length,
      },
    ];
  }, [data]);

  return (
    <BottomSheet
      open={!!username}
      onOpenChange={(open) => {
        if (!open) setHashUrl("");
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

          <div className="bg-neutral text-neutral-content px-6 py-3 w-full md:w-auto rounded-lg">
            <div className="flex flex-row items-center justify-center font-mono gap-2 text-4xl md:text-3xl text-primary">
              <FaTrophy size={24} />
              <p>{data?.user.rank}</p>
            </div>
            <p className="text-xs">{data?.user.points + " pts"}</p>
          </div>
        </div>

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
      </div>
    </BottomSheet>
  );
};

export default memo(ViewSheet);
