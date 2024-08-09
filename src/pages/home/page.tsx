import Appbar from "@client/components/containers/appbar";
import RankBoard from "@client/pages/home/components/rank-board";
import { LeaderboardEntry, useLeaderboard, useLeaderboardType } from "./hooks";
import { useMemo } from "react";
import TypeTabs from "./components/type-tabs";
import ViewSheet from "./components/view-sheet";
import RankListItem, { RankListHeader } from "./components/rank-list-item";
import { useNavigate } from "react-router-dom";
import UserRank from "./components/user-rank";

const HomePage = () => {
  const [type, { query }] = useLeaderboardType();
  const { data } = useLeaderboard({ type, ...query });
  const navigate = useNavigate();

  const onView = (username: string) => {
    navigate(`/${type}/${username}`);
  };

  const topLeaderboard = useMemo(() => {
    const res = new Array(3).fill(null) as LeaderboardEntry[];
    if (!data) {
      return res;
    }

    res[1] = data.rows[0];
    res[0] = data.rows[1];
    res[2] = data.rows[2];
    return res;
  }, [data]);

  return (
    <div>
      <section className="bg-base-100 rounded-b-xl rounded-t-0 p-4 md:rounded-t-lg md:rounded-b-lg shadow-lg relative z-[1]">
        <Appbar title="Top Global Ranked Github" />
        <TypeTabs />

        <div className="grid grid-cols-3 items-end mt-8 mb-4">
          {topLeaderboard.map((item, idx) => {
            if (!item) {
              return <div key={idx} />;
            }

            return (
              <RankBoard
                key={item.name}
                rank={item.rank}
                name={item.name}
                avatar={item.image}
                sub={item.sub}
                onClick={type === "user" ? () => onView(item.id!) : undefined}
              />
            );
          })}
        </div>
      </section>

      <section className="bg-base-300 rounded-b-lg py-4 shadow-lg -mt-4">
        {data?.rows && data.rows.length > 3 ? (
          <>
            <RankListHeader columns={data.columns} />

            {data.rows.slice(3).map((item) => (
              <RankListItem
                key={item.id}
                rank={item.rank}
                columns={data.columns}
                data={item}
                onClick={type === "user" ? () => onView(item.id!) : undefined}
              />
            ))}
          </>
        ) : null}

        <UserRank />
      </section>

      <ViewSheet />
    </div>
  );
};

export default HomePage;
