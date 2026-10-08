// 2026-10-08 전면 광고 규칙 조정: 진단 결과 직전(첫날도) + 지원금 상세 5개마다, 앱 켤 때 1번·5분 간격·하루 2번
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const a = s.indexOf("// ---- 전면 광고");
const b = s.indexOf('// size: "banner"');
if (a < 0 || b < 0) throw new Error("block");
s =
  s.slice(0, a) +
  `// ---- 전면 광고 ----
// 위치: ① 맞춤 진단 결과 직전 ② 지원금 상세를 5개 볼 때마다 (목록으로 돌아올 때)
// 규칙: 앱을 한 번 켤 때 최대 1번 · 5분 간격 · 하루 최대 2번 · 처음 쓰는 날은 ②만 안 나와요 (진단은 보통 첫날 한 번이라 허용)
// 출시 후 평점·수익을 보고 숫자만 바꾸면 돼요
const INTER_KEY = "interAd";
const INTER_RULE = { gapMs: 5 * 60e3, maxPerDay: 2, minDays: 2, detailEvery: 5 };
let interShownThisSession = false;
const interAllowed = (kind) => {
  if (interShownThisSession) return false;
  try {
    if (kind !== "diag") {
      const usedDays = (JSON.parse(localStorage.getItem("reviewAsk") || "{}").days || []).length;
      if (usedDays < INTER_RULE.minDays) return false;
    }
    const r = JSON.parse(localStorage.getItem(INTER_KEY) || "{}");
    const today = formatLocalDate(new Date());
    const count = r.day === today ? r.count || 0 : 0;
    return count < INTER_RULE.maxPerDay && Date.now() - (r.last || 0) > INTER_RULE.gapMs;
  } catch (e) {
    return false;
  }
};
const recordInter = () => {
  interShownThisSession = true;
  try {
    const r = JSON.parse(localStorage.getItem(INTER_KEY) || "{}");
    const today = formatLocalDate(new Date());
    localStorage.setItem(INTER_KEY, JSON.stringify({ ...r, day: today, count: (r.day === today ? r.count || 0 : 0) + 1, last: Date.now() }));
  } catch (e) {
    // 저장 못 해도 괜찮아요
  }
};
// 지원금 상세 본 횟수 (5개마다 한 번 기회)
const countDetailView = () => {
  try {
    const r = JSON.parse(localStorage.getItem(INTER_KEY) || "{}");
    const n = (r.details || 0) + 1;
    localStorage.setItem(INTER_KEY, JSON.stringify({ ...r, details: n }));
    return n;
  } catch (e) {
    return 0;
  }
};
let interReady = false;
// 미리 불러두기 — 보여줄 순간에 기다림 없이 바로 뜨게
const prepareInter = async (kind) => {
  if (!Capacitor.isNativePlatform() || !INTER_AD_ID || interReady || !interAllowed(kind)) return;
  try {
    await initAds();
    await AdMob.prepareInterstitial({ adId: INTER_AD_ID, isTesting: AD_TESTING });
    interReady = true;
  } catch (e) {
    interReady = false;
  }
};
// 준비돼 있으면 보여주고, 사용자가 닫을 때까지 기다려요 (준비 안 됐으면 바로 넘어가요)
const showInterIfReady = async (kind) => {
  if (!interReady || !interAllowed(kind)) return;
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

` +
  s.slice(b);

const rep = (x, y) => {
  if (s.split(x).length !== 2) throw new Error("nf " + x.slice(0, 70));
  s = s.replace(x, y);
};
rep(
  `  useEffect(() => {
    if (screen.view === "diagnosis") prepareInter();
  }, [screen.view]);`,
  `  // 전면 광고: 진단 화면에 들어오면 미리 불러두고, 지원금 상세는 5개째에 미리 불러둔 뒤 목록으로 돌아올 때 보여줘요
  const prevView = useRef(screen.view);
  const detailInterDue = useRef(false);
  useEffect(() => {
    const prev = prevView.current;
    prevView.current = screen.view;
    if (screen.view === "diagnosis") prepareInter("diag");
    if (screen.view === "detail" && prev !== "detail") {
      const n = countDetailView();
      detailInterDue.current = n > 0 && n % INTER_RULE.detailEvery === 0;
      if (detailInterDue.current) prepareInter("detail");
    }
    if (prev === "detail" && screen.view !== "detail" && detailInterDue.current) {
      detailInterDue.current = false;
      showInterIfReady("detail");
    }
  }, [screen.view]);`
);
rep("            await showInterIfReady(); // 결과를 보여주기 직전 (조건이 맞을 때만)", '            await showInterIfReady("diag"); // 결과를 보여주기 직전 (조건이 맞을 때만)');
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));
console.log("ok");
