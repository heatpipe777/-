// 2026-10-07 광고(AdMob) 도입에 맞춰 개인정보처리방침(웹·앱) 갱신
const fs = require("fs");
const edit = (f, pairs) => {
  let s = fs.readFileSync(f, "utf8");
  const crlf = s.includes("\r\n");
  s = s.replace(/\r\n/g, "\n");
  for (const [a, b] of pairs) {
    if (s.split(a).length !== 2) throw new Error(`${f}: ${a.slice(0, 60)}`);
    s = s.replace(a, b);
  }
  fs.writeFileSync(f, crlf ? s.replace(/\n/g, "\r\n") : s);
};

const ADS_WEB = `<h2>5. 광고</h2>
<p>앱은 무료로 운영하기 위해 Google AdMob 광고를 보여줍니다. 광고를 보여주는 과정에서 Google이 아래 정보를 수집·이용할 수 있습니다.</p>
<ul>
  <li>광고 식별자(Android 광고 ID), 기기 정보, IP 주소(대략적인 위치), 광고 노출·클릭 기록</li>
  <li>이용 목적: 광고 표시, 광고 성과 측정, 부정 클릭 방지</li>
</ul>
<p>회사는 이 정보를 직접 받거나 저장하지 않습니다. 맞춤형 광고를 원하지 않으면 휴대폰 <strong>설정 → Google → 광고</strong>에서 광고 ID를 삭제하거나 재설정할 수 있습니다. Google의 정보 처리 방식은 <a href="https://policies.google.com/technologies/partner-sites?hl=ko">Google 파트너 사이트 정책</a>에서 확인할 수 있습니다.</p>

<h2>6. 제3자 제공 및 위탁</h2>
<p>회사는 이용자의 개인정보를 수집하지 않으므로, 제3자에게 제공하거나 처리를 위탁하지 않습니다. 단, 위 광고 항목처럼 Google이 광고를 위해 직접 수집하는 정보는 Google의 개인정보처리방침이 적용됩니다.</p>`;

edit("public/privacy.html", [
  [
    "<p>앱은 <strong>이름, 전화번호, 이메일, 위치 등 개인정보를 수집하지 않으며</strong>, 회원가입·로그인 기능도 없습니다. 회사는 별도의 서버에 이용자 정보를 저장하지 않습니다.</p>",
    "<p>앱은 <strong>이름, 전화번호, 이메일 등 개인정보를 수집하지 않으며</strong>, 회원가입·로그인 기능도 없습니다. 회사는 별도의 서버에 이용자 정보를 저장하지 않습니다. (광고 표시를 위해 Google이 수집하는 정보는 아래 5번을 참고해 주세요.)</p>",
  ],
  [
    "  <li><strong>인터넷</strong>: 환율 정보와 지도를 불러오고, 공식 기관 사이트를 열기 위해 사용합니다.</li>",
    "  <li><strong>인터넷</strong>: 환율·뉴스·보도자료·지도와 광고를 불러오고, 공식 기관 사이트를 열기 위해 사용합니다.</li>\n  <li><strong>광고 ID</strong>: 광고 표시와 성과 측정을 위해 Google AdMob이 사용합니다.</li>",
  ],
  ["  <li>최신 보도자료 목록: 중소벤처기업부 RSS (mss.go.kr)</li>", "  <li>최신 보도자료 목록: 중소벤처기업부 RSS (mss.go.kr)</li>\n  <li>광고: Google AdMob</li>"],
  [
    "<h2>5. 제3자 제공 및 위탁</h2>\n<p>회사는 이용자의 개인정보를 수집하지 않으므로, 제3자에게 제공하거나 처리를 위탁하지 않습니다.</p>",
    ADS_WEB,
  ],
  ["<h2>6. 아동의 개인정보</h2>", "<h2>7. 아동의 개인정보</h2>"],
  ["<h2>7. 안내</h2>", "<h2>8. 안내</h2>"],
  ["<h2>8. 문의처</h2>", "<h2>9. 문의처</h2>"],
  ["시행일: 2026년 10월 6일", "시행일: 2026년 10월 7일"],
]);

// 앱 안 개인정보처리방침
const s = fs.readFileSync("src/App.jsx", "utf8");
const i = s.indexOf('const EFFECTIVE_DATE = "2026-10-06";');
if (i < 0) throw new Error("EFFECTIVE_DATE");
edit("src/App.jsx", [
  ['  const EFFECTIVE_DATE = "2026-10-06";\n  const sections = [', '  const EFFECTIVE_DATE = "2026-10-07";\n  const sections = ['],
  [
    `      title: "4. 개인정보의 제3자 제공",
      body: "이 앱은 어떤 개인정보도 수집하지 않으므로, 제3자에게 제공하거나 판매하지 않아요.",
    },`,
    `      title: "4. 광고",
      body:
        "무료로 운영하기 위해 Google AdMob 광고를 보여줘요. 이때 Google이 광고 ID, 기기 정보, IP 주소(대략적인 위치), 광고 노출·클릭 기록을 광고 표시·성과 측정·부정 클릭 방지에 이용할 수 있어요. 운영자는 이 정보를 받거나 저장하지 않아요. 휴대폰 설정 → Google → 광고에서 광고 ID를 삭제하거나 재설정할 수 있어요.",
    },
    {
      title: "5. 개인정보의 제3자 제공",
      body: "이 앱은 개인정보를 수집하지 않으므로, 제3자에게 제공하거나 판매하지 않아요. 광고를 위해 Google이 직접 수집하는 정보에는 Google의 개인정보처리방침이 적용돼요.",
    },`,
  ],
  [`      title: "5. 이용자의 권리",`, `      title: "6. 이용자의 권리",`],
]);
console.log("ok");
