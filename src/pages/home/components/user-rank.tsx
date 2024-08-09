import { useGetUserLeaderboard, useLeaderboardType } from "../hooks";
import { onLogin, useAuth } from "@client/hooks/useAuth";
import RankListItem from "./rank-list-item";
import { Button } from "react-daisyui";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

const UserRank = () => {
  const [type] = useLeaderboardType();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data } = useGetUserLeaderboard(user?.username);

  const onView = (username: string) => {
    navigate(`/${type}/${username}`);
  };

  if (type !== "user") {
    return null;
  }

  if (!data) {
    return (
      <div className="bg-base-100 mx-4 rounded-lg px-6 py-4 sticky bottom-4 z-[2]">
        <p>Pengen nama kamu masuk list ini juga?</p>
        <p className="inline">Hayuk</p>
        <Button size="sm" color="primary" className="mx-2" onClick={onLogin}>
          <FaGithub />
          <p>Login</p>
        </Button>
        <p className="inline">{"⸜(｡˃ ᵕ ˂ )⸝♡"}</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-base-content/80 mx-4 my-2">Kamu:</p>
      <RankListItem
        rank={data.user.rank}
        columns={[
          { title: "Nama", selector: "name" },
          { title: "Points", selector: "sub" },
        ]}
        data={{
          name: data.user.name,
          sub: `${data.user.points} pts`,
          image: data.user.avatar,
          rank: data.user.rank,
        }}
        className="sticky z-[2] bottom-0 bg-base-100"
        onClick={() => onView(data.user.username)}
      />
    </>
  );
};

export default memo(UserRank);
