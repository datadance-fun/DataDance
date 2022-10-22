import pino from "pino";

export const log = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss.l",
      ignore: "pid,hostname,plugin,reqId",
      levelFirst: true,
    },
  },
});
