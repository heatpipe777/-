import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { SplashScreen } from "@capacitor/splash-screen";

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

// 휴대폰 시작 화면(아이콘)은 인트로 그림까지 다 그려진 뒤에 닫아요 → 그 사이 빈 화면이 안 생겨요
const introShown = (async () => {
  const img = document.querySelector("#intro img");
  try {
    if (img) await img.decode();
  } catch (e) {
    // 그림을 못 불러와도 계속
  }
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  if (Capacitor.isNativePlatform()) await SplashScreen.hide({ fadeOutDuration: 150 }).catch(() => {});
})();

// 시작 인트로: 이름·소개를 2초 보여주고 서서히 사라져요 (한 번만, 반복 효과 없음)
const hideIntro = async () => {
  const el = document.getElementById("intro");
  if (!el) return;
  await introShown;
  setTimeout(() => {
    el.classList.add("hide");
    setTimeout(() => el.remove(), 400);
  }, 2000);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
requestAnimationFrame(() => requestAnimationFrame(hideIntro));
