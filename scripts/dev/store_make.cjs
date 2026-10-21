// 스토어 이미지 만들기: 스크린샷 8장(1080x1920), 대표 그래픽(1024x500), 아이콘(512x512)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require(path.resolve("node_modules/sharp"));

const SP = process.argv[2];
const OUT = process.argv[3];
const RAW = path.join(SP, "store_raw");
const HTML = path.join(SP, "store_html");
fs.mkdirSync(HTML, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const render = (name, html, w, h) => {
  const f = path.join(HTML, name + ".html");
  fs.writeFileSync(f, html);
  const png = path.join(HTML, name + ".png");
  execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${w},${h}`, "--virtual-time-budget=8000", `--screenshot=${png}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
  return png;
};

const FONT = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">`;
const BASE = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Pretendard,'Malgun Gothic',sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}`;

// 스토어 스크린샷 (2026-10-20 개편): 밝은 파스텔 배경 + 굵은 제목(핵심 단어 형광펜) + 배지 + 크게 넣은 실제 화면(아래로 살짝 잘림)
// + 장마다 다른 가게 캐릭터 + 스티커 한 개. 화면 캡처는 실제 앱 그대로(Play 정책), 꾸밈만 바깥에.
// [캡처, 배지, 제목(<em>강조</em>), 설명, 캐릭터, 스티커, 배경1, 배경2, 강조색]
const SHOTS = [
  ["01_home", "소상공인 필수 앱", "받을 지원금,<br><em>받아가게!</em>", "지원금·세금 일정·계산기를 한 앱에서", "coin", "💰 신청 가능 25건", "#EAF1FF", "#D6E4FF", "#3D63DD"],
  ["05_calc", "무료 · 30초", "사장님 필수<br><em>계산기 9가지</em>", "판매가·부가세·4대보험·주휴수당·퇴직금", "phone", "📤 계산 결과 바로 공유", "#E8F6FF", "#CDEBFF", "#2F86D6"],
  ["09_diag_result", "1분 맞춤 진단", "<em>우리 가게</em>에 맞는<br>지원금만 쏙!", "지역·업종·매출 몇 가지만 답하면 끝", "cheer", "✨ 딱 맞는 지원금 5건", "#FFF6E0", "#FFE7B3", "#E8890C"],
  ["02_list", "전국 + 17개 시·도", "분야·지역별로<br><em>한눈에</em> 찾기", "대출·보증, 고정비, 인건비, 창업까지", "search", "🔎 마감 임박 순 정렬", "#F1EDFF", "#E1D8FF", "#7A46D6"],
  ["04_schedule", "세금 · 월급날 · 임대료", "세금 신고일과<br><em>내 일정</em>까지", "놓치기 쉬운 날짜를 한 화면에", "calendar", "📅 부가세 신고 D-5", "#E9F8F0", "#CDEFDD", "#2C9F6B"],
  // 04b: 일정 화면을 목록까지 내려 찍은 것 (shots.mjs가 아니라 직접 스크롤 캡처 — 예시 일정의 생일·결혼기념일이 보이게)
  ["04b_family", "생일 · 기념일 · 제사", "가족 행사까지<br><em>미리 알림</em>", "음력 제사도 해마다 자동으로 챙겨드려요", "cheer", "🎂 엄마 생일 D-7 알림", "#FFF0F5", "#FFD9E6", "#D6478E"],
  ["07_center", "전화 · 지도 바로 연결", "가까운 <em>지역센터</em><br>바로 찾기", "소상공인시장진흥공단 전국 센터 89곳", "hello", "📍 내 지역 센터 한눈에", "#FFEFF5", "#FFD9E7", "#D6478E"],
  ["03_detail", "대상 · 금액 · 마감일", "어려운 공고를<br><em>쉽게</em> 정리", "신청 페이지로 바로 연결돼요", "search", "✅ 신청 조건 한눈에", "#EAF1FF", "#D6E4FF", "#3D63DD"],
  ["08_alert", "마감 · 세금 · 금리 알림", "마감 전에<br><em>미리</em> 알려드려요", "알림 시점과 시각을 내 맘대로", "bell", "🔔 마감 3일 전 알림", "#FFF9E3", "#FFEAAE", "#D99A00"],
];
const MASCOT = (n) => "file:///" + path.resolve(`src/assets/mascot/${n}.webp`).replace(/\\/g, "/");

(async () => {
  // 1) 스크린샷 꾸미기
  for (let i = 0; i < SHOTS.length; i++) {
    const [raw, badge, title, sub, mascot, sticker, c1, c2, accent] = SHOTS[i];
    const img = "file:///" + path.join(RAW, raw + ".png").replace(/\\/g, "/");
    const html = `<!doctype html><meta charset="utf-8">${FONT}<style>${BASE}
body{width:1080px;height:1920px;background:linear-gradient(170deg,${c1} 0%,${c2} 100%);position:relative}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.55);filter:blur(2px)}
.cap{position:absolute;top:120px;left:84px;right:330px;color:#16204A}
.badge{display:inline-block;padding:14px 30px;border-radius:999px;background:#fff;color:${accent};font-size:32px;font-weight:800;letter-spacing:-.5px;box-shadow:0 8px 20px rgba(30,50,120,.10)}
h1{margin-top:34px;font-size:88px;font-weight:900;line-height:1.22;letter-spacing:-3px}
h1 em{font-style:normal;color:${accent};background:linear-gradient(transparent 62%,rgba(255,214,90,.75) 62%);padding:0 6px;border-radius:6px}
p{margin-top:26px;font-size:36px;font-weight:600;color:#4A5578;letter-spacing:-.6px}
.mas{position:absolute;right:46px;top:250px;width:330px;height:330px;object-fit:contain;filter:drop-shadow(0 22px 26px rgba(30,40,90,.22));z-index:3}
.ph{position:absolute;left:50%;top:700px;transform:translateX(-50%);width:780px;height:1700px;border-radius:72px;background:#1B1D24;padding:18px;box-shadow:0 50px 110px rgba(30,40,90,.30)}
.ph img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:56px;display:block}
.stk{position:absolute;left:46px;top:1180px;z-index:4;padding:24px 34px;border-radius:28px;background:#fff;font-size:38px;font-weight:800;color:#16204A;letter-spacing:-.8px;box-shadow:0 18px 40px rgba(30,40,90,.22);transform:rotate(-4deg);border:3px solid ${accent}22}
</style>
<div class="blob" style="width:560px;height:560px;right:-200px;top:-180px"></div><div class="blob" style="width:380px;height:380px;left:-170px;top:820px;opacity:.6"></div>
<div class="cap"><span class="badge">${badge}</span><h1>${title}</h1><p>${sub}</p></div>
<img class="mas" src="${MASCOT(mascot)}"><div class="ph"><img src="${img}"></div><div class="stk">${sticker}</div>`;
    const png = render(raw, html, 1080, 1920);
    const name = `스크린샷_${i + 1}.png`;
    await sharp(png).resize(1080, 1920).flatten({ background: "#ffffff" }).png().toFile(path.join(OUT, name));
    console.log("만듦", name);
  }

  // 2) 아이콘 512 (Play가 모서리를 직접 둥글게 해요 → 꽉 찬 정사각형, 32비트 PNG)
  // 앱 아이콘(꽉 찬 정사각형)은 app_icon.cjs가 만든 scripts/dev/mockups/app-icon-square.png를 써요
  await sharp("scripts/dev/mockups/app-icon-square.png").resize(512, 512).ensureAlpha().png().toFile(path.join(OUT, "앱아이콘_512.png"));
  console.log("만듦 앱아이콘_512.png");

  // 3) 대표 그래픽 1024x500
  const icon = "file:///" + path.join(OUT, "앱아이콘_512.png").replace(/\\/g, "/");
  const home = "file:///" + path.join(RAW, "01_home.png").replace(/\\/g, "/");
  const sched = "file:///" + path.join(RAW, "04_schedule.png").replace(/\\/g, "/");
  const fhtml = `<!doctype html><meta charset="utf-8">${FONT}<style>${BASE}
body{width:1024px;height:500px;background:linear-gradient(160deg,#EAF1FF 0%,#D6E4FF 100%);position:relative}
.blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.6)}
.l{position:absolute;left:64px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;color:#16204A}
.row{display:flex;align-items:center;gap:18px}.ic{width:84px;height:84px;border-radius:22px;box-shadow:0 10px 24px rgba(30,50,120,.18)}
h1{font-size:64px;font-weight:900;letter-spacing:-2.5px}h1 em{font-style:normal;color:#F07A12}
p{margin-top:22px;font-size:28px;font-weight:700;line-height:1.45;letter-spacing:-.6px;color:#3A4670}p b{color:#3D63DD;background:linear-gradient(transparent 60%,rgba(255,214,90,.75) 60%)}
.ph{position:absolute;width:250px;height:556px;border-radius:34px;background:#1B1D24;padding:9px;box-shadow:0 24px 60px rgba(30,40,90,.3)}
.ph img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:26px;display:block}
.mas{position:absolute;right:272px;bottom:-6px;width:230px;height:230px;object-fit:contain;filter:drop-shadow(0 16px 20px rgba(30,40,90,.25));z-index:3}
</style><div class="blob" style="width:460px;height:460px;right:-120px;top:-180px"></div>
<div class="l"><div class="row"><img class="ic" src="${icon}"><h1>받아<em>가게</em></h1></div><p>소상공인 <b>지원금 마감일</b>·<b>세금 신고일</b><br>놓치지 않게 미리 알려드려요</p></div>
<div class="ph" style="right:52px;top:46px;transform:rotate(4deg)"><img src="${home}"></div>
<img class="mas" src="${MASCOT("coin")}">`;
  const fpng = render("feature", fhtml, 1024, 500);
  await sharp(fpng).resize(1024, 500).flatten({ background: "#3D63DD" }).png().toFile(path.join(OUT, "대표그래픽_1024x500.png"));
  console.log("만듦 대표그래픽");
})();
