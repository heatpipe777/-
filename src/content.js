// 앱 정보(지원금·뉴스·금리·최저임금) — 앱 업데이트 없이 바뀌는 부분
// · 앱 안에 넣어 둔 기본값: data/content.json (빌드할 때 함께 들어가요)
// · 앱이 켜질 때 GitHub에 올라간 최신 data/content.json을 받아와요 (6시간에 한 번)
// · 받아온 파일은 validateContent 검사를 통과해야만 쓰고, 이 휴대폰에 저장해 다음 실행·인터넷 끊김 때도 써요
// · 검사를 못 통과하거나 못 받으면 저장된 것 → 앱 안 기본값 순서로 써요 (빈 화면이 되지 않게)
// 매달 정보 업데이트 규칙: docs/정보_업데이트_규칙.md, 검사 도구: node scripts/content-check.mjs
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import BUNDLED from "../data/content.json";
import { validateContent } from "./contentRules.js";
export { validateContent };

export const CONTENT_URL = "https://raw.githubusercontent.com/heatpipe777/-/main/data/content.json";
const CACHE_KEY = "contentCache";
const CHECK_MS = 6 * 3600e3;

// ---- 앱이 쓰는 값 (ES 모듈이라 다른 파일에서 import하면 바뀐 값이 그대로 보여요) ----
export let CONTENT = BUNDLED;
export let ALL_PROGRAMS = [];
export let NEWS = [];
export let NEWS_UPDATED = "";
export let BOK_RATE = {};
export let BOK_HISTORY = [];
export let BOK_MEETINGS = [];
export let MIN_WAGES = [];

function apply(c) {
  CONTENT = c;
  ALL_PROGRAMS = c.programs;
  NEWS = [...c.news].sort((a, b) => b.date.localeCompare(a.date));
  NEWS_UPDATED = c.newsUpdated;
  BOK_RATE = c.bok.rate;
  BOK_HISTORY = c.bok.history;
  BOK_MEETINGS = c.bok.meetings;
  MIN_WAGES = c.minWages;
}

// 저장된 정보가 앱 안 기본값보다 새것이고 검사를 통과하면 그걸로 시작해요 (앱 업데이트로 기본값이 더 새것이면 기본값)
const readCache = () => {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || "null")?.content;
    return c && c.updated >= BUNDLED.updated && !validateContent(c).length ? c : null;
  } catch (e) {
    return null;
  }
};
apply(readCache() || BUNDLED);

// 최신 정보 받아오기 — 바뀌었으면 true (앱이 화면을 다시 그려요)
export async function refreshContent({ force = false } = {}) {
  let cache = {};
  try {
    cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch (e) {
    cache = {};
  }
  if (!force && Date.now() - (cache.checkedAt || 0) < CHECK_MS) return false;
  try {
    const url = `${CONTENT_URL}?t=${Math.floor(Date.now() / 60000)}`; // 1분 단위로 새 주소 → 오래된 사본 방지
    const data = Capacitor.isNativePlatform()
      ? (await CapacitorHttp.get({ url, responseType: "json", connectTimeout: 8000, readTimeout: 8000 })).data
      : await (await fetch(url, { cache: "no-store" })).json();
    const c = typeof data === "string" ? JSON.parse(data) : data;
    const errs = validateContent(c);
    const ok = !errs.length && c.updated >= BUNDLED.updated;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ checkedAt: Date.now(), content: ok ? c : cache.content || null }));
    } catch (e) {
      // 저장 못 해도 이번 실행에는 써요
    }
    if (!ok || JSON.stringify(c) === JSON.stringify(CONTENT)) return false;
    apply(c);
    return true;
  } catch (e) {
    return false; // 인터넷 끊김 등 — 지금 정보 그대로
  }
}
