import { RoomContext } from "@/app/context.";
import { Send, SendHorizonal, SendIcon } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
// import WebSocket from "ws";

export function Room() {
  const { roomName } = useContext(RoomContext);
  const [socket, setSocket] = useState<WebSocket>();
  const [message, setMessage] = useState<string[]>([]);
  const [inputData, setInputData] = useState("");
  const hasRun = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
    if (hasRun.current) {
      return;
    }
    const socket = new WebSocket("ws://localhost:3001");
    setSocket(socket);
    socket.onopen = () => {
      console.log("connection is open.");
      //   socket?.send(
      //     JSON.stringify({
      //       message: "this is a message from me",
      //     }
      //   );
    };
    socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      console.log(parsedData);
      setMessage((messages) => [
        ...messages,
        JSON.stringify(
          JSON.parse(
            new TextDecoder().decode(Buffer.from(parsedData.data.data))
          ).message
        ),
      ]);
    };
    hasRun.current = true;
  }, []);

  const onClickHandler = () => {
    socket?.send(
      JSON.stringify({
        token: localStorage.getItem("token"),
        message: inputData,
      })
    );
    setInputData("");
  };
  return (
    <div className="min-h-[700px] min-w-[500px] border border-black rounded-lg flex flex-col pt-4 font-extrabold text-2xl justify-end  items-center">
      <div className="mb-auto">{roomName}</div>
      {message.map((mes, index) => (
        <div key={index}>{mes}</div>
      ))}
      <div>
        <input
          ref={inputRef}
          type="text"
          className="border border-black"
          value={inputData}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClickHandler();
            }
          }}
          onChange={(e) => {
            setInputData(e.target.value);
          }}
        />
        <button onClick={onClickHandler} className="ml-2">
          <SendHorizonal />
        </button>
      </div>
    </div>
  );
}
