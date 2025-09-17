import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // VakifBank payment endpoints
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const vakif = require("./routes/vakif") as typeof import("./routes/vakif");
  app.post("/api/payments/vakif/init", vakif.vakifInit);
  app.all("/api/payments/vakif/return", vakif.vakifReturn);

  const voucher =
    require("./routes/voucher") as typeof import("./routes/voucher");
  app.post("/api/voucher-email", voucher.sendVoucherEmail);

  // Exchange rates proxy + cache
  const exchange = require("./routes/rates") as typeof import("./routes/rates");
  app.get("/api/exchange", exchange.exchangeHandler);

  return app;
}
