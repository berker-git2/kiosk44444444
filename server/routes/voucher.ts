import type { RequestHandler } from "express";

export const sendVoucherEmail: RequestHandler = async (req, res) => {
  try {
    const { to, subject, html } = req.body as {
      to?: string;
      subject?: string;
      html?: string;
    };
    if (!to) return res.status(400).json({ error: "Missing recipient email" });

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure =
      String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";

    if (!host || !user || !pass || !from) {
      return res.status(501).json({ error: "SMTP not configured on server" });
    }

    let nodemailer: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      nodemailer = require("nodemailer");
    } catch {
      return res.status(501).json({ error: "Email library not installed" });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from,
      to,
      subject: subject || "Voucher",
      html: html || "",
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to send email" });
  }
};
