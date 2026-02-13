import { Server as SocketIOServer } from "socket.io";
import "socket.io";

interface Authpayload {
  id: number;
  exp?: number;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      authpayload?: Authpayload;
      tiempo?: number;
    }

    interface Locals {
      io: SocketIOServer;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    data: {
      user: Authpayload;
    };
  }
}
