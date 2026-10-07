// 2026-10-07 리뷰 부탁 창: 여러 번 쓴 사용자에게만 종료 시 보여주고, 리뷰를 남기러 간 사용자에게는 다시 안 보여요
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 70));
  s = s.replace(a, b);
};

// 1) 사용 기록·리뷰 부탁 조건
rep(
  "function ExitDialog({ onCancel, onExit, onReview }) {",
  `// 리뷰 부탁 — 이 휴대폰에만 저장 (앱 쓴 날짜, 연 횟수, 부탁한 횟수, 리뷰 남기러 갔는지)
const REVIEW_KEY = "reviewAsk";
const REVIEW_RULE = { minDays: 3, minOpens: 5, maxAsks: 3, gapDays: 7 };
const loadReview = () => {
  try {
    return { days: [], opens: 0, asks: 0, lastAsk: 0, done: false, ...JSON.parse(localStorage.getItem(REVIEW_KEY) || "{}") };
  } catch (e) {
    return { days: [], opens: 0, asks: 0, lastAsk: 0, done: false };
  }
};
const saveReview = (r) => {
  try {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(r));
  } catch (e) {
    // 저장 못 해도 괜찮아요
  }
};
// 앱을 열 때마다 한 번 기록
const recordAppOpen = () => {
  const r = loadReview();
  const today = formatLocalDate(new Date());
  r.opens += 1;
  if (!r.days.includes(today)) r.days = [...r.days, today].slice(-30);
  saveReview(r);
};
// 지금 리뷰를 부탁해도 될까? (여러 날·여러 번 쓴 사용자, 최대 3번, 7일 간격, 리뷰 남기러 갔으면 다시 안 함)
const shouldAskReview = () => {
  const r = loadReview();
  return !r.done && r.days.length >= REVIEW_RULE.minDays && r.opens >= REVIEW_RULE.minOpens && r.asks < REVIEW_RULE.maxAsks && Date.now() - r.lastAsk > REVIEW_RULE.gapDays * 864e5;
};
const markReviewAsked = () => {
  const r = loadReview();
  saveReview({ ...r, asks: r.asks + 1, lastAsk: Date.now() });
};
const markReviewDone = () => saveReview({ ...loadReview(), done: true });

// 리뷰 부탁 창 (종료할 때, 조건 맞을 때만) — 광고 없이 부탁에만 집중
// 구글 정책: 만족한 사람만 골라 리뷰로 보내면 안 돼요 → 질문으로 거르지 않고, 누구에게나 같은 부탁
function ReviewAskDialog({ callName, stats, onExit, onReview, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4" style={{ zIndex: 70, background: "rgba(20,24,36,0.55)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full rounded-[26px] bg-white px-5 pt-7 pb-4 text-center" style={{ maxWidth: 340, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
        <img src="/icons/icon-192.png" alt="" className="w-[68px] h-[68px] mx-auto rounded-[20px]" style={{ boxShadow: "0 8px 18px rgba(214,140,20,0.25)" }} />
        <div className="flex justify-center gap-1 mt-3.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={22} fill="#FFC23D" strokeWidth={0} />
          ))}
        </div>
        <p className="text-[17px] font-extrabold mt-3 break-keep leading-snug" style={{ color: TEXT }}>
          {callName}, 사장줍줍이 도움이 되셨다면
          <br />
          별점 한 번 부탁드려요 🙏
        </p>
        <p className="text-[12.5px] mt-2 break-keep" style={{ color: MUTED }}>남겨주신 리뷰는 다른 사장님이 지원금을 찾는 데 큰 힘이 돼요</p>
        {(stats.fav > 0 || stats.events > 0) && (
          <div className="flex justify-center flex-wrap gap-1.5 mt-3.5">
            {stats.fav > 0 && (
              <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#FFF4DE", color: "#B26A00" }}>📌 줍줍한 지원금 {stats.fav}개</span>
            )}
            {stats.events > 0 && (
              <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#FFF4DE", color: "#B26A00" }}>📅 챙긴 일정 {stats.events}개</span>
            )}
          </div>
        )}
        <div className="flex gap-2 mt-6">
          <button onClick={onExit} className="flex-1 py-3.5 rounded-2xl text-[14px] font-bold" style={{ background: "#F1F3F8", color: MUTED }}>
            나가기
          </button>
          <button onClick={onReview} className="flex-[1.4] py-3.5 rounded-2xl text-[14px] font-bold flex items-center justify-center gap-1" style={BTN_PRIMARY}>
            <Star size={14} fill="white" strokeWidth={0} /> 리뷰 남기기
          </button>
        </div>
      </div>
    </div>
  );
}

function ExitDialog({ onCancel, onExit }) {`
);

// 2) 평소 종료 창: 나가기 · 취소
rep(
  `        {/* 나가기 · 취소 · 리뷰하기 */}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 px-4 pb-4" style={{ height: 76, alignItems: "flex-end" }}>
          <button onClick={onExit} className="flex-1 min-w-0 py-3.5 rounded-2xl text-[14px] font-bold whitespace-nowrap" style={{ background: "#F1F3F8", color: MUTED }}>
            나가기
          </button>
          <button onClick={onCancel} className="flex-1 min-w-0 py-3.5 rounded-2xl text-[14px] font-bold whitespace-nowrap" style={{ background: "#F1F3F8", color: TEXT }}>
            취소
          </button>
          <button onClick={onReview} className="flex-1 min-w-0 py-3.5 rounded-2xl text-[14px] font-bold whitespace-nowrap flex items-center justify-center gap-1" style={BTN_PRIMARY}>
            <Star size={14} fill="white" strokeWidth={0} /> 리뷰하기
          </button>
        </div>`,
  `        {/* 나가기 · 취소 */}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 px-4 pb-4" style={{ height: 76, alignItems: "flex-end" }}>
          <button onClick={onExit} className="flex-1 min-w-0 py-3.5 rounded-2xl text-[14.5px] font-bold whitespace-nowrap" style={{ background: "#F1F3F8", color: MUTED }}>
            나가기
          </button>
          <button onClick={onCancel} className="flex-1 min-w-0 py-3.5 rounded-2xl text-[14.5px] font-bold whitespace-nowrap" style={BTN_PRIMARY}>
            취소
          </button>
        </div>`
);

// 3) 앱: 열 때 기록, 종료 시 리뷰 창 또는 종료 창
rep(
  "  const [exitOpen, setExitOpen] = useState(false);\n",
  `  const [exitOpen, setExitOpen] = useState(false); // false | "exit" | "review"
  useEffect(() => {
    recordAppOpen();
  }, []);
`
);
rep(
  "    setExitOpen(true);\n  };",
  `    // 여러 번 쓴 사용자에게는 가끔 리뷰 부탁 창, 아니면 평소 종료 창
    if (shouldAskReview()) {
      markReviewAsked();
      setExitOpen("review");
    } else setExitOpen("exit");
  };`
);
rep(
  `      {exitOpen && (
        <ExitDialog
          onCancel={() => setExitOpen(false)}
          onReview={() => {
            setExitOpen(false);
            openStoreReview();
          }}
          onExit={async () => {
            await removeAd();
            CapApp.exitApp();
          }}
        />
      )}`,
  `      {exitOpen === "exit" && (
        <ExitDialog
          onCancel={() => setExitOpen(false)}
          onExit={async () => {
            await removeAd();
            CapApp.exitApp();
          }}
        />
      )}
      {exitOpen === "review" && (
        <ReviewAskDialog
          callName={callName}
          stats={{ fav: favCount, events: myEvents.length }}
          onClose={() => setExitOpen(false)}
          onExit={() => CapApp.exitApp()}
          onReview={() => {
            markReviewDone(); // 리뷰 남기러 간 사용자에게는 다시 안 물어봐요
            setExitOpen(false);
            openStoreReview();
          }}
        />
      )}`
);
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));
console.log("ok");
