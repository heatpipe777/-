import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

// window.storage는 Claude 아티팩트 전용이라, 일반 웹·앱에서는 localStorage로 대신 저장해요
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value === null ? null : { key, value };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value };
    },
  };
}

// 안드로이드 앱에서는 외부 링크를 Chrome 대신 인앱 브라우저(X 버튼으로 닫으면 앱으로 복귀)로 열어요
if (Capacitor.isNativePlatform()) {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || !/^https?:/i.test(a.href)) return;
    if (new URL(a.href).origin === window.location.origin) return;
    e.preventDefault();
    Browser.open({ url: a.href, toolbarColor: "#3D63DD" });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
