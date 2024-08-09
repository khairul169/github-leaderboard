import { Tabs } from "react-daisyui";
import { useLeaderboardType } from "../hooks";
import { leaderboardTypes } from "../data";
import { useNavigate } from "react-router-dom";

const TypeTabs = () => {
  const [type] = useLeaderboardType();
  const navigate = useNavigate();

  return (
    <Tabs variant="boxed" className="mt-2 overflow-x-auto">
      {leaderboardTypes.map((item) => (
        <Tabs.Tab
          key={item.value}
          active={item.value === type}
          onClick={() => navigate(`/${item.value}`)}
          className="shrink-0 min-w-[140px]"
        >
          {item.title}
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

export default TypeTabs;
