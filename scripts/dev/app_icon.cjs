// 앱 아이콘 만들기 (사용자 제공 3D 아이콘: 손 위의 동전)
// 원본의 흰 테두리·둥근 모서리를 없애 꽉 찬 정사각형으로 만든 뒤
// 안드로이드 런처(적응형·일반·둥근), 웹(PWA), 스토어 512 아이콘을 모두 만들어요.
const fs = require("fs");
const path = require("path");
const sharp = require(path.resolve("node_modules/sharp"));
const SRC = process.argv[2] || "scripts/dev/mockups/app-icon-3d.png";
const STORE = process.argv[3]; // 스토어 폴더(선택)
const RES = "android/app/src/main/res";
const BG = "#FFEFD0"; // 적응형 아이콘 배경색 (원본 배경 크림색)

(async () => {
  const meta = await sharp(SRC).metadata();
  // 1) 흰 바깥 여백 잘라내기 (원본은 약 20px 흰 여백 + 둥근 모서리)
  const inset = Math.round(meta.width * 0.035);
  const S = meta.width - inset * 2;
  const inner = await sharp(SRC).extract({ left: inset, top: inset, width: S, height: S }).png().toBuffer();
  // 2) 둥근 모서리 밖(흰색)을 원본 안쪽 색을 흐리게 깐 배경으로 채워요
  const bg = await sharp(inner).extract({ left: Math.round(S * 0.12), top: Math.round(S * 0.12), width: Math.round(S * 0.76), height: Math.round(S * 0.76) }).resize(S, S).blur(60).png().toBuffer();
  const r = Math.round(S * 0.24);
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect x="0" y="0" width="${S}" height="${S}" rx="${r}" ry="${r}" fill="#fff"/></svg>`);
  const rounded = await sharp(inner).ensureAlpha().composite([{ input: await sharp(mask).blur(8).png().toBuffer(), blend: "dest-in" }]).png().toBuffer();
  const square = await sharp(bg).composite([{ input: rounded }]).png().toBuffer();
  fs.writeFileSync("scripts/dev/mockups/app-icon-square.png", square);

  // 3) 적응형 아이콘 앞쪽 그림: 108dp 중 그림은 가운데 84dp (모양 마스크에 손 끝만 살짝 잘리게)
  //    바깥은 그림 가장자리 색을 늘여 채워서 어떤 모양 마스크에도 빈틈이 없어요
  const fgSizes = { ldpi: 81, mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };
  const legacy = { ldpi: 36, mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
  const pad = Math.round((S * (108 / 84) - S) / 2);
  const fgFull = await sharp(square).extend({ top: pad, bottom: pad, left: pad, right: pad, extendWith: "copy" }).png().toBuffer();
  for (const [d, px] of Object.entries(fgSizes)) {
    await sharp(fgFull).resize(px, px, { kernel: "lanczos3" }).png().toFile(`${RES}/mipmap-${d}/ic_launcher_foreground.png`);
  }
  // 4) 예전 안드로이드(7 이하)용: 둥근 사각형·동그라미
  for (const [d, px] of Object.entries(legacy)) {
    const sq = await sharp(square).resize(px, px).png().toBuffer();
    const rr = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"><rect width="${px}" height="${px}" rx="${px * 0.18}" fill="#fff"/></svg>`);
    const cc = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"><circle cx="${px / 2}" cy="${px / 2}" r="${px / 2}" fill="#fff"/></svg>`);
    await sharp(sq).ensureAlpha().composite([{ input: await sharp(rr).png().toBuffer(), blend: "dest-in" }]).png().toFile(`${RES}/mipmap-${d}/ic_launcher.png`);
    await sharp(sq).ensureAlpha().composite([{ input: await sharp(cc).png().toBuffer(), blend: "dest-in" }]).png().toFile(`${RES}/mipmap-${d}/ic_launcher_round.png`);
  }
  fs.writeFileSync(`${RES}/values/ic_launcher_background.xml`, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BG}</color>\n</resources>`);

  // 5) 웹(PWA) 아이콘
  await sharp(square).resize(192, 192).png().toFile("public/icons/icon-192.png");
  await sharp(square).resize(512, 512).png().toFile("public/icons/icon-512.png");
  await sharp(fgFull).resize(512, 512).png().toFile("public/icons/icon-512-maskable.png");
  for (const f of ["assets/icon-only.png", "assets/icon-foreground.png"]) if (fs.existsSync(f)) await sharp(f.includes("foreground") ? fgFull : square).resize(1024, 1024).png().toFile(f);

  // 6) 스토어 아이콘 512 (Play가 모서리를 둥글게 해요 → 꽉 찬 정사각형, 32비트 PNG)
  if (STORE) await sharp(square).resize(512, 512).ensureAlpha().png().toFile(path.join(STORE, "앱아이콘_512.png"));
  console.log("ok", S);
})();
