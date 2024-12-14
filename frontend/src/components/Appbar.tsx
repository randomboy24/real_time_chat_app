import { Button } from "./ui/button";

export const Appbar = ({ isLoggedIn }) => {
  return (
    <div className="h-16 flex justify-end  items-center gap-x-4 pr-10 border-b">
      {isLoggedIn ? (
        <Button>Logout</Button>
      ) : (
        <div>
          <Button
            onClick={() => {
              fetch("http://localhost:3001/signup", {
                method: "POST",
                body: {
                  username: "",
                },
              });
            }}
          >
            Signup
          </Button>
          <Button>Login</Button>
        </div>
      )}
    </div>
  );
};
