// 2026-10-07 AdMob 하단 배너: 하단 탭이 없는 하위 화면에만 (탭 화면·약관 화면 제외)
const fs = require("fs");
const edit = (f, pairs) => {
  let s = fs.readFileSync(f, "utf8");
  const crlf = s.includes("\r\n");
  s = s.replace(/\r\n/g, "\n");
  for (const [a, b] of pairs) {
    if (s.split(a).length !== 2) throw new Error(`${f}: ${a.slice(0, 60)}`);
    s = s.replace(a, b);
  }
  fs.writeFileSync(f, crlf ? s.replace(/\n/g, "\r\n") : s);
};

edit("src/App.jsx", [
  [
    'import { Capacitor, CapacitorHttp } from "@capacitor/core";',
    `import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { AdMob, BannerAdPosition, BannerAdSize, BannerAdPluginEvents } from "@capacitor-community/admob";`,
  ],
  [
    "// 중기부 보도자료 RSS",
    `// ---- 광고 (AdMob) ----
// ★ AdMob 계정을 만들면 아래 두 값만 바꾸면 돼요 (지금은 구글 공식 테스트 번호 → "Test Ad"가 보여요)
//   1) 광고 단위 ID: BANNER_AD_ID  2) 앱 ID: android/app/src/main/res/values/strings.xml 의 admob_app_id
//   진짜 번호로 바꾸면 AD_TESTING을 false로
const BANNER_AD_ID = "ca-app-pub-3940256099942544/9214589741";
const AD_TESTING = true;
// 배너를 넣지 않는 화면: 하단 탭이 있는 화면(home)과 약관·개인정보처리방침
const NO_AD_VIEWS = ["home", "privacy", "terms"];
let adReady = null; // 광고 초기화는 앱이 켜질 때 한 번만
const initAds = () =>
  (adReady ||= AdMob.initialize({ initializeForTesting: AD_TESTING }).catch(() => {
    adReady = null;
  }));
// 하단 배너 보이기/숨기기 — 배너 높이만큼 화면 아래 여백을 늘려서 내용이 가려지지 않게 해요
function useBottomBanner(show) {
  const shown = useRef(false);
  const created = useRef(false);
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const sub = AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
      const h = shown.current ? Math.round(size?.height || 0) : 0;
      // 배너와 화면 내용 사이 12px 띄워서 실수로 누르지 않게 해요
      document.body.style.paddingBottom = h ? \`\${h + 12}px\` : "";
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
          if (cancelled) return;
          shown.current = true;
          if (!created.current) {
            created.current = true;
            await AdMob.showBanner({ adId: BANNER_AD_ID, adSize: BannerAdSize.ADAPTIVE_BANNER, position: BannerAdPosition.BOTTOM_CENTER, margin: 0, isTesting: AD_TESTING });
          } else await AdMob.resumeBanner();
        } else if (created.current) {
          shown.current = false;
          document.body.style.paddingBottom = "";
          await AdMob.hideBanner();
        }
      } catch (e) {
        // 광고를 못 불러와도 앱은 그대로 써요
        if (show) created.current = false;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [show]);
}

// 중기부 보도자료 RSS`,
  ],
  [
    "  const [typing, setTyping] = useState(false);\n",
    `  const [typing, setTyping] = useState(false);
  // 하단 탭이 없는 화면에만 광고 배너 (키보드가 올라와 있을 때는 숨겨요)
  useBottomBanner(!NO_AD_VIEWS.includes(screen.view) && !typing);
`,
  ],
]);

edit("android/app/src/main/res/values/strings.xml", [
  ['<string name="app_name">사장줍줍</string>', '<string name="app_name">사장줍줍</string>\n    <!-- AdMob 앱 ID (지금은 구글 테스트용, 계정 만들면 진짜 번호로) -->\n    <string name="admob_app_id">ca-app-pub-3940256099942544~3347511713</string>'],
]);
edit("android/app/src/main/AndroidManifest.xml", [
  [
    "    </application>",
    `        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="@string/admob_app_id" />
    </application>`,
  ],
]);
console.log("ok");
