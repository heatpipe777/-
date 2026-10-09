// Google Play 업로드 도구 (Play Developer API, 서비스 계정 열쇠 사용)
// 열쇠는 저장소 밖: 문서/GoldenArchiveW_Play업로드키/play-upload-key.json (PLAY_KEY로 바꿀 수 있음)
//
//   node scripts/dev/play.mjs status                         … 트랙별 현재 버전 보기 (읽기만)
//   node scripts/dev/play.mjs upload <aab> <track> "<출시노트>" [--draft]
//        track: internal | alpha | beta | production
//        --draft: 올리기만 하고 출시는 Play Console에서 직접 (초안)
//   PLAY_PACKAGE=com.xxx 로 다른 앱에도 사용
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const KEY = process.env.PLAY_KEY || path.join(os.homedir(), "Documents", "GoldenArchiveW_Play업로드키", "play-upload-key.json");
const PKG = process.env.PLAY_PACKAGE || "com.goldenarchivew.sosanggongin";
const API = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PKG}`;

const b64 = (x) => Buffer.from(x).toString("base64url");
async function token() {
  const k = JSON.parse(fs.readFileSync(KEY, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const head = b64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = b64(JSON.stringify({ iss: k.client_email, scope: "https://www.googleapis.com/auth/androidpublisher", aud: k.token_uri, iat: now, exp: now + 3600 }));
  const sig = crypto.createSign("RSA-SHA256").update(`${head}.${body}`).sign(k.private_key, "base64url");
  const r = await fetch(k.token_uri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${head}.${body}.${sig}` }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("열쇠 인증 실패: " + JSON.stringify(j));
  return j.access_token;
}

let T;
async function call(method, url, body, headers = {}) {
  const r = await fetch(url, { method, headers: { authorization: `Bearer ${T}`, ...headers }, body });
  const text = await r.text();
  if (!r.ok) throw new Error(`${method} ${url.replace(API, "")} → ${r.status}\n${text}`);
  return text ? JSON.parse(text) : {};
}
const json = (o) => [JSON.stringify(o), { "content-type": "application/json" }];

const [cmd, ...args] = process.argv.slice(2);
T = await token();
const edit = await call("POST", `${API}/edits`);
const E = `${API}/edits/${edit.id}`;
try {
  if (cmd === "status") {
    const { tracks = [] } = await call("GET", `${E}/tracks`);
    for (const t of tracks) {
      for (const r of t.releases || []) console.log(`${t.track.padEnd(11)} ${r.status.padEnd(10)} 버전코드 ${(r.versionCodes || []).join(",")} ${r.name || ""}`);
    }
    await call("DELETE", E); // 읽기만 했으니 편집 취소
  } else if (cmd === "upload") {
    const [aab, track, notes] = args;
    const draft = args.includes("--draft");
    if (!aab || !track) throw new Error("사용법: upload <aab> <track> \"<출시노트>\" [--draft]");
    const up = await call(
      "POST",
      `https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/${PKG}/edits/${edit.id}/bundles?uploadType=media`,
      fs.readFileSync(aab),
      { "content-type": "application/octet-stream" }
    );
    console.log("업로드 완료: 버전코드", up.versionCode);
    const release = { versionCodes: [String(up.versionCode)], status: draft ? "draft" : "completed" };
    if (notes) release.releaseNotes = [{ language: "ko-KR", text: notes }];
    await call("PUT", `${E}/tracks/${track}`, ...json({ track, releases: [release] }));
    await call("POST", `${E}:commit`);
    console.log(`${track} 트랙에 ${draft ? "초안으로 저장" : "출시 제출"} 완료`);
  } else {
    await call("DELETE", E);
    console.log("명령: status | upload");
  }
} catch (e) {
  await call("DELETE", E).catch(() => {});
  throw e;
}
