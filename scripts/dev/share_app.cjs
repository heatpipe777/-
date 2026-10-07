// 2026-10-07 앱 추천 공유: MY 메뉴, 리뷰 부탁 창, 지원금 공유·계산 결과 복사에 Play 스토어 주소
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 70));
  s = s.replace(a, b);
};

// 1) 앱 추천 공유 함수 (지원금 공유 함수 바로 위)
rep(
  "// 지원금 정보를 카카오톡·문자 등으로 보내요 (앱: 안드로이드 공유창, 웹: 공유 또는 복사)",
  `// 받아가게 앱을 동료 사장님께 추천해요 (출시 전에는 스토어 주소가 "찾을 수 없음"으로 보여요)
const SHARE_APP_TEXT = [
  "사장님, 받을 수 있는 지원금 놓치고 있진 않으세요? 💰",
  "지원금·정책자금 마감일과 세금 신고일을 미리 알려주는 앱이에요.",
  "",
  "👉 받아가게 무료 설치",
].join("\\n");
async function shareApp() {
  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({ title: "받아가게", text: SHARE_APP_TEXT, url: STORE_WEB_URL, dialogTitle: "받아가게 알려주기" });
    } else if (navigator.share) {
      await navigator.share({ title: "받아가게", text: SHARE_APP_TEXT, url: STORE_WEB_URL });
    } else {
      await copyText(\`\${SHARE_APP_TEXT}\\n\${STORE_WEB_URL}\`);
      alert("추천 문구를 복사했어요. 원하는 곳에 붙여넣기 하세요.");
    }
  } catch (e) {
    // 공유창을 닫은 경우 — 아무것도 하지 않아요
  }
}

// 지원금 정보를 카카오톡·문자 등으로 보내요 (앱: 안드로이드 공유창, 웹: 공유 또는 복사)`
);

// 2) 지원금 공유 링크 → Play 스토어
rep(
  `    "자세한 조건은 받아가게에서 확인하세요 👇",
  ].join("\\n");
  const url = "https://sosanggongin.vercel.app";`,
  `    "자세한 조건은 받아가게 앱에서 확인하세요 👇",
  ].join("\\n");
  const url = STORE_WEB_URL;`
);

// 3) 계산 결과 복사 끝에 한 줄
rep(
  "const text = [`[받아가게 계산기] ${title}`, ...rows.map((r) => `· ${r.label}: ${r.value}`)].join(\"\\n\");",
  "const text = [`[받아가게 계산기] ${title}`, ...rows.map((r) => `· ${r.label}: ${r.value}`), \"\", `받아가게 앱에서 무료로 계산해 보세요 👉 ${STORE_WEB_URL}`].join(\"\\n\");"
);

// 4) 리뷰 부탁 창: 리뷰 대신 공유도
rep(
  `            <Star size={14} fill="white" strokeWidth={0} /> 리뷰 남기기
          </button>
        </div>
      </div>`,
  `            <Star size={14} fill="white" strokeWidth={0} /> 리뷰 남기기
          </button>
        </div>
        <button onClick={shareApp} className="mt-3 text-[12.5px] font-semibold inline-flex items-center gap-1 px-2 py-1.5" style={{ color: MUTED }}>
          <Share2 size={13} /> 동료 사장님께 알려주기
        </button>
      </div>`
);

// 5) MY: 추천 카드 (약관·정보 위)
rep(
  `          <p className="text-[13px] font-bold mb-2.5 px-1 mt-4" style={{ color: TEXT }}>약관·정보</p>`,
  `          <button
            onClick={shareApp}
            className="w-full text-left rounded-[22px] px-4 py-3.5 mt-1 mb-5 flex items-center gap-3 active:scale-[0.99] transition-transform"
            style={{ ...CARD, background: "linear-gradient(135deg, #FFF4DE 0%, #FFFFFF 75%)", border: "1px solid #FBE3B5" }}
          >
            <span className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-[22px]" style={{ background: "#FFE7B3" }}>📣</span>
            <span className="flex-1 min-w-0">
              <span className="block text-[14.5px] font-bold" style={{ color: TEXT }}>동료 사장님께 알려주기</span>
              <span className="block text-[12px] break-keep" style={{ color: MUTED }}>카카오톡·문자로 받아가게를 추천해요</span>
            </span>
            <Share2 size={17} color="#C98A0B" className="shrink-0" />
          </button>

          <p className="text-[13px] font-bold mb-2.5 px-1 mt-4" style={{ color: TEXT }}>약관·정보</p>`
);
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));
console.log("ok");
