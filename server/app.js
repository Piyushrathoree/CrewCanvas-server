import cookieParser from "cookie-parser";
import express from "express";
import router from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/", (_, res) => {
    res.send("hello , world");
});

app.use("/api/auth/", router);

export default app;
