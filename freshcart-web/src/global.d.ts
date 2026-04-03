import { Connection } from "mongoose";

declare global {
  var mogoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {};
