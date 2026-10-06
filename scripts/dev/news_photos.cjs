// 2026-10-06 사용자 결정: 뉴스는 실제 기사 대표 사진을 써요 (사진 아래 출처 표시, 원문 링크)
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 90));
  s = s.replace(a, b);
};
const photo = (id, lines) => {
  const key = `    id: "${id}",\n`;
  rep(key, key + lines.map((l) => `    ${l}\n`).join(""));
};
photo("m1", [
  'image: "https://www.korea.kr/newsWeb/resources/attaches/2026.10/06/9f448bb0920216f8f184af88a6bed7f1.jpg",',
  'imageSource: "대한민국 정책브리핑",',
]);
photo("m2", [
  'image: "https://www.korea.kr/newsWeb/resources/attaches/2026.09/30/b228f5ad0c0c543fc2ea3fc2f0be420c.jpg",',
  'imageSource: "대한민국 정책브리핑",',
]);
photo("m3", ['image: "https://cdn.jungbunews.com/news/photo/202609/2740073_2742546_3518.jpg",', 'imageSource: "중부뉴스통신",']);
photo("m4", ['image: "https://news.nateimg.co.kr/orgImg/yt/2026/09/22/PCM20230320000254990_P2.jpg",', 'imageSource: "연합뉴스",']);
photo("n5", ['image: "https://www.hksisaeconomy.com/data/photos/portnews/202609/20260906201504-71428.jpg",']);
photo("n4", ['image: "https://www.korea.kr/newsWeb/resources/attaches/2026.07/01/633cc081876773dfc4caee297fdbc63e.jpg",', 'imageSource: "대한민국 정책브리핑",']);
photo("n3", [
  'image: "https://www.korea.kr/newsWeb/resources/attaches/2026.01/27/be9b8c5b6d3faf516e9c08f44bb0db03.jpg",',
  'imageSource: "대한민국 정책브리핑",',
]);
photo("n1", [
  "// 기업마당 공고엔 사진이 없어서, 같은 공고를 소개한 정책브리핑 카드뉴스 대표 이미지를 써요",
  'image: "https://www.korea.kr/newsWeb/resources/attaches/2025.12/30/9e6f350d84bd21ffd32562f993267431.jpg",',
  'imageSource: "대한민국 정책브리핑",',
  'imagePosition: "center top", // 이미지 위쪽 제목 글자가 잘리지 않게',
]);
rep(
  "// 이미지 규칙: 공공누리 제1유형(출처표시)만 앱에 넣어 써요. 언론사 사진(연합뉴스 등)·공공누리 4유형(상업적 이용·변경 금지)은 쓰지 않아요.\n",
  "// 이미지: 기사 원문의 대표 사진(og:image)을 그대로 불러오고, 화면에 사진 출처를 표시해요. 못 불러오면 분야 그림으로 대신해요.\n"
);
// 개인정보처리방침(앱): 뉴스 사진을 다시 외부에서 불러와요
rep(
  "지도 표시를 위해 OpenStreetMap을 호출해요.",
  "지도 표시를 위해 OpenStreetMap을, 뉴스 대표 사진 표시를 위해 각 기사 원문 사이트를 호출해요."
);
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));
const p = "public/privacy.html";
let h = fs.readFileSync(p, "utf8");
const anchor = h.match(/([ \t]*)<li>정부·공공기관 등 외부 사이트 링크/);
if (!anchor) throw new Error("privacy");
if (!h.includes("뉴스 대표 사진")) h = h.replace(anchor[0], `${anchor[1]}<li>뉴스 대표 사진: 각 기사 원문 사이트(언론사·정부 사이트)</li>\n${anchor[0]}`);
fs.writeFileSync(p, h);
console.log("ok");
