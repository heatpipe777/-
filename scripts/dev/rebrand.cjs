// 2026-10-06 브랜드명 변경: 지원금알리미 → 사장줍줍, 시작 인트로 화면 추가
const fs = require("fs");
const edit = (f, pairs, crlf) => {
  let s = fs.readFileSync(f, "utf8");
  const wasCrlf = s.includes("\r\n");
  s = s.replace(/\r\n/g, "\n");
  for (const [a, b] of pairs) {
    if (!s.includes(a)) throw new Error(`${f}: 못 찾음 ${a.slice(0, 50)}`);
    s = s.split(a).join(b);
  }
  fs.writeFileSync(f, wasCrlf || crlf ? s.replace(/\n/g, "\r\n") : s);
};

// 앱 안 문구
edit("src/App.jsx", [
  ["`[지원금알리미] ${p.name}`", "`[사장줍줍] ${p.name}`"],
  ['"자세한 조건은 지원금알리미에서 확인하세요 👇"', '"자세한 조건은 사장줍줍에서 확인하세요 👇"'],
  ["`[지원금알리미 계산기] ${title}`", "`[사장줍줍 계산기] ${title}`"],
  ["애플리케이션 → 지원금알리미 → 알림", "애플리케이션 → 사장줍줍 → 알림"],
  ['"알림은 지원금알리미 앱(안드로이드)에서만 받을 수 있어요."', '"알림은 사장줍줍 앱(안드로이드)에서만 받을 수 있어요."'],
  ["            소상공인 정책자금 알리미\n          </h1>", "            받을 혜택, 오늘도 줍줍!\n          </h1>"],
  ['>지원금알리미 v1.0</p>', '>사장줍줍 v1.0</p>'],
  ["이 약관은 소상공인 정책자금 알리미(이하 '이 앱')", "이 약관은 사장줍줍(이하 '이 앱')"],
]);

// 안드로이드 앱 이름 (아이콘 아래)
edit("android/app/src/main/res/values/strings.xml", [
  ['<string name="app_name">지원금알리미</string>', '<string name="app_name">사장줍줍</string>'],
  ['<string name="title_activity_main">지원금알리미</string>', '<string name="title_activity_main">사장줍줍</string>'],
]);
edit("capacitor.config.json", [['"appName": "지원금알리미"', '"appName": "사장줍줍"']]);

// 웹
edit("public/manifest.webmanifest", [
  ['"name": "소상공인 지원금 알리미"', '"name": "사장줍줍 - 소상공인 지원금·세금 일정 알림"'],
  ['"short_name": "지원금알리미"', '"short_name": "사장줍줍"'],
  ['"background_color": "#F7F8FA"', '"background_color": "#FFF7E8"'],
]);
edit("public/privacy.html", [
  ["<title>개인정보처리방침 - 지원금알리미</title>", "<title>개인정보처리방침 - 사장줍줍</title>"],
  ["<h1>지원금알리미 개인정보처리방침</h1>", "<h1>사장줍줍 개인정보처리방침</h1>"],
  ['"지원금알리미" 앱(이하 "앱")', '"사장줍줍" 앱(이하 "앱")'],
  ["<p>지원금알리미는 정부·공공기관의 공식 앱이 아닙니다.", "<p>사장줍줍은 정부·공공기관의 공식 앱이 아닙니다."],
]);

// 시작 인트로: 휴대폰 시작 화면(크림색+아이콘) 바로 뒤에 같은 자리에서 이름·소개가 나타나요
edit("index.html", [
  ["    <title>소상공인 정책자금 알리미</title>", "    <title>사장줍줍 - 소상공인 지원금·세금 일정 알림</title>\n    <meta name=\"theme-color\" content=\"#FFF7E8\" />"],
  [
    '    <div id="root"></div>',
    `    <!-- 시작 인트로 (앱이 준비되면 main.jsx가 서서히 지워요) -->
    <style>
      #intro{position:fixed;inset:0;z-index:2147483647;background:#FFF7E8;font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif;transition:opacity .35s ease}
      #intro.hide{opacity:0;pointer-events:none}
      #intro .glow{position:absolute;left:50%;top:50%;width:420px;height:420px;margin:-210px 0 0 -210px;border-radius:50%;background:radial-gradient(circle,rgba(255,213,120,.45),rgba(255,213,120,0) 65%)}
      #intro img{position:absolute;left:50%;top:50%;width:160px;height:160px;margin:-80px 0 0 -80px;border-radius:50%;box-shadow:0 14px 30px rgba(214,140,20,.22)}
      #intro .txt{position:absolute;left:0;right:0;top:calc(50% + 110px);text-align:center;animation:introUp .45s ease .15s both}
      #intro .name{font-size:44px;font-weight:900;letter-spacing:-2px;line-height:1.2;color:#3B2A12}
      #intro .name em{font-style:normal;color:#F07A12}
      #intro .tag{margin-top:10px;font-size:15px;font-weight:600;color:#8A6A3A;letter-spacing:-.3px;padding:0 24px}
      #intro .foot{position:absolute;left:0;right:0;bottom:48px;text-align:center;font-size:12px;color:#B49A72}
      @keyframes introUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    </style>
    <div id="intro" aria-hidden="true">
      <div class="glow"></div>
      <img src="/icons/icon-512.png" alt="" />
      <div class="txt"><div class="name">사장<em>줍줍</em></div><div class="tag">사장님이 받을 혜택, 하나도 놓치지 말고 줍줍</div></div>
      <div class="foot">소상공인 지원금·세금 일정 알림</div>
    </div>
    <div id="root"></div>`,
  ],
]);
edit("src/main.jsx", [
  [
    "ReactDOM.createRoot(document.getElementById(\"root\")).render(",
    `// 시작 인트로: 최소 1.1초 보여준 뒤 서서히 사라져요 (한 번만, 반복 효과 없음)
const hideIntro = () => {
  const el = document.getElementById("intro");
  if (!el) return;
  const wait = Math.max(0, 1100 - performance.now());
  setTimeout(() => {
    el.classList.add("hide");
    setTimeout(() => el.remove(), 400);
  }, wait);
};

ReactDOM.createRoot(document.getElementById("root")).render(`,
  ],
  ["  </React.StrictMode>\n);", "  </React.StrictMode>\n);\nrequestAnimationFrame(() => requestAnimationFrame(hideIntro));"],
]);

// 스토어 대표 그래픽
edit("scripts/dev/store_make.cjs", [["<h1>지원금알리미</h1>", "<h1>사장<span style=\"color:#FFD36B\">줍줍</span></h1>"]]);
console.log("ok");
