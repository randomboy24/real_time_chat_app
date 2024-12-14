import express from "express";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { randomUUID } from "crypto";
import { WebSocket, WebSocketServer } from "ws";
// import { WebSocket } from "http";

dotenv.config();

const app = express();
app.use(cors());

type roomType = {
  roomName: string;
  admin: string;
  members: string[];
};

const rooms: roomType[] = [];

type userType = {
  username: string;
  password: string;
};

// type messagesType = {
//   roomId:
// }

const users: userType[] = [
  {
    username: "jatin",
    password: "jatin",
  },
];

app.use(express.json());

const authenticatoinMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"];
  console.log(token);
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    if (user) {
      next();
    } else {
      res.send("invalid token noon.");
    }
  } catch (err) {
    console.log(err);
    res.send("invalid token noon.");
  }
};

app.post("/signup", (req, res) => {
  const body = req.body;
  console.log("hey there");
  console.log(body);
  const { username, password } = body;
  console.log(JSON.stringify({ username, password }));
  if (!users.some((user) => user.username === username)) {
    users.push({
      username,
      password,
    });

    const token = jwt.sign({ username, password }, "secret");
    res.json({
      token,
    });
  } else {
    res.json({
      message: "user already exists",
    });
  }
});

app.post("/signin", (req, res) => {
  //   res.send("grgehrojn");
  console.log(process.env.JWT_SECRET);
  const body = req.body;
  const { username, password } = body;
  if (
    users.filter(
      (user) => user.username === username && user.password === password
    )
  ) {
    const token = jwt.sign(
      { username, password },
      process.env.JWT_SECRET as string
    );
    res.json({
      token,
    });
  } else {
    res.json({
      message: "user doesn't exist",
    });
  }
});

app.post("/room", authenticatoinMiddleware, (req, res) => {
  const { roomName } = req.body;
  const { username }: any = jwt.decode(req.headers["authorization"] as string);
  // const { username } = req.hera
  rooms.push({
    roomName: roomName,
    admin: username,
    members: [username],
  });

  console.log(rooms);
  res.json({
    roomName,
  });
});

app.get("/room/:roomName", authenticatoinMiddleware, (req, res) => {
  const roomName = req.params.roomName;
  res.json({
    message: "message received",
    roomName: `roomName received :- ${roomName}`,
  });
});

const httpServer = app.listen(3001, () => {
  console.log("listening on port 3000.");
});

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (socket) => {
  console.log("connected to web socket server.");
  socket.on("message", (data) => {
    console.log("received data :- " + data);
    const parsedData = JSON.parse(data.toString());
    console.log("token : - " + parsedData.token);
    console.log("message : - " + parsedData.message);
    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(
    //       JSON.stringify({
    //         data.message,
    //       })
    //     );
    //   }
    // });
  });
});

wss.on("close", () => {
  console.log("connection is closed.");
});
