// 지원금 분야 그림: 시안(말랑한 입체 느낌)에 맞춰 직접 그린 7개 + 시안에서 다시 잘라낸 4개
const fs = require("fs");
const path = require("path");
const sharp = require(path.resolve("node_modules/sharp"));
const OUT = "src/assets/cat";
const PREVIEW = process.argv[2];
const MOCK = "scripts/dev/mockups/list-mockup.png";
const S = 192;

// 공통: 연한 동그라미 배경 + 바닥 그림자 + 입체 그림자 필터
const wrap = (bg, body, extraDefs = "") => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
<defs>
  <radialGradient id="bg" cx="42%" cy="38%" r="65%"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="0.55" stop-color="${bg}" stop-opacity="0.55"/><stop offset="1" stop-color="${bg}" stop-opacity="0.95"/></radialGradient>
  <radialGradient id="edge" cx="50%" cy="50%" r="50%"><stop offset="0.86" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <mask id="m"><rect width="400" height="400" fill="url(#edge)"/></mask>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="lift" x="-30%" y="-30%" width="160%" height="170%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="7"/><feOffset dy="9" result="b"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.22"/></feComponentTransfer>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD979"/><stop offset="1" stop-color="#F5A623"/></linearGradient>
  <linearGradient id="goldSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2A93B"/><stop offset="1" stop-color="#D98712"/></linearGradient>
  ${extraDefs}
</defs>
<g mask="url(#m)"><circle cx="200" cy="200" r="196" fill="url(#bg)"/></g>
<g transform="translate(200 206) scale(1.13) translate(-200 -206)">${body}</g>
</svg>`;

// 동전 (₩)
const coin = (x, y, r) => `
  <g filter="url(#lift)">
    <ellipse cx="${x}" cy="${y + r * 0.16}" rx="${r}" ry="${r}" fill="url(#goldSide)"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="url(#gold)"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.74}" fill="none" stroke="#F0A12A" stroke-width="${r * 0.08}" opacity="0.7"/>
    <text x="${x}" y="${y + r * 0.36}" font-family="Arial Black, Arial" font-weight="900" font-size="${r * 1.0}" fill="#FFFFFF" text-anchor="middle">₩</text>
    <ellipse cx="${x - r * 0.35}" cy="${y - r * 0.45}" rx="${r * 0.32}" ry="${r * 0.16}" fill="#fff" opacity="0.55" transform="rotate(-30 ${x - r * 0.35} ${y - r * 0.45})"/>
  </g>`;
const sparkle = (x, y, s, c) => `<path d="M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s}Z" fill="${c}"/>`;
const shadow = (cx, cy, rx, ry = 16) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2B3A67" opacity="0.13" filter="url(#soft)"/>`;

const ICONS = {
  // 경영: 올라가는 막대 그래프 + 화살표
  manage: wrap(
    "#FFD9CF",
    `${shadow(200, 312, 120)}
    <g filter="url(#lift)">
      <rect x="92" y="268" width="216" height="34" rx="14" fill="#FFFFFF"/>
      <rect x="92" y="290" width="216" height="12" rx="6" fill="#E9ECF5"/>
      <rect x="112" y="200" width="46" height="78" rx="14" fill="url(#bar1)"/>
      <rect x="177" y="160" width="46" height="118" rx="14" fill="url(#bar2)"/>
      <rect x="242" y="118" width="46" height="160" rx="14" fill="url(#bar3)"/>
      <rect x="120" y="208" width="10" height="56" rx="5" fill="#fff" opacity="0.45"/>
      <rect x="185" y="168" width="10" height="94" rx="5" fill="#fff" opacity="0.45"/>
      <rect x="250" y="126" width="10" height="136" rx="5" fill="#fff" opacity="0.45"/>
    </g>
    <g filter="url(#lift)">
      <path d="M96 196 C150 170 190 150 250 92" fill="none" stroke="url(#arrow)" stroke-width="20" stroke-linecap="round"/>
      <path d="M226 76 L284 66 L272 124 Z" fill="#FFB33A" stroke="#FFB33A" stroke-width="10" stroke-linejoin="round"/>
    </g>
    ${coin(318, 228, 30)}
    ${sparkle(100, 112, 13, "#FF8A6B")}`,
    `<linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB4A0"/><stop offset="1" stop-color="#F0735A"/></linearGradient>
     <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9A80"/><stop offset="1" stop-color="#E8573D"/></linearGradient>
     <linearGradient id="bar3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7F63"/><stop offset="1" stop-color="#D9432A"/></linearGradient>
     <linearGradient id="arrow" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FFD36B"/><stop offset="1" stop-color="#FFA726"/></linearGradient>`
  ),

  // 디지털전환: 스마트폰 속 가게 + 와이파이
  digital: wrap(
    "#CDEFF7",
    `${shadow(196, 322, 92)}
    <g filter="url(#lift)">
      <rect x="128" y="74" width="140" height="244" rx="30" fill="url(#phone)"/>
      <rect x="142" y="92" width="112" height="196" rx="18" fill="#F4FBFF"/>
      <rect x="180" y="300" width="36" height="8" rx="4" fill="#fff" opacity="0.7"/>
      <rect x="134" y="82" width="12" height="120" rx="6" fill="#fff" opacity="0.35"/>
      <!-- 화면 속 가게 -->
      <path d="M158 162 h80 l-6 -30 h-68 z" fill="#3FD4F0"/>
      <path d="M164 132 h13.6 l-2 30 h-17.6 z M191.2 132 h13.6 l2 30 h-17.6 z M218.4 132 h13.6 l6 30 h-17.6 z" fill="#FFFFFF" opacity="0.9"/>
      <path d="M158 162 a10 10 0 0 0 20 0 a10 10 0 0 0 20 0 a10 10 0 0 0 20 0 a10 10 0 0 0 20 0" fill="#1BB6D6"/>
      <rect x="164" y="170" width="68" height="56" rx="6" fill="#FFFFFF"/>
      <rect x="174" y="182" width="22" height="22" rx="4" fill="#BDEFFA"/>
      <rect x="204" y="190" width="18" height="36" rx="4" fill="#7FDDF0"/>
      <rect x="160" y="244" width="76" height="22" rx="11" fill="url(#btn)"/>
    </g>
    <g filter="url(#lift)"><circle cx="266" cy="96" r="30" fill="url(#btn)"/><path d="M252 96 L262 106 L281 86" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="256" cy="82" rx="9" ry="5" fill="#fff" opacity="0.5"/></g>
    ${sparkle(102, 128, 14, "#5FD0EA")}
    ${sparkle(304, 252, 10, "#FFC94D")}`,
    `<linearGradient id="phone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5FD6F2"/><stop offset="1" stop-color="#1A8FC0"/></linearGradient>
     <linearGradient id="btn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4FD0EE"/><stop offset="1" stop-color="#1FA2D0"/></linearGradient>`
  ),

  // 보증: 방패 + 체크 + 동전
  guarantee: wrap(
    "#D6E1F5",
    `${shadow(196, 324, 100)}
    <g filter="url(#lift)">
      <path d="M196 70 C232 92 268 98 300 96 C302 196 270 268 196 310 C122 268 90 196 92 96 C124 98 160 92 196 70Z" fill="url(#shield)"/>
      <path d="M196 92 C226 110 256 116 280 115 C280 196 254 252 196 286 C138 252 112 196 112 115 C136 116 166 110 196 92Z" fill="url(#shieldIn)"/>
      <path d="M150 192 L184 226 L246 160" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M118 112 C140 112 160 104 178 94" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.45"/>
    </g>
    ${coin(296, 262, 36)}
    ${sparkle(92, 250, 13, "#7FA0E8")}
    ${sparkle(310, 92, 11, "#FFC94D")}`,
    `<linearGradient id="shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7F9DEB"/><stop offset="1" stop-color="#3A5BC9"/></linearGradient>
     <linearGradient id="shieldIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AB3F4"/><stop offset="1" stop-color="#5677DD"/></linearGradient>`
  ),

  // 임차료: 건물 + 황금 열쇠
  rent: wrap(
    "#DCE3FB",
    `${shadow(200, 322, 116)}
    <g filter="url(#lift)">
      <rect x="112" y="92" width="130" height="220" rx="20" fill="url(#bld)"/>
      <rect x="112" y="92" width="130" height="34" rx="17" fill="#8FA4F5"/>
      ${[0, 1, 2].map((r) => [0, 1].map((c) => `<rect x="${134 + c * 50}" y="${144 + r * 46}" width="36" height="30" rx="8" fill="#FFFFFF" opacity="0.92"/>`).join("")).join("")}
      <rect x="154" y="270" width="46" height="42" rx="10" fill="#5F78E6"/>
      <rect x="120" y="100" width="12" height="190" rx="6" fill="#fff" opacity="0.3"/>
    </g>
    <g filter="url(#lift)" transform="rotate(-38 270 238)">
      <circle cx="270" cy="200" r="40" fill="url(#gold)"/>
      <circle cx="270" cy="200" r="16" fill="#E6EBFB"/>
      <rect x="260" y="232" width="20" height="96" rx="10" fill="url(#gold)"/>
      <rect x="276" y="282" width="24" height="14" rx="6" fill="url(#gold)"/>
      <rect x="276" y="306" width="18" height="14" rx="6" fill="url(#gold)"/>
      <ellipse cx="256" cy="184" rx="12" ry="7" fill="#fff" opacity="0.6"/>
    </g>
    ${sparkle(312, 120, 13, "#8FA4F5")}
    ${sparkle(86, 160, 10, "#FFC94D")}`,
    `<linearGradient id="bld" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B9C6FB"/><stop offset="1" stop-color="#7189EE"/></linearGradient>`
  ),

  // 창업: 로켓
  startup: wrap(
    "#E6DAFF",
    `${shadow(190, 330, 80, 14)}
    <g filter="url(#lift)" transform="rotate(40 200 200)">
      <path d="M200 300 C186 330 194 352 200 368 C206 352 214 330 200 300Z" fill="#FFB13B"/>
      <path d="M200 292 C190 314 195 328 200 340 C205 328 210 314 200 292Z" fill="#FFE07A"/>
      <path d="M160 236 L124 286 L162 280 Z" fill="url(#fin)"/>
      <path d="M240 236 L276 286 L238 280 Z" fill="url(#fin)"/>
      <path d="M200 52 C252 96 262 196 240 290 L160 290 C138 196 148 96 200 52Z" fill="url(#body)"/>
      <path d="M200 52 C224 72 238 98 246 126 L154 126 C162 98 176 72 200 52Z" fill="url(#nose)"/>
      <circle cx="200" cy="182" r="30" fill="#7A3FE0"/>
      <circle cx="200" cy="182" r="20" fill="#C9B3FF"/>
      <ellipse cx="193" cy="174" rx="8" ry="5" fill="#fff" opacity="0.8"/>
      <rect x="186" y="270" width="28" height="30" rx="6" fill="#9B6BF0"/>
      <path d="M168 140 C164 180 166 220 172 262" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.6"/>
    </g>
    ${sparkle(96, 120, 14, "#B48CFF")}
    ${sparkle(318, 112, 11, "#FFC94D")}
    ${sparkle(312, 262, 9, "#B48CFF")}
    <circle cx="112" cy="232" r="6" fill="#C9B3FF"/>`,
    `<linearGradient id="body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4DEF5"/></linearGradient>
     <linearGradient id="nose" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B48CFF"/><stop offset="1" stop-color="#7A3FE0"/></linearGradient>
     <linearGradient id="fin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A57BFF"/><stop offset="1" stop-color="#6A31D6"/></linearGradient>`
  ),

  // 신용: 카드 + 동전
  credit: wrap(
    "#E3E6EE",
    `${shadow(196, 318, 112)}
    <g filter="url(#lift)" transform="rotate(-12 190 200)">
      <rect x="86" y="128" width="210" height="136" rx="22" fill="url(#card2)" transform="translate(16 -18)"/>
      <rect x="86" y="128" width="210" height="136" rx="22" fill="url(#card)"/>
      <rect x="86" y="154" width="210" height="26" fill="#3E4A73" opacity="0.55"/>
      <rect x="108" y="198" width="44" height="34" rx="8" fill="url(#gold)"/>
      <path d="M108 215 h44 M130 198 v34" stroke="#E2992A" stroke-width="3"/>
      <rect x="168" y="204" width="96" height="10" rx="5" fill="#fff" opacity="0.8"/>
      <rect x="168" y="222" width="60" height="10" rx="5" fill="#fff" opacity="0.5"/>
      <rect x="98" y="136" width="120" height="8" rx="4" fill="#fff" opacity="0.35"/>
    </g>
    ${coin(292, 262, 38)}
    ${coin(250, 292, 26)}
    ${sparkle(96, 104, 13, "#A9B2C8")}
    ${sparkle(318, 168, 10, "#FFC94D")}`,
    `<linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E9BC0"/><stop offset="1" stop-color="#56628A"/></linearGradient>
     <linearGradient id="card2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D3D9EA"/><stop offset="1" stop-color="#A9B2C8"/></linearGradient>`
  ),

  // 재기: 화분 새싹 + 다시 도는 화살표
  restart: wrap(
    "#D2F2E8",
    `${shadow(200, 326, 96)}
    <g fill="none" stroke="url(#ring)" stroke-width="18" stroke-linecap="round" filter="url(#lift)">
      <path d="M106 186 A98 98 0 0 1 270 116"/>
      <path d="M294 214 A98 98 0 0 1 130 284"/>
    </g>
    <path d="M254 92 L300 108 L268 146 Z" fill="#3FC9A5" stroke="#3FC9A5" stroke-width="8" stroke-linejoin="round"/>
    <path d="M146 308 L100 292 L132 254 Z" fill="#3FC9A5" stroke="#3FC9A5" stroke-width="8" stroke-linejoin="round"/>
    <g filter="url(#lift)">
      <path d="M200 236 C200 210 200 196 200 172" stroke="#2E9E6E" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M200 196 C168 196 146 176 144 146 C176 144 198 166 200 196Z" fill="url(#leafL)"/>
      <path d="M200 182 C206 148 232 128 262 132 C258 166 232 184 200 182Z" fill="url(#leafR)"/>
      <path d="M154 154 C168 162 182 174 192 188" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.5" fill="none"/>
      <path d="M152 232 h96 l-12 60 a14 14 0 0 1 -14 12 h-44 a14 14 0 0 1 -14 -12 Z" fill="url(#pot)"/>
      <rect x="144" y="222" width="112" height="24" rx="12" fill="#FFB98A"/>
      <rect x="158" y="252" width="10" height="34" rx="5" fill="#fff" opacity="0.4"/>
    </g>
    ${sparkle(312, 260, 11, "#FFC94D")}
    ${sparkle(92, 120, 10, "#5FD3B0")}`,
    `<linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FE3C6"/><stop offset="1" stop-color="#2FB892"/></linearGradient>
     <linearGradient id="leafL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8FE08A"/><stop offset="1" stop-color="#3DB55B"/></linearGradient>
     <linearGradient id="leafR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9BE59A"/><stop offset="1" stop-color="#46BE62"/></linearGradient>
     <linearGradient id="pot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9F6B"/><stop offset="1" stop-color="#E9743F"/></linearGradient>`
  ),
};

const circleMask = (r0, r1) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="${r0}" stop-color="#fff"/><stop offset="${r1}" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);
async function fromMock(name, left, top, size, r0, r1) {
  const b = await sharp(MOCK).extract({ left, top, width: size, height: size }).resize(S, S, { kernel: "lanczos3" }).png().toBuffer();
  const m = await sharp(circleMask(r0, r1)).png().toBuffer();
  await sharp(b).ensureAlpha().composite([{ input: m, blend: "dest-in" }]).webp({ quality: 92 }).toFile(`${OUT}/${name}.webp`);
}

(async () => {
  for (const [name, svg] of Object.entries(ICONS)) {
    fs.writeFileSync(path.join(PREVIEW, name + ".svg"), svg);
    await sharp(Buffer.from(svg), { density: 96 }).resize(S, S).webp({ quality: 92 }).toFile(`${OUT}/${name}.webp`);
  }
  await fromMock("list-hero", 50, 126, 196, 0.8, 1);
  await fromMock("employ", 46, 860, 164, 0.9, 1);
  await fromMock("fixed", 46, 1102, 164, 0.9, 1);
  await fromMock("energy", 44, 1329, 164, 0.9, 1);

  const order = ["employ", "fixed", "energy", "manage", "digital", "guarantee", "rent", "startup", "credit", "restart", "list-hero"];
  const comp = [];
  for (let i = 0; i < order.length; i++) comp.push({ input: await sharp(`${OUT}/${order[i]}.webp`).resize(180, 180).toBuffer(), left: (i % 6) * 190 + 5, top: Math.floor(i / 6) * 190 + 5 });
  await sharp({ create: { width: 1140, height: 380, channels: 3, background: "#FFFFFF" } }).composite(comp).png().toFile(path.join(PREVIEW, "sheet.png"));
  console.log("ok");
})();
