import { RoomContext } from "@/app/context.";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction, useContext } from "react";

export enum proptype {
  create,
  join,
}
export function DialogDemo({
  type,
  setInRoom,
}: {
  type: proptype;
  setInRoom: Dispatch<SetStateAction<boolean>>;
}) {
  const { roomName, setRoomName } = useContext(RoomContext);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {type === proptype.create ? "Create" : "Join"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === proptype.create ? "Create" : "Join"} Room
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* Form moved inside DialogContent */}
        <form
          className="grid gap-4 py-4"
          onSubmit={(event) => {
            event.preventDefault(); // Prevent default reloads
            if (type === proptype.create) {
              const token = localStorage.getItem("token");
              fetch("http://localhost:3001/room", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  authorization: token as string,
                },
                body: JSON.stringify({ roomName: roomName }),
              })
                .then((res) => res.json())
                .then((data) => {
                  setRoomName(data.roomName);
                  setInRoom(true);
                });
              console.log("You have successfully submitted the form.");
            } else {
              fetch(`http://localhost:3001/room/${roomName}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  authorization: localStorage.getItem("token") as string,
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  setInRoom(true);
                });
            }
          }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Room Name
            </Label>
            <Input
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
              id="name"
              className="col-span-3"
              placeholder="Enter room name"
              required
              maxLength={20}
            />
          </div>
          <DialogFooter>
            <Button variant={"default"} size="default" type="submit">
              {type === proptype.create ? "Create" : "Join"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
