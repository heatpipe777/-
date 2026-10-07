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

// 시작 인트로: 이름·소개를 잠깐 보여주고 서서히 사라져요 (한 번만, 반복 효과 없음)
const hideIntro = () => {
  const el = document.getElementById("intro");
  if (!el) return;
  // 휴대폰 시작 화면에 가려져 있던 시간도 있으니, 앱이 준비된 뒤에도 최소 1.3초는 보여줘요
  const wait = Math.max(1300, 1800 - (performance.now() - (window.__introStart || 0)));
  setTimeout(() => {
    el.classList.add("hide");
    setTimeout(() => el.remove(), 400);
  }, wait);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
requestAnimationFrame(() => requestAnimationFrame(hideIntro));
