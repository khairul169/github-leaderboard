import { cn } from "@client/lib/utils";
import { Avatar, Badge } from "react-daisyui";
import { FaTrophy } from "react-icons/fa";
import Lottie from "react-lottie";
import starsAnimation from "@client/assets/stars-animation.json";

type RankBoardProps = {
  name: string;
  avatar: string;
  points: number;
  rank: number;
};

const RankBoard = ({ name, avatar, points, rank }: RankBoardProps) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center rounded-lg py-4 hover:bg-neutral/70 active:scale-x-105 transition-all relative"
      )}
    >
      {rank === 1 ? (
        <>
          <div className="absolute z-0 top-1/2 -translate-y-1/2 scale-150 left-0 pointer-events-none">
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

      <Avatar
        src={avatar}
        size={rank === 1 ? 96 : 64}
        className="mt-4"
        border
        shape="circle"
      />
      <p className="mt-4 text-sm">{name}</p>
      <p className="text-xs mt-0.5 text-base-content/80">{`${points} poin`}</p>
    </button>
  );
};

export default RankBoard;
