// 2026-10-06 정책뉴스 갱신: 출처 불명확한 블로그·카드사 글 제거, 중기부 최신 보도자료로 교체, 화면 개선
const fs = require("fs");
const f = "src/App.jsx";
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const rep = (a, b) => {
  if (s.split(a).length !== 2) throw new Error("nf " + a.slice(0, 90));
  s = s.replace(a, b);
};

// ---------- 1) 뉴스 데이터 ----------
const n1Start = s.indexOf("const NEWS = [\n");
const n1End = s.indexOf("\n];\n", n1Start) + 4;
if (n1Start < 0) throw new Error("NEWS");
const oldNews = s.slice(n1Start, n1End);
// n1(정책자금 융자 공고)은 사진·내용을 그대로 쓰고 날짜·주요 소식 표시만 바꿔요
const n1Block = oldNews.slice(oldNews.indexOf('  {\n    id: "n1",'), oldNews.indexOf('  {\n    id: "n2",'));
const n1Fixed = n1Block.replace('    date: "2026 연간 공고",\n', '    date: "2025.12.29",\n').replace("    featured: true,\n", "");
const MSS = (id) => `https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=86&bcIdx=${id}`;
const newNews = `// 정책 뉴스 — 정부 보도자료·공식 공고 위주 (마지막 확인: NEWS_UPDATED)
// 새 소식은 앱 업데이트 때 추가해요. 날짜는 "YYYY.MM.DD" (최신순 정렬·NEW 표시에 써요)
const NEWS_UPDATED = "2026.10.06";
const NEWS = [
  {
    id: "m1",
    title: "거제·통영 특별재난지역 소상공인 정책자금, 금리 1.5%·한도 3억 원으로",
    source: "중소벤처기업부",
    date: "2026.10.06",
    category: "정책자금",
    readTime: "2분",
    summary: "특별재난지역으로 선포된 거제·통영의 피해 소상공인은 긴급경영안정자금을 더 낮은 금리로, 더 많이, 더 오래 빌릴 수 있어요.",
    bullets: [
      "소상공인 긴급경영안정자금 금리 2.0% → 1.5% (직접대출 기준, 대리대출은 1.4% 고정)",
      "대출 한도 최대 1억 원 → 최대 3억 원",
      "상환기간 5년 → 10년 (5년 거치 후 5년 나눠 갚기)",
      "신청 전에 관할 시·군에 피해 신고를 하고 재해확인증을 받아야 해요",
    ],
    contacts: [
      { label: "소상공인 1533-0100", tel: "1533-0100" },
      { label: "중소기업 1811-3655", tel: "1811-3655" },
    ],
    url: "${MSS(1071601)}",
  },
  {
    id: "m2",
    title: "온누리상품권 18년 만에 개편 — 전통시장·지방 골목상권 혜택 커진다",
    source: "중소벤처기업부",
    date: "2026.10.01",
    category: "지역·상권",
    featured: true,
    readTime: "3분",
    summary: "온누리상품권이 전통시장과 지방 골목상권 중심으로 바뀌어요. 손님 혜택이 커지고, 가맹 혜택은 영세 상인에게 집중돼요.",
    bullets: [
      "전통시장에서 쓰면 구매 때 5% 할인 + 사용 후 5% 환급, 총 10% 혜택 (2027년 시행)",
      "지방 골목상권에서 쓰면 5% 할인 + 3% 환급, 총 8% 혜택",
      "골목형상점가 지정 기준을 지방 재정 여건에 맞춰 완화 (재정자립도 하위 지역은 점포 15개 이상)",
      "기업형 슈퍼마켓(SSM) 등은 가맹점 등록·갱신을 제한해 영세 상인에게 혜택 집중",
    ],
    url: "${MSS(1071532)}",
  },
  {
    id: "m3",
    title: "티메프 피해 소상공인, 정책자금 상환기간 최대 7년 연장",
    source: "중소벤처기업부",
    date: "2026.09.22",
    category: "정책자금",
    readTime: "2분",
    summary: "티몬·위메프 정산 지연으로 피해를 입은 사업자가 정책자금을 갚기 어렵다면, 상환기간 연장 같은 맞춤 채무조정을 받을 수 있어요.",
    bullets: [
      "대상: 정상 상환 중이거나 연체 30일 이하인 피해 소상공인 중 일시적으로 경영이 어려운 곳",
      "소상공인시장진흥공단 정책자금 상환기간을 최대 7년까지 연장",
      "폐업 후 직장인으로 전환한 경우 1년 근속하면 금리 0.5%p 감면",
      "중소기업은 중진공에서 원금 상환 비율 조정·상환 유예 지원",
    ],
    contacts: [
      { label: "소상공인 1533-0100", tel: "1533-0100" },
      { label: "중소기업 1811-3655", tel: "1811-3655" },
    ],
    url: "${MSS(1071372)}",
  },
  {
    id: "m4",
    title: "「소상공인기본법」 개정안 국무회의 통과 — 진짜 영세 소상공인에게 지원 집중",
    source: "중소벤처기업부",
    date: "2026.09.22",
    category: "세제·제도",
    readTime: "2분",
    summary: "정부가 국세청 소득·비용 자료까지 활용해, 여러 점포를 가진 사업자나 부업 사업자가 아닌 실제 영세 소상공인을 가려 지원할 수 있게 돼요.",
    bullets: [
      "중기부가 국세청·고용노동부에 소득·비용 정보를 요청할 수 있는 근거 마련",
      "점포가 여러 개인 '다중사업자', 직장인 '부업사업자'를 구분해 지원 대상 정확히 파악",
      "사업자 단위 지원 때문에 생기던 중복 지원 문제 해소",
      "지금은 국무회의 의결 단계예요 — 국회를 통과해야 시행돼요",
    ],
    url: "${MSS(1071342)}",
  },
  {
    id: "n5",
    title: "울산시, 중소기업·소상공인에 760억 원 규모 경영안정자금 지원",
    source: "한국시사경제",
    date: "2026.09.06",
    category: "지역·상권",
    readTime: "2분",
    summary: "울산시가 4차 소상공인 경영안정자금 지원계획을 공고했어요. 9월 10일부터 선착순으로 받고 있고, 예산이 소진되면 마감돼요.",
    bullets: [
      "울산시, 4차 소상공인 경영안정자금 지원계획 공고",
      "총 760억 원 규모로 중소기업·소상공인 대상 지원",
      "9월 10일부터 선착순 접수 — 예산 소진 시 조기 마감",
    ],
    programId: 17,
    url: "https://hksisaeconomy.com/news/article.html?no=1229062",
  },
  {
    id: "n4",
    image: "https://www.korea.kr/newsWeb/resources/attaches/2026.07/01/633cc081876773dfc4caee297fdbc63e.jpg",
    title: "2026년 하반기부터 이렇게 달라져요 — 노란우산공제 납입한도 연 1,800만 원으로",
    source: "대한민국 정책브리핑",
    date: "2026.07.02",
    category: "세제·제도",
    readTime: "2분",
    summary: "하반기에 바뀌는 제도 중 소상공인과 관련된 내용이에요. 노란우산공제에 한 해 더 많이 넣을 수 있게 됐어요.",
    bullets: [
      "노란우산공제 납입한도: 분기 300만 원 → 연 1,800만 원으로 확대",
      "공제부금 소득공제 한도는 사업소득금액에 따라 200만~600만 원",
      "중고차 매매·수출업자는 매입세액공제 특례 공제한도 신설",
    ],
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148967417",
  },
  {
    id: "n3",
    title: "영세 소상공인 고정비 부담 던다 — 경영안정 바우처 최대 25만 원",
    source: "중소벤처기업부",
    date: "2026.01.27",
    category: "고정비",
    readTime: "2분",
    summary: "공과금·4대보험료 같은 고정비에 쓸 수 있는 바우처를 사업체당 최대 25만 원 지원해요. 12월 18일까지 신청할 수 있어요.",
    bullets: [
      "대상: 연매출 1억 400만 원 미만, 2025년 12월 31일 이전 개업해 영업 중인 소상공인",
      "사업체당 최대 25만 원 — 전기·가스·수도요금, 4대보험료, 차량 연료비 등에 사용",
      "신청: 소상공인경영안정바우처.kr 또는 소상공인24 (12월 18일 18시까지)",
      "바우처는 2026년 12월 31일까지 써야 해요",
    ],
    contacts: [{ label: "바우처 콜센터 1533-0600", tel: "1533-0600" }],
    programId: "voucher",
    url: "${MSS(1065091)}",
  },
${n1Fixed}];
// 최신순 (날짜가 같으면 위에 적은 순서)
NEWS.sort((a, b) => b.date.localeCompare(a.date));
const newsDate = (d) => parseLocalDate(d.replaceAll(".", "-"));
`;
s = s.slice(0, n1Start) + newNews + s.slice(n1End);

// 분류 이름: 세제 → 세제·제도, 지역 → 지역·상권
rep('const NEWS_CATEGORIES = ["전체", "정책자금", "고정비", "세제", "지역", "디지털"];', 'const NEWS_CATEGORIES = ["전체", "정책자금", "고정비", "지역·상권", "세제·제도", "디지털"];');
rep("  세제: { bg: GOLD_SOFT, color: GOLD },\n  지역: {", '  "세제·제도": { bg: GOLD_SOFT, color: GOLD },\n  "지역·상권": {');
rep("  세제: newsTaxImg,\n  지역: newsRegionImg,", '  "세제·제도": newsTaxImg,\n  "지역·상권": newsRegionImg,');
rep("// 실제 확인한 소상공인 관련 정책 뉴스 (출처: 대한민국 정책브리핑, 한국시사경제)\n", "");

// ---------- 2) 뉴스 목록 화면 ----------
rep(
  `        const filteredNews = newsCategory === "전체" ? NEWS : NEWS.filter((n) => n.category === newsCategory);`,
  `        const filteredNews = newsCategory === "전체" ? NEWS : NEWS.filter((n) => n.category === newsCategory);
        // 2주 안에 나온 소식은 NEW 표시
        const isNew = (n) => (TODAY - newsDate(n.date)) / 864e5 <= 14;
        const newsCount = (c) => (c === "전체" ? NEWS.length : NEWS.filter((n) => n.category === c).length);`
);
rep(
  `              {NEWS_CATEGORIES.map((c) => (
                <button`,
  `              {NEWS_CATEGORIES.filter((c) => newsCount(c) > 0 || c === newsCategory).map((c) => (
                <button`
);
rep(
  `                  className="shrink-0 px-3 py-1.5 rounded-full text-[12.5px] font-semibold"
                  style={
                    newsCategory === c
                      ? CHIP_ON
                      : CHIP_OFF
                  }
                >
                  {c}
                  <span className="ml-1 opacity-70">{c === "전체" ? NEWS.length : NEWS.filter((n) => n.category === c).length}</span>`,
  `                  className="shrink-0 px-4 py-2 rounded-full text-[12.5px] font-semibold whitespace-nowrap"
                  style={newsCategory === c ? CHIP_ON : CHIP_OFF}
                >
                  {c}
                  <span className="ml-1 opacity-70 tabular-nums">{newsCount(c)}</span>`
);
rep(
  `            <HeroHeader icon={Newspaper} color="#7A46D6" image={heroNewsImg} title="소상공인 정책 뉴스" subtitle="공식 출처와 주요 매체 기사만" headline="엄선해서 모았어요!" onBack={() => setMainTab("home")} />
`,
  `            <HeroHeader icon={Newspaper} color="#7A46D6" image={heroNewsImg} title="소상공인 정책 뉴스" subtitle="정부 보도자료·공식 공고 중심으로" headline="꼭 필요한 소식만 모았어요!" onBack={() => setMainTab("home")} />
            <p className="flex items-center gap-1 text-[11.5px] -mt-2 mb-3 px-1" style={{ color: MUTED }}>
              <CalendarCheck size={12} /> {NEWS_UPDATED} 기준 · 새 소식은 앱 업데이트 때 추가돼요
            </p>
`
);
// 주요 소식 카드: 날짜 옆 NEW
rep(
  `                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.85)", color: "#5E6577" }}>{featured.date}</span>`,
  `                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.85)", color: "#5E6577" }}>{featured.date}</span>
                      {isNew(featured) && <span className="text-[10.5px] font-extrabold px-1.5 py-0.5 rounded-full text-white" style={{ background: RED }}>NEW</span>}`
);
// 목록 카드: 분류 옆 NEW
rep(
  `                      <span className="inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-full mb-1.5" style={{ background: style.bg, color: style.color }}>{n.category}</span>`,
  `                      <span className="flex items-center gap-1 mb-1.5">
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full" style={{ background: style.bg, color: style.color }}>{n.category}</span>
                        {isNew(n) && <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full text-white" style={{ background: RED }}>NEW</span>}
                      </span>`
);
// 더 보기 링크: 중기부 보도자료 목록
rep(`              href="https://www.korea.kr/"`, `              href="https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=86"`);
rep(`              더 많은 정책 뉴스 보기 (정책브리핑) <ExternalLink size={12} />`, `              중기부 보도자료 더 보기 <ExternalLink size={12} />`);
rep(
  `              * 검색으로 찾은 관련 뉴스가 많았지만, 출처가 불분명한 곳은 제외하고 신뢰할 수 있는 곳만 담았어요.`,
  `              * 중소벤처기업부 보도자료와 정부 공식 공고를 중심으로 요약했어요. 신청 조건·기간은 바뀔 수 있으니 원문에서 꼭 확인하세요.`
);

// ---------- 3) 뉴스 상세: 문의 전화, 앱 속 관련 지원금 ----------
rep("function NewsDetailScreen({ news, allNews, onBack, onSelectNews }) {", "function NewsDetailScreen({ news, allNews, onBack, onSelectNews, onSelectProgram }) {");
rep(
  `      <p className="text-[13px] font-bold mb-2" style={{ color: TEXT }}>원문 기사</p>`,
  `      {/* 앱에 있는 관련 지원금으로 바로 */}
      {(() => {
        const p = news.programId != null && ALL_PROGRAMS.find((x) => x.id === news.programId);
        if (!p) return null;
        return (
          <>
            <p className="text-[13px] font-bold mb-2" style={{ color: TEXT }}>앱에서 바로 보기</p>
            <div className="mb-4">
              <ProgramRow p={p} onClick={() => onSelectProgram(p.id)} />
            </div>
          </>
        );
      })()}

      {news.contacts?.length > 0 && (
        <>
          <p className="text-[13px] font-bold mb-2" style={{ color: TEXT }}>문의 전화</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {news.contacts.map((c) => (
              <a key={c.tel} href={\`tel:\${c.tel}\`} className="flex items-center gap-1 px-3.5 py-2 rounded-full text-[12.5px] font-bold" style={{ background: BLUE_SOFT, color: BLUE }}>
                <Phone size={13} /> {c.label}
              </a>
            ))}
          </div>
        </>
      )}

      <p className="text-[13px] font-bold mb-2" style={{ color: TEXT }}>원문 기사</p>`
);
rep(
  `          onSelectNews={(n) => setScreen({ view: "newsDetail", id: n.id })}
        />`,
  `          onSelectNews={(n) => setScreen({ view: "newsDetail", id: n.id })}
          onSelectProgram={(id) => setScreen({ view: "detail", id })}
        />`
);
fs.writeFileSync(f, s.replace(/\n/g, "\r\n"));
console.log("ok");
