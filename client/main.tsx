import React from "react";
import { createRoot, Root } from "react-dom/client";
import App from "./App";
import "./global.css";

const container = document.getElementById("root")!;
const g = globalThis as any;

let root: Root = g.__app_root || null;
if (!root) {
  root = createRoot(container);
  g.__app_root = root;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if (import.meta && import.meta.hot) {
  import.meta.hot.dispose(() => {
    // keep root for fast-refresh, React will reconcile
  });
}
