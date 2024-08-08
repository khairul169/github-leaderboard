import { cn } from "@client/lib/utils";
import { Avatar, Badge } from "react-daisyui";

type RankListItemProps = {
  name: string;
  avatar: string;
  points: number;
  rank: number;
  className?: string;
  onClick?: () => void;
};

const RankListItem = ({
  name,
  avatar,
  points,
  rank,
  className,
  onClick,
}: RankListItemProps) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-row w-full items-center gap-x-2 text-left text-sm p-4 hover:bg-neutral/70 active:scale-x-105 transition-all",
        rank % 2 === 0 && "bg-base-100/50",
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

      <div className="flex-1 flex flex-row items-center gap-x-2 truncate">
        <Avatar src={avatar} size={24} />
        <p className="truncate">{name}</p>
      </div>

      <p className="flex-1 text-base-content/80">{`${points} poin`}</p>
    </button>
  );
};

export const RankListHeader = () => {
  return (
    <div className="flex flex-row items-center gap-x-2 w-full text-sm bg-base-300 text-base-content/80 p-4 py-2 mt-2 sticky z-[2] top-0">
      <div className="w-10" />
      <p className="flex-1">Nama</p>
      <p className="flex-1">Jumlah Poin</p>
    </div>
  );
};

export default RankListItem;
