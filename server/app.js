import cookieParser from "cookie-parser";
import express from "express";
import router from "./routes/user.route.js";
import teamspaceRouter from "./routes/teamspace.route.js";
import canvasRouter from "./routes/canvas.route.js";
import chatRouter from "./routes/chat.route.js";
import noteRouter from "./routes/note.route.js";
import taskRouter from "./routes/task.route.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser()  );

app.get("/", (_, res) => {
    res.send("hello , world");
});

app.use("/api/auth", router);
app.use('/api/teamspace', teamspaceRouter)
app.use("/api/teamspace", canvasRouter);
app.use('/api/teamspace' , chatRouter)
app.use('/api/teamspace' , noteRouter)
app.use('/api/teamspace' , taskRouter)

export default app;
