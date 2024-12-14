import { createContext, Dispatch, SetStateAction, useState } from "react";

interface roomType {
  roomName: string;
  setRoomName: Dispatch<SetStateAction<string>>;
}

export const RoomContext = createContext<roomType>({
  roomName: "",
  setRoomName: () => {},
});

export function RoomContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [roomName, setRoomName] = useState("");
  return (
    <RoomContext.Provider value={{ roomName, setRoomName }}>
      {children}
    </RoomContext.Provider>
  );
}
