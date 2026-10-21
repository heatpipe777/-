// 정보 파일(data/content.json) 올리기 전 검사 — 하나라도 실패하면 올리지 않아요 (매달 예약 작업이 반드시 실행)
// 사용: node scripts/content-check.mjs [--no-links]
//  ① 형식 검사: 앱과 같은 규칙(src/contentRules.js) — 앱이 거부할 파일은 여기서 먼저 걸러요
//  ② 변화량 검사: 지난번 올린 파일(git HEAD)과 비교해 지원금·뉴스가 한꺼번에 많이 사라지거나 id가 바뀌면 실패
//  ③ 날짜 검사: 마감일이 이미 지난 지원금은 recurring이 아니면 경고, updated는 오늘보다 미래면 실패
//  ④ 링크 검사: 신청 주소·뉴스 원문이 실제로 열리는지(200~399), 공식 도메인인지
import fs from "node:fs";
import { execSync } from "node:child_process";
import { validateContent } from "../src/contentRules.js";

const FILE = "data/content.json";
const OFFICIAL = [/\.go\.kr$/, /\.or\.kr$/, /^www\.sbiz24\.kr$/, /^sbiz24\.kr$/, /\.re\.kr$/, /^www\.korea\.kr$/, /^www\.kodit\.co\.kr$/, /\.kibo\.or\.kr$/, /^www\.sbiz\.or\.kr$/];
const fails = [];
const warns = [];
const fail = (m) => fails.push(m);
const warn = (m) => warns.push(m);

let c;
try {
  c = JSON.parse(fs.readFileSync(FILE, "utf8"));
} catch (e) {
  console.error("❌ 정보 파일을 읽을 수 없어요(JSON 형식 오류):", e.message);
  process.exit(1);
}

// ① 형식
validateContent(c).forEach((e) => fail("형식 " + e));

// ② 변화량 (지난번 커밋과 비교)
let prev = null;
try {
  prev = JSON.parse(execSync(`git show HEAD:${FILE}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
} catch (e) {
  warn("지난 파일이 없어 변화량 검사는 건너뛰어요(첫 등록)");
}
if (prev) {
  const ids = new Set(c.programs.map((p) => p.id));
  const removed = prev.programs.filter((p) => !ids.has(p.id));
  if (removed.length > 3) fail(`지원금이 한 번에 ${removed.length}개 사라져요 (3개까지만): ${removed.map((p) => p.name).join(", ")}`);
  removed.forEach((p) => warn(`지원금 삭제: ${p.name} — 공고 종료·폐지를 공식 사이트에서 확인했는지`));
  const nids = new Set(c.news.map((n) => n.id));
  const nRemoved = prev.news.filter((n) => !nids.has(n.id));
  if (nRemoved.length > 5) fail(`뉴스가 한 번에 ${nRemoved.length}건 사라져요 (5건까지만)`);
  for (const p of c.programs) {
    const old = prev.programs.find((x) => x.id === p.id);
    if (old && old.name !== p.name && !p.name.includes(old.name.slice(0, 4))) warn(`같은 id ${p.id}인데 이름이 크게 바뀜: "${old.name}" → "${p.name}" (다른 사업이면 새 id로)`);
  }
  if (c.updated < prev.updated) fail(`updated(${c.updated})가 지난번(${prev.updated})보다 이전이에요`);
}

// ③ 날짜
const today = new Date().toISOString().slice(0, 10);
if (c.updated > today) fail(`updated(${c.updated})가 오늘(${today})보다 미래예요`);
for (const p of c.programs) if (!p.recurring && p.deadline < today) warn(`마감 지난 지원금(앱에선 '접수마감'으로 보여요): ${p.name} ${p.deadline}`);
if (!c.bok.meetings.some((d) => d >= today)) warn("앞으로 남은 금리 발표일(bok.meetings)이 없어요 — 다음 해 일정 확인");

// ④ 링크
const links = [];
for (const p of c.programs) if (p.applyUrl) links.push([`신청 주소 ${p.name}`, p.applyUrl, true]);
for (const n of c.news) links.push([`뉴스 원문 ${n.title.slice(0, 20)}`, n.url, false]);
for (const [what, url, mustOfficial] of links) {
  const host = new URL(url).hostname;
  if (mustOfficial && !OFFICIAL.some((r) => r.test(host))) fail(`${what}: 공식 기관 주소가 아니에요(${host})`);
}
if (!process.argv.includes("--no-links")) {
  const check = async ([what, url]) => {
    for (const method of ["HEAD", "GET"]) {
      try {
        const r = await fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "Mozilla/5.0 (Linux; Android 14) content-check" } });
        if (r.status < 400) return;
        if (method === "GET") fail(`${what}: 열리지 않아요 (${r.status}) ${url}`);
      } catch (e) {
        if (method === "GET") warn(`${what}: 연결 실패(${e.name}) — 사이트가 해외 접속을 막을 수 있어요, 직접 확인 ${url}`);
      }
    }
  };
  for (let i = 0; i < links.length; i += 6) await Promise.all(links.slice(i, i + 6).map(check));
}

console.log(`정보 파일: 지원금 ${c.programs.length}개 · 뉴스 ${c.news.length}건 · updated ${c.updated}`);
warns.forEach((w) => console.log("⚠️ ", w));
fails.forEach((f) => console.log("❌", f));
console.log(fails.length ? `\n검사 실패 ${fails.length}건 — 올리지 마세요` : "\n✅ 검사 통과 — 올려도 돼요");
process.exit(fails.length ? 1 : 0);
