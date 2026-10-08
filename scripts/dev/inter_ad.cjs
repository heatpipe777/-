// 2026-10-08 전면 광고: 맞춤 진단 7문항을 마치고 결과로 넘어가기 직전 (3분 간격·하루 5번·첫날 제외)
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 70));
  s = s.replace(a, b);
};

rep(
  'import { AdMob, BannerAdPosition, BannerAdSize, BannerAdPluginEvents } from "@capacitor-community/admob";',
  'import { AdMob, BannerAdPosition, BannerAdSize, BannerAdPluginEvents, InterstitialAdPluginEvents } from "@capacitor-community/admob";'
);
rep(
  'const AD_TESTING = false;',
  `const AD_TESTING = false;
// 전면 광고 단위 — AdMob에서 '전면 광고' 단위를 만들면 번호를 넣어요 (null이면 전면 광고를 쓰지 않아요)
const INTER_AD_ID = null;`
);

// 규칙·표시 함수 (useBottomBanner 앞)
rep(
  "// size: \"banner\"(얇은 하단 배너)",
  `// ---- 전면 광고 (맞춤 진단 결과 직전에만) ----
// 규칙: 처음 쓰는 날은 안 보여요 · 최소 3분 간격 · 하루 최대 5번
const INTER_KEY = "interAd";
const INTER_RULE = { gapMs: 3 * 60e3, maxPerDay: 5, minDays: 2 };
const interAllowed = () => {
  try {
    const usedDays = (JSON.parse(localStorage.getItem("reviewAsk") || "{}").days || []).length;
    if (usedDays < INTER_RULE.minDays) return false;
    const r = JSON.parse(localStorage.getItem(INTER_KEY) || "{}");
    const today = formatLocalDate(new Date());
    const count = r.day === today ? r.count || 0 : 0;
    return count < INTER_RULE.maxPerDay && Date.now() - (r.last || 0) > INTER_RULE.gapMs;
  } catch (e) {
    return false;
  }
};
const recordInter = () => {
  try {
    const r = JSON.parse(localStorage.getItem(INTER_KEY) || "{}");
    const today = formatLocalDate(new Date());
    localStorage.setItem(INTER_KEY, JSON.stringify({ day: today, count: (r.day === today ? r.count || 0 : 0) + 1, last: Date.now() }));
  } catch (e) {
    // 저장 못 해도 괜찮아요
  }
};
let interReady = false;
// 미리 불러두기 (진단 화면에 들어올 때) — 끝났을 때 바로 보여줄 수 있게
const prepareInter = async () => {
  if (!Capacitor.isNativePlatform() || !INTER_AD_ID || interReady || !interAllowed()) return;
  try {
    await initAds();
    await AdMob.prepareInterstitial({ adId: INTER_AD_ID, isTesting: AD_TESTING });
    interReady = true;
  } catch (e) {
    interReady = false;
  }
};
// 준비돼 있으면 보여주고, 사용자가 닫을 때까지 기다려요 (준비 안 됐으면 바로 넘어가요)
const showInterIfReady = async () => {
  if (!interReady || !interAllowed()) return;
  interReady = false;
  recordInter();
  await new Promise((resolve) => {
    let done = false;
    const handles = [];
    const finish = () => {
      if (done) return;
      done = true;
      handles.forEach((h) => h.then((x) => x.remove()));
      resolve();
    };
    handles.push(AdMob.addListener(InterstitialAdPluginEvents.Dismissed, finish));
    handles.push(AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, finish));
    AdMob.showInterstitial().catch(finish);
    setTimeout(finish, 90e3); // 혹시 닫힘 신호가 안 와도 멈추지 않게
  });
};

// size: "banner"(얇은 하단 배너)`
);

// 진단 화면에 들어오면 미리 불러두기
rep(
  "  const [calcOpen, setCalcOpen] = useState(false);",
  `  const [calcOpen, setCalcOpen] = useState(false);
  useEffect(() => {
    if (screen.view === "diagnosis") prepareInter();
  }, [screen.view]);`
);
// 진단 완료 → (전면 광고) → 결과
rep(
  `          onComplete={(answers) => {
            setDiagnosis(answers);
            if (region === "전체" && answers.region) setRegion(answers.region);
            setStatusFilter("available");
            setScreen({ view: "diagnosisResult" });
          }}`,
  `          onComplete={async (answers) => {
            setDiagnosis(answers);
            if (region === "전체" && answers.region) setRegion(answers.region);
            setStatusFilter("available");
            await showInterIfReady(); // 결과를 보여주기 직전 (조건이 맞을 때만)
            setScreen({ view: "diagnosisResult" });
          }}`
);
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));
console.log("ok");
