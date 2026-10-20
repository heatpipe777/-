// 시스템 줄(위 시간·배터리, 아래 버튼) 아이콘이 바탕과 구별되는지 확인해요
// 사용: node scripts/dev/sysbar_check.cjs <캡처.png>  → 위·아래 줄에서 바탕색과 다른 점 개수, 너무 적으면 "안 보임"
const sharp = require("sharp");
(async () => {
  const { data, info } = await sharp(process.argv[2]).raw().toBuffer({ resolveWithObject: true });
  const band = (y0, y1) => {
    const bg = data.slice((y0 * info.width + 5) * info.channels, (y0 * info.width + 5) * info.channels + 3);
    let n = 0;
    for (let y = y0; y < y1; y++) for (let x = 0; x < info.width; x++) {
      const o = (y * info.width + x) * info.channels;
      if (Math.abs(data[o] - bg[0]) + Math.abs(data[o + 1] - bg[1]) + Math.abs(data[o + 2] - bg[2]) > 150) n++;
    }
    return n;
  };
  const h = Math.round(info.height * 0.025);
  const top = band(2, h), bottom = band(info.height - h * 2, info.height - 2);
  const bad = [top < 80 && "위 줄", bottom < 80 && "아래 줄"].filter(Boolean);
  console.log(bad.length ? `시스템 줄 아이콘 안 보임: ${bad.join("·")} (점 ${top}/${bottom})` : `시스템 줄 아이콘 OK (점 ${top}/${bottom})`);
})();
