// 화면 맨 위 안내 카드용 입체 아이콘 (지원금 목록의 파란 문서+돋보기 아이콘과 같은 모양)
const fs = require("fs");
const path = require("path");
const sharp = require(path.resolve("node_modules/sharp"));
const OUT = "src/assets/cat";
const PREVIEW = process.argv[2];
const S = 192;

const tile = (c1, c2, accent, inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
<defs>
  <linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
  <radialGradient id="gl" cx="30%" cy="22%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity="0.45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <filter id="sh" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="14"/><feOffset dy="16"/><feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="lift" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="6"/><feOffset dy="7"/><feComponentTransfer><feFuncA type="linear" slope="0.18"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="blur"><feGaussianBlur stdDeviation="4"/></filter>
  <linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EEF0F8"/></linearGradient>
</defs>
<g filter="url(#sh)">
  <rect x="62" y="84" width="256" height="256" rx="70" fill="${c2}" transform="rotate(-5 190 198)"/>
  <rect x="62" y="70" width="256" height="256" rx="70" fill="url(#t)" transform="rotate(-5 190 198)"/>
  <rect x="76" y="82" width="228" height="228" rx="60" fill="none" stroke="#fff" stroke-opacity="0.28" stroke-width="6" filter="url(#blur)" transform="rotate(-5 190 198)"/>
  <rect x="62" y="70" width="256" height="256" rx="70" fill="url(#gl)" transform="rotate(-5 190 198)"/>
</g>
<g transform="rotate(-5 190 198)">${inner}</g>
<g stroke="${accent}" stroke-width="13" stroke-linecap="round"><path d="M318 46 L330 22"/><path d="M336 74 L362 64"/></g>
</svg>`;

const ICONS = {
  // 즐겨찾기: 하트 + 종
  "hero-fav": tile("#FF8DB4", "#E0457A", "#FF8DB4", `<g filter="url(#lift)">
      <path d="M190 282 C120 236 102 200 102 168 C102 136 126 114 154 114 C172 114 184 124 190 138 C196 124 208 114 226 114 C254 114 278 136 278 168 C278 200 260 236 190 282Z" fill="url(#w)"/>
      <ellipse cx="140" cy="146" rx="14" ry="8" fill="#fff" transform="rotate(-40 140 146)"/>
      <circle cx="262" cy="262" r="36" fill="#FFC23D"/>
      <path d="M262 240 C274 240 280 249 280 260 V270 L285 277 H239 L244 270 V260 C244 249 250 240 262 240Z" fill="#fff"/>
      <circle cx="262" cy="282" r="5" fill="#fff"/>
    </g>`),
  // MY: 사람 + 톱니바퀴
  "hero-my": tile("#9B95FA", "#5E57D9", "#9B95FA", `<g filter="url(#lift)">
      <circle cx="184" cy="148" r="42" fill="url(#w)"/>
      <path d="M108 268 C108 218 142 198 184 198 C226 198 260 218 260 268 Z" fill="url(#w)"/>
      <ellipse cx="168" cy="128" rx="13" ry="7" fill="#fff" transform="rotate(-30 168 128)"/>
      <g transform="translate(262 262)">
        ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<rect x="-8" y="-40" width="16" height="18" rx="5" fill="#FFC23D" transform="rotate(${a})"/>`).join("")}
        <circle r="30" fill="#FFC23D"/>
        <circle r="12" fill="#fff"/>
      </g>
    </g>`),
  // 내 이름: 사람 + 이름표
  "hero-name": tile("#7E9BF5", "#3D63DD", "#7E9BF5", `<g filter="url(#lift)">
      <circle cx="190" cy="150" r="40" fill="url(#w)"/>
      <path d="M118 262 C118 214 150 196 190 196 C230 196 262 214 262 262 Z" fill="url(#w)"/>
      <rect x="150" y="238" width="120" height="50" rx="16" fill="#FFD36B"/>
      <rect x="166" y="252" width="62" height="9" rx="4.5" fill="#fff"/>
      <rect x="166" y="268" width="40" height="8" rx="4" fill="#fff" opacity="0.7"/>
      <ellipse cx="174" cy="132" rx="12" ry="7" fill="#fff" transform="rotate(-30 174 132)"/>
    </g>`),
  // 금리·환율: 은행 건물 + % 동그라미
  "hero-rate": tile("#7E9BF5", "#3D63DD", "#7E9BF5", `<g filter="url(#lift)">
      <path d="M190 104 L268 146 L112 146 Z" fill="url(#w)" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>
      <rect x="126" y="158" width="20" height="78" rx="6" fill="url(#w)"/>
      <rect x="164" y="158" width="20" height="78" rx="6" fill="url(#w)"/>
      <rect x="202" y="158" width="20" height="78" rx="6" fill="url(#w)"/>
      <rect x="240" y="158" width="20" height="78" rx="6" fill="url(#w)"/>
      <rect x="108" y="244" width="164" height="22" rx="8" fill="url(#w)"/>
      <circle cx="262" cy="262" r="36" fill="#FFC23D"/>
      <text x="262" y="276" font-family="Arial Black, Arial" font-weight="900" font-size="38" fill="#fff" text-anchor="middle">%</text>
    </g>`),
  // 도움말: 말풍선 + 물음표
  "hero-faq": tile("#A57BFF", "#7A46D6", "#A57BFF", `<g filter="url(#lift)">
      <path d="M190 108 C246 108 280 140 280 184 C280 228 246 258 196 258 L150 290 L158 252 C124 242 100 216 100 184 C100 140 134 108 190 108Z" fill="url(#w)"/>
      <path d="M164 166 C164 146 178 136 192 136 C208 136 220 146 220 162 C220 182 194 184 194 204" fill="none" stroke="#7A46D6" stroke-width="16" stroke-linecap="round"/>
      <circle cx="194" cy="230" r="10" fill="#7A46D6"/>
      <ellipse cx="140" cy="140" rx="14" ry="8" fill="#fff" transform="rotate(-30 140 140)"/>
    </g>`),
  // 서류: 문서 + 체크
  "hero-docs": tile("#FF9A5C", "#D9531C", "#FF9A5C", `<g filter="url(#lift)">
      <path d="M128 100 h92 l42 42 v144 a14 14 0 0 1 -14 14 h-120 a14 14 0 0 1 -14 -14 v-172 a14 14 0 0 1 14 -14Z" fill="url(#w)"/>
      <path d="M220 100 v30 a12 12 0 0 0 12 12 h30" fill="#F6D9C8"/>
      <rect x="140" y="160" width="86" height="11" rx="5.5" fill="#F4B48E"/>
      <rect x="140" y="184" width="104" height="11" rx="5.5" fill="#F4B48E"/>
      <rect x="140" y="208" width="66" height="11" rx="5.5" fill="#F4B48E"/>
      <circle cx="252" cy="262" r="34" fill="#2FB86E"/>
      <path d="M236 262 L248 274 L270 250" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`),
  // 내 일정 추가: 달력 + 플러스
  "hero-event": tile("#FFB04D", "#E07A0B", "#FFB04D", `<g filter="url(#lift)">
      <rect x="110" y="122" width="160" height="150" rx="24" fill="url(#w)"/>
      <path d="M110 146 a24 24 0 0 1 24 -24 h112 a24 24 0 0 1 24 24 v22 h-160 Z" fill="#FF8F3D"/>
      <rect x="140" y="104" width="14" height="36" rx="7" fill="#fff"/>
      <rect x="226" y="104" width="14" height="36" rx="7" fill="#fff"/>
      ${[0, 1, 2].map((c) => `<rect x="${134 + c * 40}" y="186" width="24" height="20" rx="6" fill="#FBD9B8"/>`).join("")}
      ${[0, 1].map((c) => `<rect x="${134 + c * 40}" y="218" width="24" height="20" rx="6" fill="#FBD9B8"/>`).join("")}
      <circle cx="262" cy="262" r="34" fill="#3D63DD"/>
      <path d="M262 246 v32 M246 262 h32" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
    </g>`),
  // 사장님 일정: 달력 + 체크
  "hero-schedule": tile("#4FD08F", "#22995F", "#4FD08F", `<g filter="url(#lift)">
      <rect x="110" y="122" width="160" height="150" rx="24" fill="url(#w)"/>
      <path d="M110 146 a24 24 0 0 1 24 -24 h112 a24 24 0 0 1 24 24 v22 h-160 Z" fill="#2FB878"/>
      <rect x="140" y="104" width="14" height="36" rx="7" fill="#fff"/>
      <rect x="226" y="104" width="14" height="36" rx="7" fill="#fff"/>
      ${[0, 1, 2].map((c) => `<rect x="${134 + c * 40}" y="186" width="24" height="20" rx="6" fill="#C9EEDB"/>`).join("")}
      ${[0, 1].map((c) => `<rect x="${134 + c * 40}" y="218" width="24" height="20" rx="6" fill="#C9EEDB"/>`).join("")}
      <circle cx="262" cy="262" r="34" fill="#FF8F3D"/>
      <path d="M246 262 L258 274 L280 250" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`),
  // 계산기
  "hero-calc": tile("#7E9BF5", "#3D63DD", "#7E9BF5", `<g filter="url(#lift)">
      <rect x="122" y="100" width="136" height="186" rx="24" fill="url(#w)"/>
      <rect x="138" y="118" width="104" height="40" rx="10" fill="#DCE5FF"/>
      <rect x="196" y="130" width="34" height="14" rx="7" fill="#3D63DD"/>
      ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${138 + c * 36}" y="${172 + r * 34}" width="28" height="26" rx="8" fill="${r === 2 && c === 2 ? "#FFB33A" : "#C9D6FB"}"/>`).join("")).join("")}
    </g>`),
  // 내 지역: 파란 지도 위 집 모양 핀
  "hero-region": tile("#7E9BF5", "#3D63DD", "#7E9BF5", `<g filter="url(#lift)">
      <path d="M120 236 L170 214 L214 236 L262 214 L262 290 L214 312 L170 290 L120 312 Z" fill="url(#w)"/>
      <path d="M170 214 L170 290 M214 236 L214 312" stroke="#C9D6FB" stroke-width="6"/>
      <path d="M190 112 C226 112 252 138 252 172 C252 212 206 250 190 270 C174 250 128 212 128 172 C128 138 154 112 190 112Z" fill="url(#w)"/>
      <path d="M170 176 L190 156 L210 176 V196 H170 Z" fill="#3D63DD" stroke="#3D63DD" stroke-width="6" stroke-linejoin="round"/>
      <rect x="185" y="180" width="10" height="16" rx="2" fill="#fff"/>
      <ellipse cx="166" cy="140" rx="14" ry="8" fill="#fff" transform="rotate(-30 166 140)"/>
    </g>`),
  // 알림 설정: 종 + 빨간 점
  "hero-alert": tile("#FF9478", "#E0553A", "#FF9478", `<g filter="url(#lift)">
      <path d="M190 104 C232 104 254 136 254 176 V218 L274 248 H106 L126 218 V176 C126 136 148 104 190 104Z" fill="url(#w)"/>
      <circle cx="190" cy="268" r="22" fill="url(#w)"/>
      <rect x="180" y="88" width="20" height="24" rx="10" fill="url(#w)"/>
      <circle cx="254" cy="122" r="22" fill="#FF3B57"/>
      <ellipse cx="160" cy="138" rx="14" ry="8" fill="#fff" transform="rotate(-40 160 138)"/>
    </g>`),
  // 뉴스: 신문
  "hero-news": tile("#A57BFF", "#7A46D6", "#A57BFF", `<g filter="url(#lift)">
      <rect x="104" y="112" width="172" height="172" rx="22" fill="url(#w)"/>
      <rect x="122" y="130" width="136" height="20" rx="8" fill="#7A46D6"/>
      <rect x="122" y="164" width="60" height="56" rx="10" fill="#D9C8FF"/>
      <rect x="194" y="166" width="64" height="10" rx="5" fill="#CDBDF2"/>
      <rect x="194" y="186" width="64" height="10" rx="5" fill="#CDBDF2"/>
      <rect x="194" y="206" width="44" height="10" rx="5" fill="#CDBDF2"/>
      <rect x="122" y="234" width="136" height="10" rx="5" fill="#CDBDF2"/>
      <rect x="122" y="254" width="100" height="10" rx="5" fill="#CDBDF2"/>
    </g>`),
  // 지역센터: 흰 지도 위 핀
  "hero-center": tile(
    "#F27CB4",
    "#C93A82",
    "#E5539A",
    `<g filter="url(#lift)">
      <path d="M120 236 L170 214 L214 236 L262 214 L262 290 L214 312 L170 290 L120 312 Z" fill="url(#w)"/>
      <path d="M170 214 L170 290 M214 236 L214 312" stroke="#F3C9DD" stroke-width="6"/>
      <path d="M190 112 C226 112 252 138 252 172 C252 212 206 250 190 270 C174 250 128 212 128 172 C128 138 154 112 190 112Z" fill="url(#w)"/>
      <circle cx="190" cy="172" r="24" fill="#E5539A"/>
      <ellipse cx="166" cy="140" rx="14" ry="8" fill="#fff" transform="rotate(-30 166 140)"/>
    </g>`
  ),
};

(async () => {
  for (const [name, svg] of Object.entries(ICONS)) {
    fs.writeFileSync(path.join(PREVIEW, name + ".svg"), svg);
    await sharp(Buffer.from(svg), { density: 96 }).resize(S, S).webp({ quality: 92 }).toFile(`${OUT}/${name}.webp`);
  }
  // 센터 카드용: 분홍 지도 핀 그림을 동그랗게 (기존 입체 그림)
  const src = "src/assets/news/region.webp";
  const meta = await sharp(src).metadata();
  const p = Math.round(meta.width * 0.16);
  const ext = await sharp(src).extend({ top: p, bottom: p, left: p, right: p, extendWith: "copy" }).png().toBuffer();
  const b = await sharp(ext).resize(S, S).png().toBuffer();
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0.9" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);
  await sharp(b).ensureAlpha().composite([{ input: await sharp(mask).png().toBuffer(), blend: "dest-in" }]).webp({ quality: 92 }).toFile(`${OUT}/center-pin.webp`);

  const comp = [];
  const list = ["hero-fav", "hero-my", "hero-name", "hero-region", "hero-alert", "list-hero"];
  for (let i = 0; i < list.length; i++) comp.push({ input: await sharp(`${OUT}/${list[i]}.webp`).resize(220, 220).toBuffer(), left: (i % 6) * 230, top: Math.floor(i / 6) * 230 });
  await sharp({ create: { width: 1380, height: 460, channels: 3, background: "#F4F2FB" } }).composite(comp).png().toFile(path.join(PREVIEW, "hero_sheet.png"));
  console.log("ok");
})();
