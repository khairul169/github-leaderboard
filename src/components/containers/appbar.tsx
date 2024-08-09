import { onLogin, onLogout, useAuth } from "@client/hooks/useAuth";
import { dummyAvatar } from "@client/lib/utils";
import { Avatar, Button, Card, Dropdown } from "react-daisyui";
import { FiUser } from "react-icons/fi";

type AppbarProps = {
  title?: string;
};

const Appbar = ({ title }: AppbarProps) => {
  const { user } = useAuth();

  return (
    <header className="flex flex-row items-center h-12">
      <div className="w-10" />

      {title ? (
        <h1 className="text-lg md:text-xl text-center flex-1 truncate">
          {title}
        </h1>
      ) : (
        <div className="flex-1" />
      )}

      {!user ? (
        <Button shape="circle" onClick={onLogin}>
          <FiUser size={18} />
        </Button>
      ) : (
        <Dropdown end>
          <Dropdown.Toggle button={false}>
            <Button
              shape="circle"
              className="p-0 w-[40px] min-h-0 h-[40px] overflow-hidden"
            >
              <Avatar
                shape="circle"
                size={40}
                src={user.avatar || dummyAvatar(user.id)}
              />
            </Button>
          </Dropdown.Toggle>
          <Dropdown.Menu className="card card-compact w-64 z-[5] shadow bg-base-300 text-base-content m-1">
            <Card.Body>
              <div className="flex items-start gap-4">
                <FiUser size={24} className="mt-1" />
                <div className="flex-1">
                  <p>{user.name}</p>
                  <p className="text-sm mt-0.5 text-base-content/80">
                    {"@" + user.username}
                  </p>

                  <Button
                    color="secondary"
                    className="mt-4"
                    size="sm"
                    fullWidth
                    onClick={onLogout}
                  >
                    Keluar
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </header>
  );
};

export default Appbar;
