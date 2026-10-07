// 2026-10-07 브랜드명 변경: 사장줍줍 → 받아가게 (스토어 이름: 받아가게 - 소상공인 지원금·정책자금 알림)
const fs = require("fs");
const TITLE = "받아가게 - 소상공인 지원금·정책자금 알림";
// 순서 중요: 조사가 붙은 것부터 바꿔요 (받아가게는 받침 없음 → 를/가/는)
const PAIRS = [
  ["사장줍줍 - 소상공인 지원금·세금 일정 알림", TITLE],
  ["사장줍줍을", "받아가게를"],
  ["사장줍줍이", "받아가게가"],
  ["사장줍줍은", "받아가게는"],
  ["📌 줍줍한 지원금", "📌 찜한 지원금"],
  ["받을 혜택, 오늘도 줍줍!", "받을 혜택, 받아가게!"],
  ['<div class="name">사장<em>줍줍</em></div><div class="tag">사장님이 받을 혜택, 하나도 놓치지 말고 줍줍</div>', '<div class="name">받아<em>가게</em></div><div class="tag">우리 가게가 받을 지원금, 놓치지 말고 받아가게!</div>'],
  ['<h1>사장<span style="color:#FFD36B">줍줍</span></h1>', '<h1>받아<span style="color:#FFD36B">가게</span></h1>'],
  ["사장님이 받을 지원금·세금 신고일·마감일, 하나도 놓치지 말고 줍줍!", "우리 가게가 받을 지원금·정책자금, 마감 전에 알려드려요. 놓치지 말고 받아가게!"],
  ["사장줍줍_v1.0_1.aab", "받아가게_v1.0_1.aab"],
  ["사장줍줍", "받아가게"],
];
const files = [
  "src/App.jsx",
  "public/manifest.webmanifest",
  "public/privacy.html",
  "index.html",
  "capacitor.config.json",
  "android/app/src/main/res/values/strings.xml",
  "scripts/dev/store_make.cjs",
  process.argv[2], // 스토어 안내 파일
].filter(Boolean);
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  for (const [a, b] of PAIRS) s = s.split(a).join(b);
  if (s.includes("줍줍")) throw new Error(`${f}: 아직 '줍줍'이 남았어요`);
  if (s !== before) fs.writeFileSync(f, s);
  console.log(s !== before ? "바꿈" : "그대로", f);
}
