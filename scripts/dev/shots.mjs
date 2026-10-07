// 스토어용 화면 캡처: 예시 데이터 넣고 → 화면 이동 → adb 캡처
import { execSync } from "child_process";
import fs from "fs";
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const ADB = "C:/Android/Sdk/platform-tools/adb.exe";
const adb = (a) => execSync(`"${ADB}" ${a}`, { cwd: "C:/Users/미미", env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  const pages = await (await fetch("http://127.0.0.1:9333/json")).json();
  const page = pages.find((p) => p.type === "page" && p.url.startsWith("https://localhost"));
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let seq = 0;
  const pend = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) (pend.get(m.id)(m), pend.delete(m.id));
  });
  const ev = (expr) =>
    new Promise((res) => {
      const id = ++seq;
      pend.set(id, (m) => res(m.result?.result?.value));
      ws.send(JSON.stringify({ id, method: "Runtime.evaluate", params: { expression: expr, awaitPromise: true, returnByValue: true } }));
    });
  return { ws, ev };
}

const PREFS = {
  favorites: [1, 10, 11, 13],
  notifyIds: [1, 10],
  notifyEnabled: true,
  rateAlertOn: true,
  taxAlertOn: true,
  taxStaff: true,
  alertPlan: "normal",
  alertHour: 9,
  myEvents: [
    { id: "e1", title: "월급날", emoji: "💰", repeat: "monthly", day: 10, alert: true },
    { id: "e2", title: "가게 임대료", emoji: "🏠", repeat: "monthly", day: 25, alert: true },
    { id: "e3", title: "식자재 대금 결제", emoji: "🧾", repeat: "once", date: "2026-10-16", alert: true },
  ],
  nickname: "행복분식",
  onboardDone: true,
  region: "전체",
  diagnosis: null,
};

let { ws, ev } = await connect();
await ev(`localStorage.setItem("prefs", ${JSON.stringify(JSON.stringify(PREFS))}); localStorage.setItem("homeUpcoming","subsidy"); location.reload(); true`);
ws.close();
await sleep(5000);
({ ws, ev } = await connect());

const click = (t) =>
  ev(`(()=>{const els=[...document.querySelectorAll("button,[role=button],a")].filter(el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height)return false;return ((el.getAttribute("aria-label")||"")+" "+el.innerText.replace(/\\s+/g," ")).includes(${JSON.stringify(t)})});els.sort((a,b)=>a.innerText.length-b.innerText.length);if(!els[0])return false;els[0].click();return true})()`);
const top = () => ev("window.scrollTo(0,0); document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0}); true");
const go = async (steps) => {
  for (const s of steps) {
    if (s === "home") {
      for (let i = 0; i < 4; i++) if (!(await click("뒤로가기"))) break; else await sleep(700);
      await click("홈");
    } else if (s.startsWith("scroll:")) {
      await ev(`window.scrollTo(0, ${s.slice(7)}); true`);
    } else if (s === "diag:on" || s === "diag:off") {
      // 맞춤 진단 결과 화면용 예시 진단 (찍고 나면 diag:off로 원래대로)
      const diag = s === "diag:on" ? { region: "서울", industry: "food", revenueBand: "30to100", yearsBand: "1to3", employees: "1to4", needs: ["funds", "fixed"], situation: ["decline"], version: 2 } : null;
      await ev(`(()=>{const p=JSON.parse(localStorage.getItem("prefs"));p.diagnosis=${JSON.stringify(diag)};localStorage.setItem("prefs",JSON.stringify(p));location.reload();return true})()`);
      ws.close();
      await sleep(5000);
      ({ ws, ev } = await connect());
    } else if (s === "calc:clear") {
      await ev(`localStorage.removeItem("calcTab"); true`);
    } else {
      const ok = await click(s);
      if (!ok) console.log("못 찾음:", s);
    }
    await sleep(1300);
  }
};
const shot = (name) => {
  fs.writeFileSync(`${OUT}/${name}.png`, adb("exec-out screencap -p"));
  console.log("찍음", name);
};

const SHOTS = [
  ["01_home", ["home"]],
  ["02_list", ["home", "지원금"]],
  ["03_detail", ["고효율기기"]],
  ["04_schedule", ["home", "일정 열기"]],
  ["05_calc", ["calc:clear", "home", "계산기"]],
  ["06_rates", ["home", "금리·환율"]],
  ["07_center", ["home", "지역센터"]],
  ["08_alert", ["home", "MY", "알림 설정"]],
  ["09_diag", ["home", "맞춤"]],
  ["09_diag_result", ["diag:on", "home", "결과 보기"]],
  ["09_diag_reset", ["diag:off", "home"]],
  ["10_fav", ["home", "즐겨찾기"]],
  ["11_my", ["home", "MY"]],
  ["12_news", ["home", "뉴스"]],
  ["h_faq", ["home", "도움말"]],
  ["h_docs", ["home", "서류"]],
  ["h_name", ["home", "MY", "내 이름"]],
  ["h_region", ["home", "MY", "내 지역"]],
  ["h_event", ["home", "일정 열기", "내 일정 추가"]],
];
const only = process.argv[3] ? process.argv[3].split(",") : null;
for (const [name, steps] of SHOTS) {
  if (only && !only.includes(name)) continue;
  await go(steps);
  await top();
  await sleep(1200);
  shot(name);
}
ws.close();
