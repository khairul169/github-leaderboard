import { cn, dummyAvatar } from "@client/lib/utils";
import { Badge } from "react-daisyui";
import { FaTrophy } from "react-icons/fa";
import Lottie from "react-lottie";
import starsAnimation from "@client/assets/stars-animation.json";

type RankBoardProps = {
  name: string;
  avatar?: string | null;
  sub: string;
  rank: number;
  onClick?: () => void;
};

const RankBoard = ({ name, avatar, sub, rank, onClick }: RankBoardProps) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center rounded-lg py-4 transition-all relative cursor-default",
        onClick != null &&
          "hover:bg-neutral/70 active:scale-x-105 cursor-pointer"
      )}
      onClick={onClick}
    >
      {rank === 1 ? (
        <>
          <div className="absolute z-0 top-1/2 -translate-y-1/2 scale-125 left-0 pointer-events-none">
            <Lottie
              options={{
                animationData: starsAnimation,
                loop: true,
                autoplay: true,
              }}
            />
          </div>
          <div className="relative">
            <FaTrophy size={32} className="text-yellow-400" />
            <p className="text-gray-900 absolute top-0 left-1/2 -translate-x-1/2 z-[1] font-bold text-center">
              {rank}
            </p>
          </div>
        </>
      ) : (
        <Badge color="primary">{rank}</Badge>
      )}

      <div
        className={cn(
          "mt-4 z-[1] size-[64px] rounded-full overflow-hidden bg-base-300 ring-4 ring-neutral ring-offset-2",
          rank === 1 && "size-[96px]"
        )}
      >
        <img
          src={avatar || dummyAvatar(rank)}
          className={cn("size-[64px] scale-110", rank === 1 && "size-[96px]")}
        />
      </div>
      <p className="mt-4 text-sm">{name}</p>
      <p className="text-xs mt-0.5 text-base-content/80">{sub}</p>
    </button>
  );
};

export default RankBoard;
