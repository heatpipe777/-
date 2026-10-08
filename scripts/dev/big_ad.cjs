// 2026-10-08 계산기 목록 화면: 아래 빈 공간에 큰 광고(300x250), 나머지 화면은 얇은 하단 배너
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 70));
  s = s.replace(a, b);
};

// 1) 훅: show → size ("banner" | "rect" | null)
rep(
  "function useBottomBanner(show) {",
  `// size: "banner"(얇은 하단 배너) | "rect"(아래 빈 공간이 넉넉한 화면용 300x250) | null(숨김)
function useBottomBanner(size) {
  const show = !!size;`
);
rep(
  `          if (adState.kind === "bottom") {
            adState.hidden = false;
            await AdMob.resumeBanner();
          } else {
            adState.kind = "bottom";
            adState.hidden = false;
            await AdMob.showBanner({ adId: BANNER_AD_ID, adSize: BannerAdSize.ADAPTIVE_BANNER, position: BannerAdPosition.BOTTOM_CENTER, margin: 0, isTesting: AD_TESTING });
          }`,
  `          if (adState.kind === "bottom" && adState.size === size) {
            adState.hidden = false;
            await AdMob.resumeBanner();
          } else {
            if (adState.kind === "bottom") await removeAd(); // 크기가 바뀌면 새로 띄워요
            if (cancelled) return;
            adState.kind = "bottom";
            adState.size = size;
            adState.hidden = false;
            await AdMob.showBanner({
              adId: BANNER_AD_ID,
              adSize: size === "rect" ? BannerAdSize.MEDIUM_RECTANGLE : BannerAdSize.ADAPTIVE_BANNER,
              position: BannerAdPosition.BOTTOM_CENTER,
              margin: size === "rect" ? 16 : 0,
              isTesting: AD_TESTING,
            });
          }`
);
rep("  }, [show]);\n}\n\n// 앱 종료 확인 창", "  }, [size]);\n}\n\n// 앱 종료 확인 창");
// 큰 광고는 아래 여백 16px 더 띄워서
rep(
  "      const h = adState.kind === \"bottom\" && !adState.hidden ? Math.round(size?.height || 0) : 0;",
  "      const h = adState.kind === \"bottom\" && !adState.hidden ? Math.round(size?.height || 0) + (adState.size === \"rect\" ? 16 : 0) : 0;"
);
rep("const adState = { kind: null, hidden: false };", "const adState = { kind: null, size: null, hidden: false };");

// 2) 계산기: 목록인지 계산기 하나 열렸는지 App에 알려요
rep("function CalculatorToolkit({ onBack, initialTab }) {", "function CalculatorToolkit({ onBack, initialTab, onOpenChange }) {");
rep(
  "  const [open, setOpen] = useState(initialTab || null);\n",
  `  const [open, setOpen] = useState(initialTab || null);
  useEffect(() => {
    onOpenChange?.(!!open);
    return () => onOpenChange?.(false);
  }, [open]);
`
);
rep(
  `<CalculatorToolkit key={screen.tab || "list"} initialTab={screen.tab} onBack={() => setScreen({ view: screen.from || "home" })} />`,
  `<CalculatorToolkit key={screen.tab || "list"} initialTab={screen.tab} onOpenChange={setCalcOpen} onBack={() => setScreen({ view: screen.from || "home" })} />`
);
rep(
  "  useBottomBanner(!NO_AD_VIEWS.includes(screen.view) && !typing);",
  `  const [calcOpen, setCalcOpen] = useState(false);
  // 계산기 목록은 아래가 많이 비어서 큰 광고, 그 밖의 화면은 얇은 하단 배너
  useBottomBanner(NO_AD_VIEWS.includes(screen.view) || typing ? null : screen.view === "calculator" && !calcOpen ? "rect" : "banner");`
);
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));
console.log("ok");
