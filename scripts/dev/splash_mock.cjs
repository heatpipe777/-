// 브랜드명 후보별 시작 화면 시안 (Edge 헤드리스로 1080x2400 렌더)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const ICON = "file:///" + path.resolve("scripts/dev/mockups/app-icon-square.png").replace(/\\/g, "/");
const FONT = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">`;

const render = (name, html) => {
  const f = path.join(OUT, name + ".html");
  fs.writeFileSync(f, html);
  execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1080,2400", "--virtual-time-budget=8000", `--screenshot=${path.join(OUT, name + ".png")}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
};

const page = ({ a, b, tagline, accent, bg }) => `<!doctype html><meta charset="utf-8">${FONT}<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:2400px;font-family:Pretendard,'Malgun Gothic',sans-serif;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden}
.glow{position:absolute;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(255,213,120,.45),rgba(255,213,120,0) 65%);top:520px}
.icon{position:relative;width:360px;height:360px;border-radius:92px;box-shadow:0 30px 60px rgba(214,140,20,.25)}
.name{position:relative;margin-top:84px;font-size:132px;font-weight:900;letter-spacing:-6px;line-height:1.1;color:#3B2A12}
.name em{font-style:normal;background:linear-gradient(135deg,${accent[0]},${accent[1]});-webkit-background-clip:text;color:transparent}
.tag{position:relative;margin-top:34px;font-size:44px;font-weight:600;color:#8A6A3A;letter-spacing:-1px}
.foot{position:absolute;bottom:150px;font-size:32px;font-weight:500;color:#B49A72;letter-spacing:-.5px}
</style><div class="glow"></div><img class="icon" src="${ICON}"><div class="name">${a}<em>${b}</em></div><div class="tag">${tagline}</div><div class="foot">소상공인 지원금·세금 일정 알림</div>`;

const MOCKS = [
  ["A_사장챙김", { a: "사장", b: "챙김", tagline: "받을 지원금, 놓칠 마감일 대신 챙겨드려요", accent: ["#F59E0B", "#EA580C"], bg: "#FFF7E8" }],
  ["B_사장줍줍", { a: "사장", b: "줍줍", tagline: "사장님이 받을 혜택, 하나도 놓치지 말고 줍줍", accent: ["#F59E0B", "#EA580C"], bg: "#FFF7E8" }],
];
for (const [n, o] of MOCKS) render(n, page(o));
console.log("ok");
