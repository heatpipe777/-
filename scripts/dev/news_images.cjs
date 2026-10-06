// 2026-10-06 뉴스 이미지 정리: 공공누리 4유형(상업적 이용·변경 금지) 사진 제거,
// 공공누리 1유형인 정책브리핑 기사 속 표를 앱에 넣어 '기사 속 자료'로 보여줘요
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 90));
  s = s.replace(a, b);
};

// 1) 그림 불러오기
rep(
  'import heroFavImg from "./assets/cat/hero-fav.webp";\n',
  'import heroFavImg from "./assets/cat/hero-fav.webp";\nimport newsFigGeoje from "./assets/news/fig-geoje.webp";\nimport newsFigOnnuri from "./assets/news/fig-onnuri.webp";\n'
);

// 2) 4유형 사진 제거 (n1 정책자금 공고 카드뉴스, n4 하반기 달라지는 것)
rep(
  `    // 기업마당 공고엔 사진이 없어서, 같은 공고를 소개한 정책브리핑 카드뉴스 대표 이미지를 써요
    image: "https://www.korea.kr/newsWeb/resources/attaches/2025.12/30/9e6f350d84bd21ffd32562f993267431.jpg",
    imageSource: "대한민국 정책브리핑",
    imagePosition: "center top", // 이미지 위쪽 제목 글자가 잘리지 않게
`,
  ""
);
rep(`    image: "https://www.korea.kr/newsWeb/resources/attaches/2026.07/01/633cc081876773dfc4caee297fdbc63e.jpg",\n`, "");

// 3) 기사 속 표 (공공누리 제1유형, 출처: 대한민국 정책브리핑)
rep(
  `      { label: "중소기업 1811-3655", tel: "1811-3655" },
    ],
    url: "https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=86&bcIdx=1071601",`,
  `      { label: "중소기업 1811-3655", tel: "1811-3655" },
    ],
    figure: { src: newsFigGeoje, caption: "소상공인·중소기업 긴급경영안정자금 우대 조건", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148973061" },
    url: "https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=86&bcIdx=1071601",`
);
rep(
  `    url: "https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=86&bcIdx=1071532",`,
  `    figure: { src: newsFigOnnuri, caption: "2027년 디지털 온누리 전통시장·지방소비 차등환급(안)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148972815" },
    url: "https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=86&bcIdx=1071532",`
);
rep(
  "// 정책 뉴스 — 정부 보도자료·공식 공고 위주 (마지막 확인: NEWS_UPDATED)\n",
  `// 정책 뉴스 — 정부 보도자료·공식 공고 위주 (마지막 확인: NEWS_UPDATED)
// 이미지 규칙: 공공누리 제1유형(출처표시)만 앱에 넣어 써요. 언론사 사진(연합뉴스 등)·공공누리 4유형(상업적 이용·변경 금지)은 쓰지 않아요.
`
);

// 4) 뉴스 상세: 기사 속 자료
rep(
  `      {/* 앱에 있는 관련 지원금으로 바로 */}`,
  `      {/* 기사 속 자료 — 공공누리 제1유형 표·그래픽 */}
      {news.figure && (
        <>
          <p className="text-[13px] font-bold mb-2" style={{ color: TEXT }}>기사 속 자료</p>
          <a href={news.figure.url} target="_blank" rel="noopener noreferrer" className="block rounded-[20px] p-3 mb-4" style={CARD}>
            <p className="text-[12px] font-semibold mb-2 px-0.5 break-keep" style={{ color: "#5E6577" }}>{news.figure.caption}</p>
            <img src={news.figure.src} alt={news.figure.caption} className="w-full h-auto rounded-xl" style={{ border: "1px solid #EEF0F6" }} />
            <p className="text-[10.5px] mt-2 px-0.5 flex items-center gap-1" style={{ color: MUTED }}>
              출처: 대한민국 정책브리핑 · 공공누리 제1유형(출처표시) <ExternalLink size={10} />
            </p>
          </a>
        </>
      )}

      {/* 앱에 있는 관련 지원금으로 바로 */}`
);

// 5) 개인정보처리방침(앱): 이제 뉴스 사진을 외부에서 불러오지 않아요
rep(
  "지도 표시를 위해 OpenStreetMap을, 뉴스 대표 사진 표시를 위해 각 기사 원문 사이트를 호출해요.",
  "지도 표시를 위해 OpenStreetMap을 호출해요."
);
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));

// 웹 개인정보처리방침
const p = "public/privacy.html";
let h = fs.readFileSync(p, "utf8");
const line = h.match(/[ \t]*<li>뉴스 대표 사진: 각 기사 원문 사이트\(언론사·정부 사이트\)<\/li>\r?\n/);
if (!line) throw new Error("privacy");
h = h.replace(line[0], "");
fs.writeFileSync(p, h);
console.log("ok");
