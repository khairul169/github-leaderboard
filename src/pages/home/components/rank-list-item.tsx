import { cn, dummyAvatar } from "@client/lib/utils";
import { Badge } from "react-daisyui";
import { LeaderboardColumn, LeaderboardEntry } from "../hooks";
import Avatar from "@client/components/ui/avatar";

type RankListItemProps = {
  rank: number;
  columns: LeaderboardColumn[];
  data: LeaderboardEntry;
  className?: string;
  onClick?: () => void;
};

const RankListItem = ({
  rank,
  columns,
  data,
  className,
  onClick,
}: RankListItemProps) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-row w-full items-center gap-x-2 text-left text-sm p-4 hover:bg-neutral/70 transition-all cursor-default",
        rank % 2 === 0 && "bg-base-100/50",
        onClick != null && "active:scale-x-105 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="w-10">
        <Badge
          color="primary"
          variant={rank > 10 ? "outline" : undefined}
          size="sm"
        >
          {rank}
        </Badge>
      </div>

      {columns.map((col, idx) => {
        const value = (data as any)[col.selector];

        return (
          <div
            key={idx}
            className={cn(
              "flex-1 truncate",
              idx === 0 && data.image
                ? "flex flex-row items-center gap-x-2"
                : ""
            )}
          >
            {idx === 0 && data.image ? (
              <Avatar
                src={data.image}
                fallback={dummyAvatar(idx + 1)}
                shape="circle"
                size={24}
              />
            ) : null}

            <p className="truncate">{value}</p>
          </div>
        );
      })}
    </button>
  );
};

type RankListHeaderProps = {
  columns: LeaderboardColumn[];
};

export const RankListHeader = ({ columns }: RankListHeaderProps) => {
  return (
    <div className="flex flex-row items-center gap-x-2 w-full text-sm bg-base-300 text-base-content/80 p-4 py-2 mt-2 sticky z-[2] top-0 rounded-lg">
      <div className="w-10" />
      {columns.map((col, idx) => (
        <p key={idx} className="flex-1">
          {col.title}
        </p>
      ))}
    </div>
  );
};

export default RankListItem;
