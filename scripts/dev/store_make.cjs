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

const SHOTS = [
  ["01_home", "놓치기 쉬운 지원금,<br>한눈에 확인", "지금 신청할 수 있는 소상공인 지원금과 마감일", "#3D63DD", "#5B82F0"],
  ["09_diag_result", "1분 맞춤 진단으로<br>내게 맞는 지원금만", "지역·업종·상황 몇 가지만 답하면 골라드려요", "#E8890C", "#F5A833"],
  ["02_list", "분야·지역별로<br>빠르게 찾기", "대출·보증, 고정비, 인건비 등 7개 분야로 정리", "#3D63DD", "#5B82F0"],
  ["03_detail", "대상·금액·마감일까지<br>쉽게 정리", "신청 페이지로 바로 연결돼요", "#2C9F6B", "#3FBF86"],
  ["04_schedule", "세금 신고일과<br>내 일정도 함께", "부가세·종합소득세부터 월급날·임대료까지", "#2C9F6B", "#3FBF86"],
  ["08_alert", "마감 전에<br>미리 알려드려요", "알림 시점과 받을 시각을 내 맘대로", "#E5674D", "#F28A6F"],
  ["05_calc", "사장님 필수 계산기<br>9가지", "판매가·부가세·4대보험·주휴수당·퇴직금까지", "#2F86D6", "#4FA0EA"],
  ["12_news", "정부 발표 소식도<br>쉽게 요약", "중기부 최신 보도자료까지 바로 확인", "#7A46D6", "#9468E6"],
];

(async () => {
  // 1) 스크린샷 꾸미기
  for (let i = 0; i < SHOTS.length; i++) {
    const [raw, title, sub, c1, c2] = SHOTS[i];
    const img = "file:///" + path.join(RAW, raw + ".png").replace(/\\/g, "/");
    const html = `<!doctype html><meta charset="utf-8">${FONT}<style>${BASE}
body{width:1080px;height:1920px;background:linear-gradient(160deg,${c1},${c2});position:relative}
.cap{position:absolute;top:110px;left:0;right:0;text-align:center;color:#fff}
h1{font-size:76px;font-weight:800;line-height:1.28;letter-spacing:-2px}
p{margin-top:28px;font-size:36px;font-weight:500;opacity:.92;letter-spacing:-.5px}
.ph{position:absolute;left:50%;top:560px;transform:translateX(-50%);width:700px;height:1556px;border-radius:64px;background:#111;padding:16px;box-shadow:0 40px 90px rgba(0,0,0,.28)}
.ph img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:50px;display:block}
.deco{position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}
</style><div class="deco" style="width:620px;height:620px;right:-220px;top:-160px"></div><div class="deco" style="width:420px;height:420px;left:-180px;top:900px"></div>
<div class="cap"><h1>${title}</h1><p>${sub}</p></div><div class="ph"><img src="${img}"></div>`;
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
body{width:1024px;height:500px;background:linear-gradient(135deg,#3D63DD,#5B82F0);position:relative}
.l{position:absolute;left:70px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;color:#fff}
.ic{width:96px;height:96px;border-radius:24px;box-shadow:0 10px 26px rgba(0,0,0,.2)}
h1{margin-top:26px;font-size:62px;font-weight:800;letter-spacing:-2px;line-height:1.2}
p{margin-top:14px;font-size:26px;font-weight:500;line-height:1.5;opacity:.94;letter-spacing:-.5px}
.ph{position:absolute;width:260px;height:578px;border-radius:34px;background:#111;padding:9px;box-shadow:0 24px 60px rgba(0,0,0,.3)}
.ph img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:26px;display:block}
.deco{position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}
</style><div class="deco" style="width:520px;height:520px;right:-120px;top:-200px"></div>
<div class="l"><img class="ic" src="${icon}"><h1>받아<span style="color:#FFD36B">가게</span></h1><p>소상공인 지원금 마감일·세금 신고일<br>놓치지 않게 미리 알려드려요</p></div>
<div class="ph" style="right:250px;top:70px;transform:rotate(-4deg)"><img src="${sched}"></div>
<div class="ph" style="right:40px;top:40px;transform:rotate(4deg)"><img src="${home}"></div>`;
  const fpng = render("feature", fhtml, 1024, 500);
  await sharp(fpng).resize(1024, 500).flatten({ background: "#3D63DD" }).png().toFile(path.join(OUT, "대표그래픽_1024x500.png"));
  console.log("만듦 대표그래픽");
})();
