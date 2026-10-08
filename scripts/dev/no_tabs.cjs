// 2026-10-08 하단 탭 없애기: 홈 맨 위 오른쪽에 ♡즐겨찾기·👤MY, 모든 하위 화면은 뒤로가기 + 하단 광고로 통일
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 70));
  s = s.replace(a, b);
};

// 1) 하단 탭바 통째로 제거
const a = s.indexOf("      {/* Bottom tab bar */}");
const end = s.indexOf("    </Shell>\n  );\n}\n\n// 개인정보처리방침", a);
if (a < 0 || end < 0) throw new Error("tabbar");
s = s.slice(0, a) + s.slice(end);

// 2) 홈 맨 위: 받아가게 + ♡(개수) + 👤
rep(
  `      {homeScreen === "hub" ? (
        <>
      <div
        className="relative overflow-hidden mb-3 pl-5 pr-4 pt-5 pb-5"`,
  `      {homeScreen === "hub" ? (
        <>
      {/* 맨 위: 앱 이름 + 즐겨찾기·MY (하단 탭 대신) */}
      <div className="flex items-center gap-2 -mt-2 mb-3">
        <img src="/icons/icon-192.png" alt="" className="w-8 h-8 rounded-[10px]" />
        <p className="flex-1 text-[19px] font-black" style={{ color: TEXT, letterSpacing: "-0.04em" }}>
          받아<span style={{ color: "#F07A12" }}>가게</span>
        </p>
        <button onClick={() => setMainTab("favorites")} aria-label="즐겨찾기" className="relative w-10 h-10 rounded-full flex items-center justify-center active:bg-[#F3F5FA]">
          <Heart size={23} color={TEXT} strokeWidth={2} />
          {favCount > 0 && (
            <span className="absolute top-0.5 right-0 min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center tabular-nums" style={{ background: RED, boxShadow: "0 0 0 2px white" }}>
              {favCount > 99 ? "99+" : favCount}
            </span>
          )}
        </button>
        <button onClick={() => setMainTab("my")} aria-label="MY" className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[#F3F5FA]">
          <User size={23} color={TEXT} strokeWidth={2} />
        </button>
      </div>
      <div
        className="relative overflow-hidden mb-3 pl-5 pr-4 pt-5 pb-5"`
);

// 3) 광고: 홈 포함 모든 화면 (약관·개인정보처리방침만 제외)
rep('const NO_AD_VIEWS = ["home", "privacy", "terms"];', 'const NO_AD_VIEWS = ["privacy", "terms"];');
rep("// 배너를 넣지 않는 화면: 하단 탭이 있는 화면(home)과 약관·개인정보처리방침", "// 배너를 넣지 않는 화면: 약관·개인정보처리방침 (하단 탭은 없앴어요)");
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));

// 4) 점검·캡처 도구: '홈' 탭 누르기 단계 제거 (뒤로가기로 홈까지 와요)
for (const g of ["scripts/layout-audit.mjs", "scripts/dev/shots.mjs"]) {
  let t = fs.readFileSync(g, "utf8");
  t = t.replace(/\n\s*await evaluate\(`__audit\.click\("홈"\)`\);/, "").replace(/\n\s*await click\("홈"\);/, "");
  fs.writeFileSync(g, t);
}
console.log("ok");
