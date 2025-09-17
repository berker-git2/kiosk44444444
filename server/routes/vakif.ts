import type { RequestHandler } from "express";
import crypto from "node:crypto";
import type { VakifInitRequest, VakifInitResponse } from "@shared/api";

function base64sha(data: string, algo: string) {
  return crypto.createHash(algo).update(data, "utf8").digest("base64");
}

function amountToString(amount: number) {
  // Vakif/NestPay expects dot as decimal separator; integers are fine
  return amount.toFixed(2);
}

export const vakifInit: RequestHandler = (req, res) => {
  const body = req.body as VakifInitRequest;
  const clientId = process.env.VAKIF_CLIENT_ID || "";
  const storeKey = process.env.VAKIF_STORE_KEY || "";
  const gatewayUrl = process.env.VAKIF_GATEWAY_URL || ""; // e.g. https://trpos-test.vakifbank.com.tr/fim/est3Dgate
  const hashAlgo = process.env.VAKIF_HASH_ALGO || "sha512"; // usually sha512
  const currency = (
    body.currency ||
    process.env.VAKIF_CURRENCY ||
    "EUR"
  ).toUpperCase();

  if (!clientId || !storeKey || !gatewayUrl) {
    res.status(500).json({ error: "VakıfBank credentials are not configured" });
    return;
  }

  const amount = amountToString(body.amount);
  const oid = body.orderId; // unique order id
  const okUrl =
    process.env.VAKIF_OK_URL ||
    `${req.protocol}://${req.get("host")}/api/payments/vakif/return`;
  const failUrl =
    process.env.VAKIF_FAIL_URL ||
    `${req.protocol}://${req.get("host")}/api/payments/vakif/return`;
  const tranType = "Auth"; // sale
  const instalment = ""; // no installment
  const storetype = "3d_pay"; // 3D Host Pay
  const lang = "tr";
  const curr =
    currency === "TRY"
      ? "949"
      : currency === "USD"
        ? "840"
        : currency === "EUR"
          ? "978"
          : currency; // accept numeric or code
  const rnd = String(Date.now());

  // Common NestPay hash composition
  const hashStr = `${clientId}${oid}${amount}${okUrl}${failUrl}${tranType}${instalment}${rnd}${storeKey}`;
  const hash = base64sha(hashStr, hashAlgo);

  const fields: Record<string, string> = {
    clientid: clientId,
    oid,
    amount,
    okUrl,
    failUrl,
    islemtipi: tranType,
    TranType: tranType,
    taksit: instalment,
    instalment,
    storetype,
    lang,
    currency: String(curr),
    rnd,
    hash,
    Description: body.description || "",
  };

  const response: VakifInitResponse = { gatewayUrl, fields };
  res.json(response);
};

export const vakifReturn: RequestHandler = (req, res) => {
  const data = { ...req.query, ...req.body } as Record<string, string>;
  const mdStatus = String(data.mdStatus || "");
  const procCode = String(data.ProcReturnCode || data.procReturnCode || "");
  const success =
    ["1", "2", "3", "4"].includes(mdStatus) &&
    (procCode === "00" || procCode === "0");
  const oid = data.oid || data.Oid || "";

  const html = `<!doctype html><meta charset='utf-8' />
  <style>body{font-family:Inter,system-ui,Arial,sans-serif;padding:32px} .ok{color:#0a7f2e} .fail{color:#b00020}</style>
  <h2>${success ? "Rezervasyonunuz onaylanmıştır" : "Ödeme başarısız"}</h2>
  <p>Sipariş No: <b>${oid}</b></p>
  <p>Durum: mdStatus=${mdStatus} ProcReturnCode=${procCode}</p>
  <script>try{window.localStorage.setItem('payment_result', JSON.stringify(${JSON.stringify(
    { success: true },
  )}));}catch(e){}</script>`;

  res.status(success ? 200 : 400).send(html);
};
