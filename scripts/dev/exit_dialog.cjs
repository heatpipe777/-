// 2026-10-07 앱 종료 확인 창 + 광고(300x250), 배너 상태를 하나로 관리
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 70));
  s = s.replace(a, b);
};

// 1) 배너 관리: 하단 배너와 종료 창 광고가 한 자리(광고 1개)를 번갈아 써요
const a = s.indexOf("// 하단 배너 보이기/숨기기 — 배너 높이만큼");
const b = s.indexOf("// 중기부 보도자료 RSS");
if (a < 0 || b < 0) throw new Error("hook");
s =
  s.slice(0, a) +
  `// 광고는 화면에 한 개만 — 지금 떠 있는 광고 종류: null | "bottom"(하단 배너) | "exit"(종료 창)
const adState = { kind: null, hidden: false };
const removeAd = async () => {
  if (!adState.kind) return;
  adState.kind = null;
  document.body.style.paddingBottom = "";
  try {
    await AdMob.removeBanner();
  } catch (e) {
    // 이미 없어도 괜찮아요
  }
};
// 하단 배너 보이기/숨기기 — 배너 높이만큼 화면 아래 여백을 늘려서 내용이 가려지지 않게 해요
function useBottomBanner(show) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const sub = AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
      const h = adState.kind === "bottom" && !adState.hidden ? Math.round(size?.height || 0) : 0;
      // 배너와 화면 내용 사이 24px 띄워서 실수로 누르지 않게 해요 (AdMob 실수 클릭 정책)
      document.body.style.paddingBottom = h ? \`\${h + 24}px\` : "";
    });
    return () => {
      sub.then((x) => x.remove());
    };
  }, []);
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let cancelled = false;
    (async () => {
      try {
        if (show) {
          await initAds();
          if (cancelled || adState.kind === "exit") return;
          if (adState.kind === "bottom") {
            adState.hidden = false;
            await AdMob.resumeBanner();
          } else {
            adState.kind = "bottom";
            adState.hidden = false;
            await AdMob.showBanner({ adId: BANNER_AD_ID, adSize: BannerAdSize.ADAPTIVE_BANNER, position: BannerAdPosition.BOTTOM_CENTER, margin: 0, isTesting: AD_TESTING });
          }
        } else if (adState.kind === "bottom" && !adState.hidden) {
          adState.hidden = true;
          document.body.style.paddingBottom = "";
          await AdMob.hideBanner();
        }
      } catch (e) {
        // 광고를 못 불러와도 앱은 그대로 써요
        if (show && adState.kind === "bottom") adState.kind = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [show]);
}

// 앱 종료 확인 창 — 가운데 광고(300x250), 광고와 버튼은 충분히 띄워서 실수로 누르지 않게 해요
const EXIT_AD_W = 300;
const EXIT_AD_H = 250;
function ExitDialog({ onCancel, onExit }) {
  const native = Capacitor.isNativePlatform();
  useEffect(() => {
    if (!native) return;
    let cancelled = false;
    (async () => {
      try {
        await initAds();
        await removeAd(); // 숨겨 둔 하단 배너가 있으면 치워요
        if (cancelled) return;
        adState.kind = "exit";
        await AdMob.showBanner({ adId: BANNER_AD_ID, adSize: BannerAdSize.MEDIUM_RECTANGLE, position: BannerAdPosition.CENTER, margin: 0, isTesting: AD_TESTING });
        if (cancelled) await removeAd();
      } catch (e) {
        adState.kind = null;
      }
    })();
    return () => {
      cancelled = true;
      if (adState.kind === "exit") removeAd();
    };
  }, []);
  const half = EXIT_AD_H / 2;
  return (
    <div className="fixed inset-0" style={{ zIndex: 70, background: "rgba(20,24,36,0.55)" }} onClick={onCancel}>
      {/* 흰 카드: 위 제목(120px) + 가운데 광고 자리 + 아래 버튼(104px) — 광고가 화면 정가운데에 오도록 배치 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1/2 -translate-x-1/2 rounded-[26px] bg-white"
        style={{ width: "min(340px, calc(100% - 32px))", top: \`calc(50% - \${half + 116}px)\`, bottom: \`calc(50% - \${half + 108}px)\`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}
      >
        <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-center text-center px-5" style={{ height: 104 }}>
          <p className="text-[17px] font-extrabold" style={{ color: TEXT }}>사장줍줍을 종료할까요?</p>
          <p className="text-[12.5px] mt-1 break-keep" style={{ color: MUTED }}>마감 알림은 앱을 닫아도 그대로 와요</p>
        </div>
        {/* 광고 자리 (광고는 이 위에 따로 떠요) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-xl flex items-center justify-center"
          style={{ top: 116, width: EXIT_AD_W, height: EXIT_AD_H, maxWidth: "calc(100% - 16px)", background: "#F4F5F8" }}
        >
          <span className="text-[11px]" style={{ color: "#B5BAC8" }}>{native ? "광고" : ""}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex gap-2 px-4 pb-4" style={{ height: 76, alignItems: "flex-end" }}>
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-2xl text-[14.5px] font-bold" style={{ background: "#F1F3F8", color: TEXT }}>
            계속 이용
          </button>
          <button onClick={onExit} className="flex-1 py-3.5 rounded-2xl text-[14.5px] font-bold" style={BTN_PRIMARY}>
            종료하기
          </button>
        </div>
      </div>
    </div>
  );
}

` +
  s.slice(b);

// 2) 뒤로가기: 홈에서 누르면 바로 끄지 않고 종료 확인 창
rep(
  `  backRef.current = () => {
    if (window.__subBack) return window.__subBack();`,
  `  backRef.current = () => {
    if (exitOpen) return setExitOpen(false); // 종료 창에서 한 번 더 누르면 창만 닫아요
    if (window.__subBack) return window.__subBack();`
);
rep("    if (mainTab !== \"home\") return setMainTab(\"home\");\n    CapApp.exitApp();\n  };", "    if (mainTab !== \"home\") return setMainTab(\"home\");\n    setExitOpen(true);\n  };");
rep(
  "  const [typing, setTyping] = useState(false);\n",
  "  const [typing, setTyping] = useState(false);\n  const [exitOpen, setExitOpen] = useState(false);\n"
);
rep(
  "      {/* Bottom tab bar */}",
  `      {exitOpen && (
        <ExitDialog
          onCancel={() => setExitOpen(false)}
          onExit={async () => {
            await removeAd();
            CapApp.exitApp();
          }}
        />
      )}

      {/* Bottom tab bar */}`
);
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));
console.log("ok");
