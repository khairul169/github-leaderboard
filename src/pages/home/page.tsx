import Appbar from "@client/components/containers/appbar";
import RankBoard from "@client/components/containers/rank-board";
import RankListItem, {
  RankListHeader,
} from "@client/components/containers/rank-list-item";
import { Button } from "react-daisyui";
import { FaGithub } from "react-icons/fa";
import {
  LeaderboardEntry,
  useGetUserLeaderboard,
  useLeaderboard,
} from "./hooks";
import { useMemo } from "react";
import { dummyAvatar } from "@client/lib/utils";
import { onLogin, useAuth } from "@client/hooks/useAuth";

const HomePage = () => {
  const { user } = useAuth();
  const { data } = useLeaderboard();
  const { data: userRank } = useGetUserLeaderboard(user?.username);

  const topLeaderboard = useMemo(() => {
    const res = new Array(3).fill(null) as LeaderboardEntry[];
    if (!data) {
      return res;
    }

    res[1] = data[0];
    res[0] = data[1];
    res[2] = data[2];
    return res;
  }, [data]);

  return (
    <div>
      <section className="bg-base-100 rounded-b-xl rounded-t-0 p-4 md:rounded-t-lg md:rounded-b-lg shadow-lg relative z-[1]">
        <Appbar title="Antrian Kick IMPHNEN" />

        <div className="grid grid-cols-3 items-end">
          {topLeaderboard.map((item, idx) => {
            if (!item) {
              return <div key={idx} />;
            }

            return (
              <RankBoard
                key={item.name}
                rank={item.rank}
                name={item.name}
                avatar={item.avatar || dummyAvatar(item.rank)}
                points={item.points}
              />
            );
          })}
        </div>
      </section>

      <section className="bg-base-300 rounded-b-lg py-4 shadow-lg -mt-4">
        <RankListHeader />

        {data?.slice(3).map((item) => (
          <RankListItem
            key={item.id}
            rank={item.rank}
            name={item.name}
            avatar={item.avatar || dummyAvatar(item.rank)}
            points={item.points}
          />
        ))}

        {userRank != null ? (
          <>
            <p className="text-sm text-base-content/80 mx-4 my-2">Kamu:</p>
            <RankListItem
              rank={userRank.user.rank}
              name={userRank.user.name}
              avatar={userRank.user.avatar || dummyAvatar(userRank.user.rank)}
              points={userRank.user.points}
              className="sticky z-[2] bottom-0 bg-base-100"
            />
          </>
        ) : (
          <div className="bg-base-100 mx-4 rounded-lg px-6 py-4 sticky bottom-4 z-[2]">
            <p>Pengen nama kamu masuk list ini juga?</p>
            <p className="inline">Hayuk</p>
            <Button
              size="sm"
              color="primary"
              className="mx-2"
              onClick={onLogin}
            >
              <FaGithub />
              <p>Login</p>
            </Button>
            <p className="inline">{"⸜(｡˃ ᵕ ˂ )⸝♡"}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
