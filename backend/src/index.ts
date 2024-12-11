import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

type userType = {
  username: string;
  password: string;
};

const users: userType[] = [
  {
    username: "jatin",
    password: "jatin",
  },
];

app.use(express.json());
app.use(cors());

const authenticatoinMiddleware = (req: any, res: any, next: any) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("user :- " + JSON.stringify(user));
    next();
  } catch (err) {
    res.send("invalid token noon.");
  }
};

app.post("/signup", authenticatoinMiddleware, (req, res) => {
  const body = req.body;
  const { username, password } = body;
  if (!users.some((user) => user.username === username)) {
    users.push({
      username,
      password,
    });

    const token = jwt.sign(
      { username, password },
      process.env.JWT_SECRET as string
    );
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
app.listen(3000, () => {
  console.log("listening on port 3000.");
});
