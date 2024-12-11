"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const users = [
    {
        username: "jatin",
        password: "jatin",
    },
];
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const authenticatoinMiddleware = (req, res, next) => {
    const { token } = req.body;
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("user :- " + JSON.stringify(user));
        next();
    }
    catch (err) {
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
        const token = jsonwebtoken_1.default.sign({ username, password }, process.env.JWT_SECRET);
        res.json({
            token,
        });
    }
    else {
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
    if (users.filter((user) => user.username === username && user.password === password)) {
        const token = jsonwebtoken_1.default.sign({ username, password }, process.env.JWT_SECRET);
        res.json({
            token,
        });
    }
    else {
        res.json({
            message: "user doesn't exist",
        });
    }
});
app.listen(3000, () => {
    console.log("listening on port 3000.");
});
