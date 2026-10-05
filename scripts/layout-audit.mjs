// 화면 배치 자동 점검 도구
// 에뮬레이터/폰에 설치된 앱(디버그 빌드)에 연결해서, 주요 화면을 차례로 열며
// ① 화면 밖으로 삐져나간 요소 ② 옆으로 넘기는 줄의 마지막 칸이 잘리는지 ③ 말줄임 없이 잘린 글자를 찾아요.
//
// 사용법 (프로젝트 폴더 밖에서 adb 실행):
//   adb forward tcp:9333 localabstract:webview_devtools_remote_<번호>
//   node scripts/layout-audit.mjs
const PORT = process.env.AUDIT_PORT || 9333;

const pages = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
const page = pages.find((p) => p.type === "page");
if (!page) throw new Error("앱 화면을 찾지 못했어요. 앱이 켜져 있는지 확인하세요.");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((res) => {
    const id = ++seq;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 300));
  return r.result?.result?.value;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 페이지 안에서 쓰는 도우미
const HELPERS = `
window.__audit = {
  click(text) {
    const els = [...document.querySelectorAll("button, [role=button], a")].filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      if (el.tagName === "A" && /^https?:/.test(el.getAttribute("href") || "") && !el.href.startsWith(location.origin)) return false;
      const label = (el.getAttribute("aria-label") || "") + " " + el.innerText.replace(/\\s+/g, " ");
      return label.includes(text);
    });
    els.sort((a, b) => a.innerText.length - b.innerText.length);
    if (!els[0]) return false;
    els[0].click();
    return true;
  },
  check(screen) {
    const vw = document.documentElement.clientWidth;
    const issues = [];
    const label = (el) => (el.innerText || el.getAttribute("aria-label") || el.tagName).replace(/\\s+/g, " ").trim().slice(0, 30);
    const visible = (el) => {
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const clipAncestor = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (s.overflowX !== "visible" || s.overflow !== "visible") return p;
      }
      return null;
    };
    // ① 화면 밖으로 삐져나간 요소 (잘라주는 부모가 없는 경우)
    for (const el of document.querySelectorAll("body *")) {
      if (!visible(el) || el.closest("[aria-hidden=true]")) continue;
      const r = el.getBoundingClientRect();
      if ((r.right > vw + 1 || r.left < -1) && !clipAncestor(el) && getComputedStyle(el).position !== "fixed") {
        issues.push({ type: "화면 밖으로 나감", el: label(el), left: Math.round(r.left), right: Math.round(r.right), vw });
      }
    }
    // ② 가로 스크롤 줄: 끝까지 넘겼을 때 마지막 칸이 흐림/가장자리에 가리는지
    for (const row of document.querySelectorAll("*")) {
      const s = getComputedStyle(row);
      if (!(s.overflowX === "auto" || s.overflowX === "scroll") || row.scrollWidth <= row.clientWidth + 1 || !visible(row)) continue;
      const prev = row.scrollLeft;
      row.scrollLeft = row.scrollWidth;
      const items = [...row.children].filter((c) => !c.hasAttribute("data-scroll-end") && visible(c));
      const last = items[items.length - 1];
      const rr = row.getBoundingClientRect();
      // 흐림 효과(마스크)는 "transparent" 또는 "rgba(0, 0, 0, 0)"로 나타나요
      const maskStr = (s.webkitMaskImage || "") + (s.maskImage || "");
      const mask = /transparent|rgba\\([^)]*,\\s*0\\)/.test(maskStr) ? 24 : 0;
      const limit = Math.min(rr.right, vw) - mask;
      if (last) {
        const lr = last.getBoundingClientRect();
        if (lr.right > limit + 1) issues.push({ type: "가로 줄 마지막 칸 잘림", el: label(last), right: Math.round(lr.right), limit: Math.round(limit) });
      }
      // 첫 칸도 확인
      row.scrollLeft = 0;
      const first = items[0];
      if (first) {
        const fr = first.getBoundingClientRect();
        if (fr.left < Math.max(rr.left, 0) - 1) issues.push({ type: "가로 줄 첫 칸 잘림", el: label(first), left: Math.round(fr.left) });
      }
      row.scrollLeft = prev;
    }
    // ③ 말줄임(…) 없이 잘린 글자
    for (const el of document.querySelectorAll("p, span, h1, h2, h3, button, a, b")) {
      if (!visible(el) || !el.innerText.trim()) continue;
      const s = getComputedStyle(el);
      const ellipsis = s.textOverflow === "ellipsis" || s.webkitLineClamp !== "none";
      if (ellipsis) continue;
      if ((s.overflowX === "hidden" || s.overflow === "hidden") && el.scrollWidth > el.clientWidth + 1) {
        issues.push({ type: "글자 가로 잘림", el: label(el) });
      }
      if ((s.overflowY === "hidden" || s.overflow === "hidden") && el.scrollHeight > el.clientHeight + 2 && el.children.length === 0) {
        issues.push({ type: "글자 세로 잘림", el: label(el) });
      }
    }
    // 하단 탭바에 내용이 가리는지: 맨 아래까지 내렸을 때 마지막 내용의 아래쪽이 탭바 위에 있어야 해요
    return { screen, vw, issues };
  },
};
true;
`;

const SCREENS = [
  { name: "홈", steps: [["home"]] },
  { name: "지원금 목록", steps: [["home"], ["click", "지원금"]] },
  { name: "접수마감", steps: [["click", "접수마감"]] },
  { name: "지원금 상세", steps: [["click", "신청가능"], ["click", "일반경영안정자금"]] },
  { name: "지역센터", steps: [["home"], ["click", "지역센터"]] },
  { name: "금리·환율", steps: [["home"], ["click", "금리·환율"]] },
  { name: "환율 정보", steps: [["click", "환율 정보"]] },
  { name: "계산기", steps: [["home"], ["click", "사장님 필수 계산기"]] },
  { name: "도움말 Q&A", steps: [["home"], ["click", "도움말"]] },
  { name: "서류·양식", steps: [["home"], ["click", "서류"]] },
  { name: "홈 사장님 일정 탭", steps: [["home"], ["click", "지원금 마감"], ["click", " 일정"]] },
  { name: "사장님 일정", steps: [["home"], ["click", "서류"], ["home"], ["click", "도움말"], ["home"], ["click", " 일정"], ["click", "전체보기"]] },
  { name: "내 일정 추가 창", steps: [["click", "내 일정 추가"]] },
  { name: "뉴스", steps: [["home"], ["click", "뉴스"]] },
  { name: "뉴스 상세", steps: [["click", "울산시"]] },
  { name: "즐겨찾기", steps: [["home"], ["click", "즐겨찾기"]] },
  { name: "MY", steps: [["home"], ["click", "MY"]] },
  { name: "내 이름", steps: [["click", "내 이름"]] },
  { name: "MY 복귀", steps: [["home"], ["click", "MY"]] },
  { name: "알림 설정", steps: [["click", "알림 설정"]] },
  { name: "내 지역 선택 창", steps: [["home"], ["click", "MY"], ["click", "내 지역"]] },
  { name: "세부 지역 선택", steps: [["click", "경북"]] },
  { name: "지역 선택 완료", steps: [["click", "완료"]] },
  { name: "맞춤 진단 1단계", steps: [["home"], ["click", "맞춤"]] },
];

await evaluate(HELPERS);
const results = [];
// 첫 실행 이름 입력 화면이 떠 있으면 먼저 점검하고 건너뛰어요
if (await evaluate(`document.body.innerText.includes("어떻게 불러드릴까요")`)) {
  results.push(await evaluate(`__audit.check("첫 실행 이름 입력")`));
  await evaluate(`__audit.click("건너뛰기")`);
  await sleep(900);
}
for (const sc of SCREENS) {
  for (const [kind, arg] of sc.steps) {
    if (kind === "home") {
      // 뒤로가기 버튼을 여러 번 눌러 홈으로
      for (let i = 0; i < 4; i++) {
        const ok = await evaluate(`__audit.click("뒤로가기")`);
        if (!ok) break;
        await sleep(400);
      }
      await evaluate(`__audit.click("홈")`);
    } else {
      const ok = await evaluate(`__audit.click(${JSON.stringify(arg)})`);
      if (!ok) results.push({ screen: sc.name, issues: [{ type: "이동 실패", el: arg }] });
    }
    await sleep(900);
  }
  await evaluate(HELPERS);
  // 도구 검증용: AUDIT_SELFTEST=1이면 끝 여백을 일부러 지우고 검사해요 (잘림을 잡아내야 정상)
  if (process.env.AUDIT_SELFTEST) await evaluate(`document.querySelectorAll("[data-scroll-end]").forEach((e) => e.remove()); true`);
  results.push(await evaluate(`__audit.check(${JSON.stringify(sc.name)})`));
}
ws.close();

let total = 0;
for (const r of results) {
  if (!r.issues.length) {
    console.log(`✅ ${r.screen}`);
    continue;
  }
  total += r.issues.length;
  console.log(`❌ ${r.screen}`);
  const seen = new Set();
  for (const i of r.issues) {
    const key = i.type + i.el;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log("   -", i.type, "|", i.el, JSON.stringify(Object.fromEntries(Object.entries(i).filter(([k]) => !["type", "el"].includes(k)))));
  }
}
console.log(total ? `\n문제 ${total}건` : "\n문제 없음");
