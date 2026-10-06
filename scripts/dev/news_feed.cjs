// 2026-10-06 정책뉴스 방향: ① 핵심 뉴스(직접 고른 요약 기사, 주제 다양화) + ② 중기부 보도자료 실시간(RSS)
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 90));
  s = s.replace(a, b);
};

// ---------- 1) 핵심 뉴스 3건 추가 (고정비·디지털·인건비) ----------
rep(
  "const NEWS = [\n",
  `const NEWS = [
  {
    id: "m5",
    image: "https://www.korea.kr/newsWeb/resources/attaches/2026.10/06/700f105bfd29890064fd37d9aee6ef8a.jpg",
    imageSource: "대한민국 정책브리핑",
    title: "유류세 인하 11월 말까지 연장 — 경유·LPG(부탄) 25% 인하 유지",
    source: "대한민국 정책브리핑",
    date: "2026.10.06",
    category: "고정비",
    readTime: "1분",
    summary: "배달·화물 등 차량을 쓰는 사장님의 연료비 부담을 덜어주는 유류세 인하가 2개월 더 이어져요.",
    bullets: [
      "휘발유 15% 인하 (리터당 122원↓)",
      "경유 25% 인하 (리터당 145원↓), 부탄(LPG) 25% 인하 (리터당 51원↓)",
      "2026년 11월 30일까지 2개월 추가 연장",
    ],
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148973025",
  },
  {
    id: "m6",
    image: "https://www.korea.kr/newsWeb/resources/attaches/2026.09/29/fac35bd87b21f397b70cdc4b9cd8dfb4.jpg",
    imageSource: "대한민국 정책브리핑",
    title: "강원 소상공인에 'AI 안심경영' 서비스 — 근로계약서 자동 작성·노무 상담",
    source: "행정안전부",
    date: "2026.09.29",
    category: "디지털",
    readTime: "2분",
    summary: "강원도 소상공인은 AI로 업종별 표준근로계약서를 만들고, 노무·법률 상담과 맞춤 정책 안내를 받을 수 있게 돼요.",
    bullets: [
      "업종별 표준근로계약서 자동 작성, 빠진 필수 항목도 확인",
      "AI 챗봇 기본 상담 + 필요하면 전문가(노무·법률) 연결",
      "내 가게에 맞는 지원 정책도 함께 안내",
      "강원특별자치도에서 올해 말부터 제공 (경북은 주민 정착 지원 AI 서비스)",
    ],
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148972766",
  },
  {
    id: "m7",
    image: "https://www.korea.kr/newsWeb/resources/attaches/2026.07/15/21c9ef1f4ebef2efa14781bc6986ea27.jpg",
    imageSource: "대한민국 정책브리핑",
    title: "2027년 최저임금 시간당 1만 700원 확정 — 올해보다 3.7% 인상",
    source: "고용노동부",
    date: "2026.08.05",
    category: "인건비",
    readTime: "1분",
    summary: "내년 1월 1일부터 모든 사업장에 시간당 10,700원이 적용돼요. 직원 월급과 아르바이트 시급을 미리 점검해 두세요.",
    bullets: [
      "2027년 최저임금 시간급 10,700원 (올해 10,320원보다 380원, 3.7% 인상)",
      "월 환산액 2,236,300원 (주 40시간, 월 209시간 기준)",
      "업종 구분 없이 모든 사업장에 똑같이 적용",
      "2027년 1월 1일부터 효력",
    ],
    url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=19744",
  },
`
);
rep('const NEWS_CATEGORIES = ["전체", "정책자금", "고정비", "지역·상권", "세제·제도", "디지털"];', 'const NEWS_CATEGORIES = ["전체", "정책자금", "고정비", "인건비", "지역·상권", "세제·제도", "디지털"];');
rep('  "세제·제도": { bg: GOLD_SOFT, color: GOLD },', '  "세제·제도": { bg: GOLD_SOFT, color: GOLD },\n  인건비: { bg: "#FCE8F1", color: "#C23B7A" },');
rep('  "세제·제도": newsTaxImg,', '  "세제·제도": newsTaxImg,\n  인건비: newsFixedImg,');

// ---------- 2) 중기부 보도자료 실시간 (RSS) ----------
rep(
  "// 최신순 (날짜가 같으면 위에 적은 순서)\n",
  `// 중기부 보도자료 RSS — 최신 20건 중 소상공인 관련만 보여줘요 (앱에서는 네이티브 통신이라 사이트 제한 없이 받아요)
const MSS_RSS_URL = "https://www.mss.go.kr/rss/smba/board/86.do";
const MSS_LIST_URL = "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=86";
const MSS_FEED_KEY = "mssFeed";
const MSS_KEYWORDS = /소상공인|자영업|전통시장|상권|상점가|온누리|골목|가게|점포|폐업|재기|소공인|상인|바우처|정책자금|긴급경영|플랫폼 입점|배달/;
function parseMssRss(xml) {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  return [...doc.querySelectorAll("item")]
    .map((it) => {
      const t = (sel) => (it.querySelector(sel)?.textContent || "").trim();
      const d = t("pubDate"); // 20261006091605
      return { title: t("title"), link: t("link"), date: d.length >= 8 ? \`\${d.slice(0, 4)}.\${d.slice(4, 6)}.\${d.slice(6, 8)}\` : "" };
    })
    .filter((x) => x.title && x.link);
}
function MssPressFeed() {
  const [state, setState] = useState(() => {
    try {
      const c = JSON.parse(localStorage.getItem(MSS_FEED_KEY));
      if (c?.items) return { items: c.items, savedAt: c.savedAt, status: "cached" };
    } catch (e) {
      // 저장된 게 없어도 괜찮아요
    }
    return { items: [], status: "loading" };
  });
  useEffect(() => {
    // 6시간 안에 받아둔 게 있으면 다시 받지 않아요
    if (state.savedAt && Date.now() - state.savedAt < 6 * 3600e3) return;
    let alive = true;
    (async () => {
      try {
        const xml = Capacitor.isNativePlatform()
          ? (await CapacitorHttp.get({ url: MSS_RSS_URL, responseType: "text", connectTimeout: 8000, readTimeout: 8000 })).data
          : await (await fetch(MSS_RSS_URL)).text();
        const items = parseMssRss(xml).filter((x) => MSS_KEYWORDS.test(x.title)).slice(0, 6);
        if (!items.length) throw new Error("empty");
        const savedAt = Date.now();
        try {
          localStorage.setItem(MSS_FEED_KEY, JSON.stringify({ items, savedAt }));
        } catch (e) {
          // 저장 안 돼도 화면엔 보여줘요
        }
        if (alive) setState({ items, savedAt, status: "ok" });
      } catch (e) {
        if (alive) setState((p) => ({ ...p, status: p.items.length ? "cached" : "fail" }));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  // 핵심 뉴스로 요약해 둔 보도자료는 앱 안 요약 화면으로
  const summarized = (link) => NEWS.find((n) => n.url === link);
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-1 h-4 rounded-full" style={{ background: BLUE }} />
        <p className="text-[15px] font-bold flex-1" style={{ color: TEXT }}>중기부 최신 보도자료</p>
        {state.items.length > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: state.status === "ok" ? GREEN : MUTED }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: state.status === "ok" ? GREEN : "#C3C8D4" }} />
            {state.status === "ok" ? "방금 확인" : "저장된 목록"}
          </span>
        )}
      </div>
      <div className="rounded-[20px] overflow-hidden" style={CARD}>
        {state.status === "loading" && state.items.length === 0 && (
          <p className="text-[12.5px] text-center py-6" style={{ color: MUTED }}>보도자료를 불러오는 중…</p>
        )}
        {state.status === "fail" && (
          <p className="text-[12.5px] text-center py-6 px-4 break-keep" style={{ color: MUTED }}>지금은 보도자료를 불러올 수 없어요. 아래 버튼으로 중기부 사이트에서 확인하세요.</p>
        )}
        {state.items.map((x, i) => {
          const n = summarized(x.link);
          const fresh = (TODAY - newsDate(x.date)) / 864e5 <= 3;
          const body = (
            <>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] tabular-nums" style={{ color: MUTED }}>{x.date}</span>
                  {fresh && <span className="text-[10px] font-extrabold px-1.5 rounded-full text-white" style={{ background: RED }}>NEW</span>}
                  {n && <span className="text-[10px] font-bold px-1.5 rounded-full" style={{ background: BLUE_SOFT, color: BLUE }}>요약 있음</span>}
                </span>
                <span className="block text-[13px] font-semibold leading-snug line-clamp-2 break-keep" style={{ color: TEXT }}>{x.title}</span>
              </span>
              {n ? <ChevronRight size={15} color="#B5BAC8" className="shrink-0" /> : <ExternalLink size={13} color="#B5BAC8" className="shrink-0" />}
            </>
          );
          const cls = "w-full text-left flex items-center gap-2 px-4 py-3";
          const st = i > 0 ? { borderTop: "1px solid #F1F2F6" } : undefined;
          return n ? (
            <button key={x.link} onClick={() => window.__openNews?.(n.id)} className={cls} style={st}>{body}</button>
          ) : (
            <a key={x.link} href={x.link} target="_blank" rel="noopener noreferrer" className={cls} style={st}>{body}</a>
          );
        })}
      </div>
      <a href={MSS_LIST_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 mt-2 py-2 text-[12px] font-semibold" style={{ color: BLUE }}>
        중기부 보도자료 전체 보기 <ExternalLink size={11} />
      </a>
    </div>
  );
}
// 최신순 (날짜가 같으면 위에 적은 순서)
`
);
rep('import { Capacitor } from "@capacitor/core";', 'import { Capacitor, CapacitorHttp } from "@capacitor/core";');

// 뉴스 탭: 주요 소식 아래에 실시간 보도자료 (전체 보기일 때만)
rep(
  `            {rest.length > 0 && (
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1 h-4 rounded-full" style={{ background: "#7A46D6" }} />
                <p className="text-[15px] font-bold" style={{ color: TEXT }}>최신 소식</p>`,
  `            {newsCategory === "전체" && <MssPressFeed />}

            {rest.length > 0 && (
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1 h-4 rounded-full" style={{ background: "#7A46D6" }} />
                <p className="text-[15px] font-bold" style={{ color: TEXT }}>핵심 뉴스</p>`
);
// 요약 있음 → 앱 안 기사 화면으로 열기
rep(
  `        const newsCount = (c) => (c === "전체" ? NEWS.length : NEWS.filter((n) => n.category === c).length);`,
  `        const newsCount = (c) => (c === "전체" ? NEWS.length : NEWS.filter((n) => n.category === c).length);
        window.__openNews = (id) => setScreen({ view: "newsDetail", id });`
);
// 맨 아래 중복 링크 정리 (보도자료 섹션에 이미 있어요)
rep(`              href="https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=86"`, `              href="https://www.korea.kr/news/policyNewsList.do"`);
rep(`              중기부 보도자료 더 보기 <ExternalLink size={12} />`, `              정책브리핑에서 더 많은 정책뉴스 보기 <ExternalLink size={12} />`);
rep(
  `              * 중소벤처기업부 보도자료와 정부 공식 공고를 중심으로 요약했어요. 신청 조건·기간은 바뀔 수 있으니 원문에서 꼭 확인하세요.`,
  `              * 핵심 뉴스는 정부 발표를 쉽게 요약한 것이고, 중기부 보도자료는 중기부 사이트에서 바로 받아와요. 신청 조건·기간은 바뀔 수 있으니 원문에서 꼭 확인하세요.`
);

// 개인정보처리방침(앱)
rep(
  "뉴스 대표 사진 표시를 위해 각 기사 원문 사이트를 호출해요.",
  "뉴스 대표 사진 표시를 위해 각 기사 원문 사이트를, 최신 보도자료 목록을 위해 중소벤처기업부 RSS(mss.go.kr)를 호출해요."
);
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));
const p = "public/privacy.html";
let h = fs.readFileSync(p, "utf8");
const a = h.match(/([ \t]*)<li>뉴스 대표 사진: [^\n]*\n/);
if (!a) throw new Error("privacy");
if (!h.includes("보도자료 목록")) h = h.replace(a[0], a[0] + `${a[1]}<li>최신 보도자료 목록: 중소벤처기업부 RSS (mss.go.kr)</li>\n`);
fs.writeFileSync(p, h);
console.log("ok");
