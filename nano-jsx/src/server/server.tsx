import { debug } from "console";
import { renderSSR } from "nano-jsx";
import express from "express";
import { App } from "../components/app.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send(renderSSR(App));
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

process.on("SIGTERM", () => {
    debug("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        debug("HTTP server closed");
    });
});
