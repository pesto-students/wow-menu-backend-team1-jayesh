import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { APP_PORT, DATABASE_URL, REDIS_URL, SENTRY_DSN_URL } from "./config";
import routes from "./src/routes";
import mongoose from "mongoose";
import passport from "passport";
import ErrorHandlerMiddleware from "./src/middlewares/errorHandlerMiddleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
const app = express();

Sentry.init({
  dsn: SENTRY_DSN_URL,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

import { createClient } from "redis";

export const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    connectTimeout: 50000,
  },
});

redisClient
  .connect()
  .then(() => console.log("Connected to redis instance")) // eslint-disable-line
  .catch((e) => console.log(e)); // eslint-disable-line

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://wow-menu-customer.netlify.app",
      "https://wow-menu.netlify.app",
    ],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(cookieParser());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", () => {});
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on("error", () => console.error("database connection failed"));
db.once("open", () => console.log("database connection established")); // eslint-disable-line
mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  },
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use("/api", routes);

app.use(passport.initialize());

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      if (error.status >= 400) {
        return true;
      }
      return false;
    },
  }),
);
app.use(ErrorHandlerMiddleware);

app.use((req, res) =>
  res.status(404).json({ message: `Invalid request url path ${req.path}` }),
);

const port = process.env.PORT || APP_PORT;
httpServer.listen(port, () => console.log(`Listening on port ${port}`)); // eslint-disable-line

app.locals.io = io;
