import { FaGithub } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="container max-w-3xl mx-auto p-0 md:py-8">
      <main>
        <Outlet />
      </main>

      <footer className="py-8 bg-base-300 text-center rounded-t-xl rounded-b-0 p-4 md:rounded-b-lg md:rounded-t-lg mt-8 shadow-lg">
        <a
          href="https://github.com/khairul169/github-leaderboard/stargazers"
          target="_blank"
          className="inline-flex flex-row items-center justify-center gap-2 hover:underline"
        >
          <p>Stars on Github</p>
          <FaGithub className="inline" />
        </a>
      </footer>
    </div>
  );
};

export default MainLayout;
