// 정보 파일(data/content.json) 검사 규칙 — 앱(src/content.js)과 검사 도구(scripts/content-check.mjs)가 함께 써요
// 앱 화면이 아는 값들 — 정보 파일이 이 밖의 값을 쓰면 검사에서 떨어져요
export const CONTENT_RULES = {
  schema: 1,
  regions: ["전국", "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"],
  categories: ["고정비", "에너지", "임차료", "경영", "디지털전환", "창업", "보증", "고용", "신용", "재기"],
  newsCategories: ["정책자금", "고정비", "인건비", "지역·상권", "세제·제도", "디지털"],
  figures: ["fig-geoje", "fig-onnuri"],
  minPrograms: 15,
  minNews: 6,
};

const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + "T00:00:00"));
const isDotDate = (s) => typeof s === "string" && /^\d{4}\.\d{2}\.\d{2}$/.test(s) && isDate(s.replace(/\./g, "-"));
const isText = (s, max = 400) => typeof s === "string" && s.trim().length > 0 && s.length <= max;
const isHttps = (s) => typeof s === "string" && /^https:\/\/[^\s]+$/.test(s);

// 정보 파일 검사 — 문제 목록을 돌려줘요 (빈 목록이면 통과). 앱과 검사 도구가 같은 함수를 써요
export function validateContent(c) {
  const R = CONTENT_RULES;
  const errs = [];
  const bad = (where, what) => errs.push(`${where}: ${what}`);
  if (!c || typeof c !== "object") return ["파일이 비어 있거나 형식이 아니에요"];
  if (c.schema !== R.schema) bad("schema", `${R.schema}이어야 해요 (지금 ${c.schema})`);
  if (!isDate(c.updated)) bad("updated", "YYYY-MM-DD 날짜여야 해요");
  if (!isDotDate(c.newsUpdated)) bad("newsUpdated", "YYYY.MM.DD 날짜여야 해요");

  const programs = Array.isArray(c.programs) ? c.programs : [];
  if (programs.length < R.minPrograms) bad("programs", `${R.minPrograms}개 이상이어야 해요 (지금 ${programs.length})`);
  const ids = new Set();
  programs.forEach((p, i) => {
    const w = `programs[${i}] ${p?.name || ""}`;
    if (!p || typeof p !== "object") return bad(w, "형식 오류");
    if (!(typeof p.id === "number" || typeof p.id === "string")) bad(w, "id 없음");
    if (ids.has(p.id)) bad(w, `id ${p.id} 중복`);
    ids.add(p.id);
    if (!isText(p.name, 80)) bad(w, "name(이름) 없음/너무 김");
    if (!R.regions.includes(p.region)) bad(w, `region "${p.region}"은 쓸 수 없어요`);
    if (p.regions && (!Array.isArray(p.regions) || p.regions.some((r) => !R.regions.includes(r)))) bad(w, "regions에 모르는 지역");
    if (!R.categories.includes(p.category)) bad(w, `category "${p.category}"는 쓸 수 없어요`);
    if (!p.detailed && !isText(p.target, 300)) bad(w, "target(지원대상) 없음");
    if (!isText(p.amountLabel, 80)) bad(w, "amountLabel(지원금액) 없음");
    if (!isDate(p.deadline)) bad(w, "deadline은 YYYY-MM-DD (상시는 2099-12-31)");
    if (p.recurring !== undefined && typeof p.recurring !== "boolean") bad(w, "recurring은 true/false");
    if (p.recurring && !isText(p.recurringNote, 120)) bad(w, "상시 자금은 recurringNote(접수 방식) 필요");
    if (p.verified !== undefined && p.verified !== true) bad(w, "verified는 true만 (확인 안 된 정보는 넣지 않아요)");
    if (!p.detailed && !isText(p.note, 400)) bad(w, "note(설명) 없음");
    if (p.applyUrl !== undefined && !isHttps(p.applyUrl)) bad(w, "applyUrl은 https 주소");
    if (typeof p.popularity !== "number") bad(w, "popularity 숫자 필요");
  });

  const news = Array.isArray(c.news) ? c.news : [];
  if (news.length < R.minNews) bad("news", `${R.minNews}개 이상이어야 해요 (지금 ${news.length})`);
  const nids = new Set();
  news.forEach((n, i) => {
    const w = `news[${i}] ${n?.title?.slice(0, 20) || ""}`;
    if (!n || typeof n !== "object") return bad(w, "형식 오류");
    if (!isText(n.id, 20)) bad(w, "id 없음");
    if (nids.has(n.id)) bad(w, `id ${n.id} 중복`);
    nids.add(n.id);
    if (!isText(n.title, 80)) bad(w, "title 없음/너무 김");
    if (!isText(n.source, 30)) bad(w, "source 없음");
    if (!isDotDate(n.date)) bad(w, "date는 YYYY.MM.DD");
    if (!R.newsCategories.includes(n.category)) bad(w, `category "${n.category}"는 쓸 수 없어요`);
    if (!isText(n.summary, 300)) bad(w, "summary 없음");
    if (!Array.isArray(n.bullets) || !n.bullets.length || n.bullets.some((b) => !isText(b, 200))) bad(w, "bullets(요점) 1개 이상");
    if (!isHttps(n.url)) bad(w, "url은 https 원문 주소");
    if (n.image !== undefined && n.image !== null && !isHttps(n.image)) bad(w, "image는 https 주소");
    if (n.image && !isText(n.imageSource, 40)) bad(w, "사진을 쓰면 imageSource(사진 출처) 필요");
    if (n.figure && (!R.figures.includes(n.figure.src) || !isText(n.figure.caption, 80) || !isHttps(n.figure.url))) bad(w, "figure 형식 오류");
    if (n.programId !== undefined && !ids.has(n.programId)) bad(w, `programId ${n.programId}인 지원금이 없어요`);
  });

  const b = c.bok || {};
  if (typeof b.rate?.rate !== "number" || b.rate.rate < 0 || b.rate.rate > 10) bad("bok.rate.rate", "0~10 사이 숫자");
  if (!isDotDate(b.rate?.date)) bad("bok.rate.date", "YYYY.MM.DD");
  if (typeof b.rate?.change !== "string" || !/^[+-]\d+(\.\d+)?$|^0$/.test(b.rate.change)) bad("bok.rate.change", '"+0.25"/"-0.25"/"0" 형식');
  if (!Array.isArray(b.history) || !b.history.length || b.history.some((h) => typeof h.rate !== "number" || !isText(h.date, 12) || !isText(h.note, 30))) bad("bok.history", "형식 오류");
  if (!Array.isArray(b.meetings) || b.meetings.some((d) => !isDate(d)) || [...b.meetings].sort().join() !== b.meetings.join()) bad("bok.meetings", "YYYY-MM-DD 날짜를 순서대로");

  const mw = Array.isArray(c.minWages) ? c.minWages : [];
  if (!mw.length || mw.some((m, i) => !Number.isInteger(m.year) || !Number.isInteger(m.wage) || m.wage < 9000 || m.wage > 20000 || (i && (m.year <= mw[i - 1].year || m.wage < mw[i - 1].wage)))) bad("minWages", "연도·시급이 올라가는 순서여야 해요");
  return errs;
}
