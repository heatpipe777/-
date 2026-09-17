import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Minus,
  Info,
  Users,
  PiggyBank,
  CreditCard,
  Settings,
  CalendarCheck,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Wallet,
  X,
  Zap,
  Home,
  TrendingUp,
  Smartphone,
  Rocket,
  Bell,
  Heart,
  User,
  ExternalLink,
  Phone,
  Newspaper,
  List,
  Clock,
  Landmark,
  AlertTriangle,
  Coins,
  FileText,
  ClipboardCheck,
  Check,
  Calculator,
} from "lucide-react";

const BLUE = "#3D63DD";
const BLUE_SOFT = "#EEF2FE";
const TEXT = "#1F2430";
const MUTED = "#8B93A7";
const BORDER = "#EAEBF1";
const GREEN = "#2F9E63";
const GREEN_SOFT = "#EAF7F0";
const RED = "#E5484D";
const RED_SOFT = "#FDEDED";
const GOLD = "#B8862A";
const GOLD_SOFT = "#FBF3E1";

// 실제 확인한 소상공인 관련 정책 뉴스 (출처: 대한민국 정책브리핑, 한국시사경제)
const NEWS_CATEGORIES = ["전체", "정책자금", "고정비", "세제", "지역", "디지털"];
const NEWS_CATEGORY_STYLE = {
  정책자금: { bg: BLUE_SOFT, color: BLUE },
  고정비: { bg: GREEN_SOFT, color: GREEN },
  세제: { bg: GOLD_SOFT, color: GOLD },
  지역: { bg: "#FDEEE9", color: "#E5674D" },
  디지털: { bg: "#F1ECFC", color: "#7A3FE0" },
};
const NEWS = [
  {
    id: "n1",
    title: "2026년 중소벤처기업부 소상공인 정책자금 융자사업 공고",
    source: "중소벤처기업부",
    date: "2026 연간 공고",
    category: "정책자금",
    featured: true,
    readTime: "3분",
    summary: "일반·특별·긴급 경영안정자금부터 신용취약자금, 대환대출, 재도전특별자금, 청년고용연계자금, 성장기반자금까지 — 올해 소진공이 지원하는 정책자금 전체 종류를 정부가 공식 발표했어요.",
    bullets: [
      "일반·특별·긴급 경영안정자금 등 소진공 정책자금 전체 종류를 한 번에 공고",
      "신용취약자금, 대환대출, 재도전특별자금도 포함돼 있어요",
      "청년고용연계자금·성장기반자금까지 업종·상황별로 골라 신청 가능",
    ],
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=PBLN_000000000117021",
  },
  {
    id: "n2",
    title: "2026년 하반기 소상공인 정부지원금 총정리 — 점포철거비 600만원·착한가격업소 지정 확대",
    source: "정책 동향 브리핑",
    date: "2026.08",
    category: "정책자금",
    readTime: "4분",
    summary: "중기부가 역대 최대인 5.4조원 규모로 하반기 소상공인 지원을 편성했어요. 경영위기 극복(저리 융자), AI·디지털 전환, 사회안전망 강화 3대 축이 핵심이에요.",
    bullets: [
      "중기부, 역대 최대 규모인 5.4조원을 하반기 소상공인 지원에 편성",
      "핵심 축은 경영위기 극복(저리 융자)·AI·디지털 전환·사회안전망 강화 3가지",
      "폐업 소상공인 점포철거비 최대 600만원 지원, 착한가격업소 지정도 확대",
    ],
    url: "https://yamlove77.com/2026%EB%85%84-%ED%95%98%EB%B0%98%EA%B8%B0-%EC%86%8C%EC%83%81%EA%B3%B5%EC%9D%B8-%EC%A0%95%EB%B6%80%EC%A7%80%EC%9B%90%EA%B8%88-6%EB%8C%80-%EC%A0%95%EC%B1%85-%EC%B4%9D%EC%A0%95%EB%A6%AC-%EC%A0%95/",
  },
  {
    id: "n3",
    title: "소상공인 부담경감 크레딧, '경영안정 바우처'로 명칭 개편",
    source: "KB국민카드",
    date: "2026.03",
    category: "고정비",
    readTime: "2분",
    summary: "전기·가스·수도요금, 4대보험료, 통신비, 차량 연료비 같은 고정비 부담을 카드 포인트로 차감해주는 제도예요. 이름만 바뀌고 지원 방식은 기존과 동일해요.",
    bullets: [
      "기존 '부담경감 크레딧'이 '경영안정 바우처'로 이름만 변경",
      "전기·가스·수도요금, 4대보험료, 통신비, 차량 연료비 등에 카드 포인트로 차감 지원",
      "지원 방식·조건은 기존 제도와 동일하게 유지돼요",
    ],
    url: "https://kbthink.com/business/tips/business-support-policy.html",
  },
  {
    id: "n4",
    title: "2026년 하반기부터 이렇게 달라져요 — 노란우산공제 소득공제 확대 등",
    source: "대한민국 정책브리핑",
    date: "2026.08.01",
    category: "세제",
    readTime: "2분",
    summary: "노란우산공제 가입 소상공인의 소득공제 한도가 커지는 등 하반기 바뀌는 제도를 정리한 정부 공식 뉴스예요.",
    bullets: [
      "노란우산공제 가입 소상공인의 소득공제 한도 확대",
      "그 밖에도 2026년 하반기부터 달라지는 세제·행정 제도를 정부가 정리해 공개",
    ],
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148967417",
  },
  {
    id: "n5",
    title: "울산시, 중소기업·소상공인에 760억 원 규모 경영안정자금 지원",
    source: "한국시사경제",
    date: "2026.09.06",
    category: "지역",
    readTime: "2분",
    summary: "울산시가 4차 소상공인 경영안정자금 지원계획을 공고하고 9월 중 신청을 받는다는 지역 뉴스예요.",
    bullets: [
      "울산시, 4차 소상공인 경영안정자금 지원계획 공고",
      "총 760억 원 규모로 중소기업·소상공인 대상 지원",
      "9월 중 신청 접수 예정",
    ],
    url: "https://hksisaeconomy.com/news/article.html?no=1229062",
  },
];

const TODAY = new Date("2026-09-02");
function getDday(deadlineStr) {
  const d = new Date(deadlineStr);
  return Math.ceil((d - TODAY) / (1000 * 60 * 60 * 24));
}
function urgencyColor(dday) {
  if (dday <= 7) return RED;
  if (dday <= 21) return GOLD;
  return GREEN;
}

// 지원금액 텍스트에서 대략적인 숫자를 뽑아내는 함수 (정렬용, 근사치)
function parseAmount(label) {
  if (!label) return 0;
  const match = label.match(/([0-9,]+)\s*(천만원|백만원|만원|원)/);
  if (!match) return 0;
  const num = parseInt(match[1].replace(/,/g, ""), 10);
  if (match[2] === "천만원") return num * 10000000;
  if (match[2] === "백만원") return num * 1000000;
  if (match[2] === "만원") return num * 10000;
  return num;
}

// 세금 신고 일정 — 개인 일반과세자 기준 대략적인 날짜 (간이과세자·법인·성실신고확인대상자는 기한이 달라요)
const TAX_SCHEDULE_BASE = [
  { name: "부가가치세 예정고지·납부", monthDay: "04-25", note: "1기 예정고지분 (고지서로 납부, 별도 신고 없음)" },
  { name: "부가가치세 확정신고·납부", monthDay: "07-25", note: "1기 확정신고 (1~6월분)" },
  { name: "부가가치세 예정고지·납부", monthDay: "10-25", note: "2기 예정고지분 (고지서로 납부, 별도 신고 없음)" },
  { name: "부가가치세 확정신고·납부", monthDay: "01-25", note: "2기 확정신고 (7~12월분)" },
  { name: "종합소득세 신고·납부", monthDay: "05-31", note: "전년도 사업소득 등 종합소득 신고" },
  { name: "사업장현황신고", monthDay: "02-10", note: "면세사업자만 해당" },
];
function nextOccurrenceDate(monthDay) {
  const year = TODAY.getFullYear();
  let d = new Date(`${year}-${monthDay}`);
  if (d < TODAY) d = new Date(`${year + 1}-${monthDay}`);
  return d.toISOString().slice(0, 10);
}
const TAX_SCHEDULE = TAX_SCHEDULE_BASE.map((t) => ({ ...t, deadline: nextOccurrenceDate(t.monthDay) }));

const REGIONS = ["전체", "전국", "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

// 진단(온보딩) 답변과 지원금이 맞는지 대략 판별 (근사치 — 매출·연차 조건은 '경영안정바우처'처럼
// 구조화된 데이터가 있는 항목만 정확히 반영되고, 나머지 예시 항목은 지역만 맞으면 느슨하게 매칭)
function matchesDiagnosis(p, diag) {
  if (!diag) return true;
  const regionOk = p.region === "전국" || p.region === diag.region;
  let revenueOk = true;
  if (p.detailed) revenueOk = diag.revenueBand !== "over140";
  let yearsOk = true;
  if (p.category === "창업") yearsOk = diag.yearsBand === "under1";
  return regionOk && revenueOk && yearsOk;
}

// 시/도별 구·시·군 목록 (2026년 기준 행정구역 전체)
const DISTRICTS = {
  서울: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  부산: ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
  대구: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구", "군위군"],
  인천: ["강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "옹진군", "중구"],
  광주: ["광산구", "남구", "동구", "북구", "서구"],
  대전: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산: ["남구", "동구", "북구", "울주군", "중구"],
  경기: ["가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
  강원: ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
  충북: ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시"],
  충남: ["계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"],
  전북: ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"],
  전남: ["강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
  경북: ["경산시", "경주시", "고령군", "구미시", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"],
  경남: ["거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"],
  제주: ["서귀포시", "제주시"],
};

// 실제 조사된 정확한 정보가 들어간 프로그램 (상세 가이드형)
const DETAILED_PROGRAM = {
  id: "voucher",
  name: "소상공인 경영안정바우처",
  region: "전국",
  category: "고정비",
  amountLabel: "최대 25만원",
  deadline: "2026-12-18",
  detailed: true,
  popularity: 980,
  target: {
    ok: [
      "2025년 12월 31일 이전 개업, 현재 정상 영업 중",
      "2025년 연매출 0원 초과 ~ 1억 400만 원 미만 (국세청 신고 기준)",
      "2025년 신규 개업자는 월평균 매출 × 12개월로 연환산",
    ],
    no: [
      "2025년 신고 매출이 0원인 경우",
      "휴업·폐업 상태 사업자",
      "여러 사업체 운영 시 이미 다른 사업체로 지원받은 경우",
    ],
  },
  amount: { value: "25만 원", note: "사업체당 최대, 카드형 디지털 바우처로 지급 · 사용기한 2026.12.31" },
  usage: { ok: ["전기·가스요금 등 공과금", "4대 보험료", "차량 연료비", "전통시장 화재공제료"], no: ["통신비"] },
  schedule: { apply: "2026.2.9 ~ 12.18", use: "2026.12.31까지" },
  steps: [
    { t: "온라인 신청", d: "'소상공인24' 또는 전용 사이트에서 신청" },
    { t: "자격 확인", d: "국세청 신고 매출액 기준 자동 확인, 별도 서류 없음" },
    { t: "카드 등록", d: "대표자 본인 명의 개인 카드 등록 (법인카드 불가)" },
    { t: "바우처 지급 및 사용", d: "승인 후 등록 카드로 바로 사용 가능" },
  ],
  faq: [
    { q: "카드는 아무거나 등록해도 되나요?", a: "법인카드는 등록할 수 없어요. 대표자 본인 명의의 개인 카드만 가능해요." },
    { q: "서류를 따로 준비해야 하나요?", a: "기본적으로 국세청 신고 매출액으로 판단해요. 2025년 신규 개업자는 연환산 계산이 필요해요." },
  ],
};

// 실제 확인한 전국 공통 정책자금 대출 (출처: 소상공인시장진흥공단 소상공인정책자금 누리집 ols.semas.or.kr, 2026년 기준)
// 대출류는 특정 마감일이 아니라 "매월/매분기 접수 후 예산 소진 시 마감"되는 상시 자금이라 recurring: true로 표시해요
const NATIONAL_LOANS = [
  {
    id: 101,
    name: "일반경영안정자금",
    region: "전국",
    category: "경영",
    target: "소상공인기본법상 소상공인 (세금 체납 없는 정상 영업 사업자)",
    amountLabel: "최대 7,000만원",
    deadline: "2099-12-31",
    recurring: true,
    recurringNote: "직접대출은 매월 첫째주, 예산 소진 시 조기 마감",
    verified: true,
    note: "소진공 직접대출로 신청해요. 2026년 기준금리(분기별 변동, 3분기 3.85%)에 자금별 가산금리가 붙어 연 2.0~5.45% 수준이에요. 정확한 금리·한도는 신청 시점 공고를 확인하세요.",
    popularity: 960,
  },
  {
    id: 102,
    name: "신용취약소상공인 특화자금",
    region: "전국",
    category: "신용",
    target: "대표자 개인신용평점(NCB) 839점 이하 중·저신용 소상공인 (신용관리교육 이수 필요)",
    amountLabel: "최대 3,000만원",
    deadline: "2099-12-31",
    recurring: true,
    recurringNote: "소진공 직접대출, 상시 접수 (예산 소진 시 마감)",
    verified: true,
    note: "은행 문턱이 높은 중·저신용 소상공인을 위한 자금이에요. 통상 대출기간 5년, 신용관리교육 이수가 조건이에요.",
    popularity: 540,
  },
  {
    id: 103,
    name: "저금리 대환대출",
    region: "전국",
    category: "신용",
    target: "고금리 기존 대출을 보유한 중·저신용 소상공인 (NCB 919점 이하)",
    amountLabel: "최대 5,000만원",
    deadline: "2099-12-31",
    recurring: true,
    recurringNote: "소진공 직접대출, 상시 접수 (예산 소진 시 마감)",
    verified: true,
    note: "고금리 대출을 저금리·장기분할상환으로 갈아탈 수 있어요. 2026년부터 대상 신용점수 기준이 완화됐어요.",
    popularity: 715,
  },
  {
    id: 104,
    name: "재도전특별자금",
    region: "전국",
    category: "재기",
    target: "재창업 준비·초기단계, 채무조정 성실 이행 중인 소상공인",
    amountLabel: "최대 7,000만원~2억원 (유형별 상이)",
    deadline: "2099-12-31",
    recurring: true,
    recurringNote: "소진공 직접대출, 상시 접수 (예산 소진 시 마감)",
    verified: true,
    note: "폐업 후 재창업하거나 채무를 성실히 조정 중인 분들을 위한 자금이에요. 기준금리에 +0.4~1.6%p 가산되고 유형별로 한도가 달라요.",
    popularity: 460,
  },
];

// 예시 데이터 (실제 정보로 추후 교체 필요) — verified: true인 항목은 검색으로 실제 확인한 정보
const SAMPLE_PROGRAMS = [
  { id: 1, name: "소상공인 고효율기기 지원사업", region: "전국", category: "에너지", target: "비주거용 전기 사용 소상공인, 고효율가전 교체 희망자", amountLabel: "품목별 구매비 일부 지원", deadline: "2026-12-31", verified: true, note: "한국전력공사가 운영해요. 예산이 소진되면 연중 조기 마감될 수 있어요.", popularity: 640 },
  { id: 2, name: "서울시 중소기업육성자금 (경영안정자금)", region: "서울", category: "보증", target: "서울특별시 소재 사업자등록을 마친 소상공인·중소기업 (융자제한업종 제외)", amountLabel: "자금 종류별 상이 (서울신용보증재단 보증부대출)", deadline: "2099-12-31", recurring: true, recurringNote: "서울신용보증재단 통해 연중 상시 접수, 예산 소진 시 조기 마감", verified: true, note: "경제활성화자금·희망동행자금(대환대출)·서울배달상생자금 등 여러 세부 자금 중 상황에 맞는 걸 골라 신청해요. 정확한 한도·금리는 서울신용보증재단 공고를 확인하세요.", popularity: 810 },
  { id: 3, name: "경기도 소상공인 정책자금", region: "경기", category: "경영", target: "경기도 소재 사업자등록을 마친 소상공인", amountLabel: "최대 5,000만원 (연 2.5%)", deadline: "2099-12-31", recurring: true, recurringNote: "경기신용보증재단 통해 연중 상시 접수, 예산 소진 시 조기 마감", verified: true, note: "일반 정책자금보다 낮은 금리로 운전·시설자금을 지원해요. 정확한 한도·조건은 경기신용보증재단 공고를 확인하세요.", popularity: 520 },
  { id: 4, name: "2026년 스마트상점 기술보급사업", region: "전국", category: "디지털전환", target: "키오스크·서빙로봇·사이니지 등 스마트기술 도입 희망 소상공인", amountLabel: "구입형 최대 700만원 · 렌탈형 연 최대 350만원", deadline: "2026-09-30", verified: true, note: "소상공인시장진흥공단이 연중 여러 차례 회차로 진행해요. 회차마다 접수 일정이 달라요.", popularity: 890 },
  { id: 5, name: "부산 자영업자 청년고용 인건비 지원", region: "부산", category: "고용", target: "부산 소재 자영업체에서 청년을 신규 고용한 소상공인", amountLabel: "1인당 월 180만원, 최대 24개월", deadline: "2099-12-31", recurring: true, recurringNote: "부산시소상공인종합지원센터 통해 연중 공모, 예산 소진 시 조기 마감", verified: true, note: "청년을 신규 채용하면 인건비 일부를 지원받아요. 세부 연령·소득 기준은 회차별 공고를 확인하세요.", popularity: 705 },
  { id: 7, name: "대구·경북 소상공인 경영안정자금 (이차보전)", region: "대구", category: "보증", target: "연 매출 5억원 이하 소상공인 (국세·지방세 체납자, 휴·폐업, 유흥·사치업종 제외)", amountLabel: "대출이자 1~2년간 일부 지원 (신용보증재단 특례보증 연계)", deadline: "2099-12-31", recurring: true, recurringNote: "대구신용보증재단 통해 상·하반기 공고, 예산 소진 시 조기 마감", verified: true, note: "대출 자체가 아니라 대출받을 때 발생하는 이자 일부를 지자체가 보전해줘요. 보증서 발급 후 협약은행에서 대출을 실행해요.", popularity: 430 },
  { id: 8, name: "희망인천 특례보증", region: "인천", category: "보증", target: "인천광역시 소재 소기업·소상공인 (홈플러스 폐점 피해기업 등 포함)", amountLabel: "업체당 최대 5,000만원 + 이자지원(1년차 연 2%, 2~3년차 연 1.5%)", deadline: "2099-12-31", recurring: true, recurringNote: "인천신용보증재단 통해 연중 상시 접수, 예산 소진 시 조기 마감", verified: true, note: "보증기간 6년(1년 거치·5년 분할상환)에 이자까지 지원해줘요. 정확한 대상·한도는 인천신용보증재단 공고를 확인하세요.", popularity: 610 },
  { id: 11, name: "강원특별자치도 소상공인 경영안정자금", region: "강원", category: "경영", target: "강원 도내 소재 사업장 소상공인 (개인신용평점 NICE 710점 이상 또는 KCB 620점 이상)", amountLabel: "연간 2,000억원 규모 융자 (기본 이자지원 연 2%, 다자녀 추가 지원)", deadline: "2099-12-31", recurring: true, recurringNote: "1차(2~6월)·2차(7월~) 두 차례 공고, 자금 소진 시 조기 마감", verified: true, note: "일시상환(2년) 또는 분할상환(2년 거치·3년 분할) 중 선택할 수 있어요. 다자녀 소상공인은 이자지원이 추가돼요. 정확한 일정·한도는 강원특별자치도 공고를 확인하세요.", popularity: 380 },
  { id: 12, name: "제주도 소상공인 육성자금 (경영안정자금)", region: "제주", category: "경영", target: "제주특별자치도 소재 사업자등록을 마친 소상공인", amountLabel: "2026년 총 420억원 규모 저금리 융자", deadline: "2099-12-31", recurring: true, recurringNote: "제주경제통상진흥원·제주신용보증재단 통해 연중 상시 접수, 예산 소진 시 조기 마감", verified: true, note: "제주도가 시설·경영안정자금 등 저금리 융자를 지원해요. 정확한 한도·금리는 제주경제통상진흥원 공고를 확인하세요.", popularity: 295 },
  { id: 13, name: "광주광역시 미소금융 이자지원 사업", region: "광주", category: "신용", target: "미소금융(창업·운영·시설개선·긴급생계자금) 이용 중인 개인신용평점 하위 20%(KCB 700점·NICE 749점 이하), 기초생활수급자, 차상위계층, 근로장려금 수급자 소상공인", amountLabel: "연 4.5% 이자 1년 전액 지원", deadline: "2026-12-31", recurring: true, recurringNote: "예산(2억5천만원) 소진 시 조기 마감", verified: true, note: "미소금융재단 대출을 정상 상환하면 광주시가 이자를 보전해줘요. 광주지역 7개 미소금융 수행기관이나 광주경제진흥상생일자리재단에서 신청해요.", popularity: 250 },
  { id: 14, name: "대전광역시 소상공인 인건비 지원사업", region: "대전", category: "고용", target: "대전 소재 소상공인, 2026.1.1~9.10 사이 18세 이상 근로자 신규 고용(월 60시간 이상, 3개월 이상 고용유지, 4대보험 가입)", amountLabel: "근로자 1인당 150만원 (월 50만원×3개월)", deadline: "2026-11-30", verified: true, note: "대전비즈 홈페이지에서 온라인 접수하며 예산 소진 시까지 상시·선착순으로 접수해요. 문의: 대전일자리경제진흥원(042-380-3063).", popularity: 410 },
  { id: 15, name: "대전광역시 소상공인 경영회복 지원금", region: "대전", category: "고정비", target: "대전 소재 소상공인, 전년도 매출 1억 400만원 미만, 임차료·공과금 등 경영비용 지출 증빙 가능자", amountLabel: "업체당 최대 30만원", deadline: "2026-12-31", recurring: true, recurringNote: "사업자등록번호 끝자리 홀짝제 접수, 예산 소진 시 조기 마감", verified: true, note: "공동사업자는 대표자 1인만 신청 가능하고, 1인이 여러 사업체를 운영해도 1개 사업체만 지원돼요. 대전신용보증재단에서 온라인 신청해요.", popularity: 365 },
  { id: 16, name: "경상남도 소상공인 정책자금", region: "경남", category: "경영", target: "경남 도내 소재 「소상공인기본법」상 소상공인 (개인·법인)", amountLabel: "최대 1억원, 이차보전 최대 연 3.0%(1년)", deadline: "2026-12-31", recurring: true, recurringNote: "2026.1.19~12.31 상시 접수, 총 2,000억원 규모 소진 시 조기 마감", verified: true, note: "경영안정자금·창업명절 특별자금·버팀목 특별자금 등 여러 세부 자금 중 상황에 맞는 걸 골라 신청해요. 경남신용보증재단에서 온라인·방문 신청.", popularity: 455 },
  { id: 17, name: "울산광역시 소상공인 경영안정자금 (4차)", region: "울산", category: "보증", target: "울산 소재 소상공인 (도소매업·음식업은 상시근로자 5인 미만, 제조업·건설업 등은 10인 미만)", amountLabel: "업체당 최대 8,000만원, 이자지원 연 1.2~2.5%", deadline: "2026-12-31", recurring: true, recurringNote: "2026.9.10부터 선착순 접수, 200억원 규모 소진 시 조기 마감", verified: true, note: "울산신용보증재단의 보증·추천을 받아 협약은행에서 대출을 실행하고, 울산시가 대출이자 일부를 지원해요. 상환방식을 몇 가지 중 고를 수 있어요.", popularity: 500 },
  { id: 18, name: "충청북도 소상공인 육성자금", region: "충북", category: "경영", target: "충북 내 사업장을 둔 소상공인 (제조업·건설업·운수업·광업은 10인 미만, 그 외 업종은 5인 미만)", amountLabel: "최대 7,000만원 (착한가격업소는 최대 1억원), 이차보전 연 2%", deadline: "2026-12-31", recurring: true, recurringNote: "2026.1.7부터 예산 소진 시까지 상시 접수", verified: true, note: "신규 운전자금부터 시설개보수자금까지 지원해요. '보증드림' 앱이나 충북신용보증재단(043-249-5700)에서 신청해요.", popularity: 340 },
  { id: 19, name: "세종특별자치시 소상공인자금", region: "세종", category: "경영", target: "세종 소재 사업자등록 후 운영 중인 「소상공인기본법」상 소상공인", amountLabel: "최대 7,000만원, 이자지원 최대 연 2.0%", deadline: "2026-12-31", recurring: true, recurringNote: "2026.1.12~12.31, 연간 600억원 한도 소진 시 조기 마감", verified: true, note: "세종신용보증재단에서 보증서를 발급받아 협약은행에서 대출을 실행해요. 신청·문의는 세종신용보증재단으로.", popularity: 210 },
  { id: 20, name: "경북 봉화군 소상공인 카드수수료 지원사업", region: "경북", category: "고정비", target: "경상북도 봉화군 소재 소상공인 (카드가맹점)", amountLabel: "카드수수료 일부 지원 (참여점포 대상)", deadline: "2026-11-30", verified: true, note: "봉화군이 운영하는 사업으로, 기업마당(bizinfo.go.kr)에서 참여점포를 모집해요. 경북 내 다른 시·군은 별도 공고를 확인해야 해요.", popularity: 150 },
  { id: 21, name: "충남도 소상공인 재기 지원", region: "충남", category: "재기", target: "「충청남도 소상공인 지원 및 보호에 관한 조례」상 도내 소상공인 중 매출 감소 등 경영위기 요건 충족자", amountLabel: "경영개선·재창업 자금 최대 850만원", deadline: "2099-12-31", recurring: true, recurringNote: "충남경제진흥원 통해 연중 여러 차례 회차 모집, 회차별 접수 일정·모집 인원(70개 업체 내외) 상이", verified: true, note: "2025년 매출 감소, 2026년 1분기 매출 감소, 또는 물가상승률(2.5%)보다 적게 오른 소상공인 등이 대상이에요. 회차 공고는 충남경제진흥원에서 확인하세요.", popularity: 300 },
  { id: 22, name: "전북특별자치도 중소기업육성자금 (경영안정자금)", region: "전북", category: "경영", target: "전북 도내 사업자등록을 마친 소상공인·중소기업", amountLabel: "2026년 3분기 총 590억원 규모 (경영안정자금 400억원 포함)", deadline: "2099-12-31", recurring: true, recurringNote: "분기별 순차 공고, 전북도 중소기업종합지원시스템에서 온라인 접수", verified: true, note: "창업·경쟁력강화자금, 경영안정자금, 벤처기업육성자금으로 나뉘어요. 소상공인은 주로 경영안정자금(운전자금) 쪽에 해당돼요. 정확한 회차별 일정은 전북도 공고를 확인하세요.", popularity: 260 },
];

const ALL_PROGRAMS = [DETAILED_PROGRAM, ...NATIONAL_LOANS, ...SAMPLE_PROGRAMS];

const CATEGORY_ICON = {
  고정비: PiggyBank,
  에너지: Zap,
  임차료: CreditCard,
  경영: TrendChartIcon,
  디지털전환: Smartphone,
  창업: Users,
  보증: Landmark,
  고용: User,
  신용: Wallet,
  재기: Rocket,
};
const CATEGORY_COLORS = {
  고정비: { color: "white", bg: "#22B573", bg2: "#3DDB94" },
  에너지: { color: "white", bg: "#EA9A1E", bg2: "#FBC15B" },
  임차료: { color: "white", bg: "#3D63DD", bg2: "#6B8AF5" },
  경영: { color: "white", bg: "#E14E32", bg2: "#FF8A6B" },
  디지털전환: { color: "white", bg: "#0F93B8", bg2: "#3FD4F0" },
  창업: { color: "white", bg: "#7A3FE0", bg2: "#B48CFF" },
  보증: { color: "white", bg: "#2C4870", bg2: "#5D7FB0" },
  고용: { color: "white", bg: "#C23B7A", bg2: "#F17FB0" },
  신용: { color: "white", bg: "#5B6472", bg2: "#8B94A3" },
  재기: { color: "white", bg: "#0E7A6B", bg2: "#4FCBB0" },
};

function ConditionRow({ ok, text }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      {ok ? <CheckCircle2 size={16} color={GREEN} className="shrink-0 mt-0.5" /> : <XCircle size={16} color={RED} className="shrink-0 mt-0.5" />}
      <span className="text-[13.5px]" style={{ color: TEXT }}>{text}</span>
    </div>
  );
}

function HeartButton({ active, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ background: active ? RED_SOFT : "#F5F6F9" }}
    >
      <Heart size={15} color={active ? RED : MUTED} fill={active ? RED : "none"} strokeWidth={2} />
    </button>
  );
}

function SectionHeader({ title, onBack, right }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button onClick={onBack} className="navArrowBtn w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center">
        <ChevronLeft size={20} color={TEXT} />
      </button>
      <h2 className="text-base font-bold flex-1" style={{ color: TEXT }}>{title}</h2>
      {right}
    </div>
  );
}

// 목록형 화면 상단용 — 그라디언트 배너 + 아이콘으로 심심한 뒤로가기 헤더를 꾸며줘요
function HeroHeader({ icon: Icon, color, subtitle, title, onBack, right }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl -mx-5 px-5 pt-4 pb-5 mb-5"
      style={{ background: `linear-gradient(135deg, ${color}12, white)` }}
    >
      <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full" style={{ background: `${color}14` }} />
      <div className="absolute -left-10 -bottom-14 w-28 h-28 rounded-full" style={{ background: `${color}0D` }} />
      <div className="relative flex items-center gap-2 mb-4">
        <button onClick={onBack} className="navArrowBtn w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center">
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <h2 className="text-base font-bold flex-1" style={{ color: TEXT }}>{title}</h2>
        {right}
      </div>
      <div className="relative flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: color, boxShadow: `0 6px 14px ${color}55` }}
        >
          <Icon size={22} color="white" strokeWidth={2} />
        </div>
        {subtitle && <p className="text-[12.5px] leading-relaxed" style={{ color: MUTED }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// 상세 가이드 (실제 데이터가 있는 프로그램용)
function DetailedGuide({ program, onBack, favorites, onToggleFavorite }) {
  const [tab, setTab] = useState(null);
  const cards = [
    { key: "target", icon: Users, color: GREEN, bg: GREEN_SOFT, title: "지원대상", subtitle: "저도 받을 수 있나요?", desc: "매출액, 개업일 등 조건에 해당하는 경우 지원이 가능해요." },
    { key: "amount", icon: PiggyBank, color: GOLD, bg: GOLD_SOFT, title: "지원금액", subtitle: "얼마 받을 수 있나요?", desc: "지원 형태와 금액, 사용기한을 확인할 수 있어요." },
    { key: "usage", icon: Settings, color: "#7B5CE0", bg: "#F0ECFB", title: "사용용도", subtitle: "어디에 쓸 수 있나요?", desc: "바우처를 어디에, 어떻게 사용할 수 있는지 알려드려요." },
    { key: "schedule", icon: CalendarCheck, color: BLUE, bg: BLUE_SOFT, title: "신청 및 지급일정", subtitle: "기간은 언제까지인가요?", desc: "신청 기간과 지급 절차를 순서대로 안내해드려요." },
    { key: "faq", icon: HelpCircle, color: "#E5674D", bg: "#FDEEE9", title: "자주 묻는 질문", subtitle: "헷갈리는 부분 정리", desc: "신청 전에 헷갈리기 쉬운 질문들을 모아봤어요." },
  ];
  const [infoOpen, setInfoOpen] = useState(true);

  if (tab) {
    const activeCard = cards.find((c) => c.key === tab);
    return (
      <div>
        <SectionHeader title={activeCard.title} onBack={() => setTab(null)} />
        <div className="relative overflow-hidden rounded-2xl p-5 mb-5" style={{ background: `linear-gradient(135deg, ${activeCard.bg}, white)` }}>
          <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full" style={{ background: `${activeCard.color}14` }} />
          <div className="absolute -left-8 -bottom-10 w-24 h-24 rounded-full" style={{ background: `${activeCard.color}0D` }} />
          <div className="relative flex items-start gap-3.5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: activeCard.color, boxShadow: `0 6px 14px ${activeCard.color}55` }}
            >
              <activeCard.icon size={26} color="white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[16px] font-extrabold mb-1" style={{ color: TEXT }}>{activeCard.title}</p>
              <p className="text-[12.5px] leading-relaxed" style={{ color: MUTED }}>{activeCard.desc}</p>
            </div>
          </div>
        </div>
        {tab === "target" && (
          <>
            <div className="rounded-xl border p-4 mb-3" style={{ borderColor: BORDER, background: GREEN_SOFT }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: GREEN }}>충족해야 하는 조건</p>
              {program.target.ok.map((t, i) => <ConditionRow key={i} ok text={t} />)}
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: BORDER, background: RED_SOFT }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: RED }}>지원 제외 대상</p>
              {program.target.no.map((t, i) => <ConditionRow key={i} ok={false} text={t} />)}
            </div>
          </>
        )}
        {tab === "amount" && (
          <>
            <div className="rounded-xl border p-5 mb-3 text-center" style={{ borderColor: BORDER, background: GOLD_SOFT }}>
              <p className="text-xs font-medium mb-1" style={{ color: GOLD }}>지원금액</p>
              <p className="text-3xl font-extrabold" style={{ color: GOLD }}>{program.amount.value}</p>
              <p className="text-xs mt-1" style={{ color: GOLD }}>{program.amount.note}</p>
            </div>
          </>
        )}
        {tab === "usage" && (
          <>
            <div className="rounded-xl border p-4 mb-3" style={{ borderColor: BORDER, background: GREEN_SOFT }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: GREEN }}>사용 가능</p>
              {program.usage.ok.map((t, i) => <ConditionRow key={i} ok text={t} />)}
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: BORDER, background: RED_SOFT }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: RED }}>사용 불가</p>
              {program.usage.no.map((t, i) => <ConditionRow key={i} ok={false} text={t} />)}
            </div>
          </>
        )}
        {tab === "schedule" && (
          <>
            <div className="flex gap-3 mb-4">
              <div className="flex-1 rounded-xl border p-3.5" style={{ borderColor: BORDER, background: BLUE_SOFT }}>
                <p className="text-[11px] mb-1" style={{ color: BLUE }}>신청 기간</p>
                <p className="text-sm font-bold" style={{ color: TEXT }}>{program.schedule.apply}</p>
              </div>
              <div className="flex-1 rounded-xl border p-3.5" style={{ borderColor: BORDER, background: BLUE_SOFT }}>
                <p className="text-[11px] mb-1" style={{ color: BLUE }}>사용 기한</p>
                <p className="text-sm font-bold" style={{ color: TEXT }}>{program.schedule.use}</p>
              </div>
            </div>
            {program.steps.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 text-white" style={{ background: BLUE }}>{i + 1}</div>
                  {i < program.steps.length - 1 && <div className="w-px flex-1 my-1" style={{ background: BORDER }} />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold" style={{ color: TEXT }}>{s.t}</p>
                  <p className="text-[12.5px] mt-0.5" style={{ color: MUTED }}>{s.d}</p>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "faq" && (
          <FaqList items={program.faq} />
        )}
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title={program.name}
        onBack={onBack}
        right={<HeartButton active={favorites.has(program.id)} onClick={() => onToggleFavorite(program.id)} />}
      />
      <div className="rounded-xl border overflow-hidden mb-6" style={{ borderColor: BORDER, background: BLUE_SOFT }}>
        <button onClick={() => setInfoOpen(!infoOpen)} className="w-full flex items-center justify-between px-4 py-3.5">
          <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: BLUE }}>
            <Info size={16} /> {program.name}란?
          </span>
          <ChevronDown size={16} color={BLUE} style={{ transform: infoOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.15s" }} />
        </button>
        {infoOpen && (
          <p className="px-4 pb-4 text-[13px] leading-relaxed" style={{ color: "#4A5268" }}>
            정부(소상공인시장진흥공단)가 경영이 어려운 소상공인의 고정비 부담을
            덜어주기 위해 지급하는 목적성 지원금이에요. 카드형 디지털 바우처로
            지급해 사업 운영에 꼭 필요한 비용에만 쓰도록 한 제도예요.
          </p>
        )}
      </div>

      <p className="text-xs font-semibold mb-3" style={{ color: MUTED }}>간단 서비스</p>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.key} className="rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: c.bg }}>
              <c.icon size={19} color={c.color} strokeWidth={2} />
            </div>
            <p className="text-sm font-bold" style={{ color: TEXT }}>{c.title}</p>
            <p className="text-[11.5px] mb-3" style={{ color: MUTED }}>{c.subtitle}</p>
            <button onClick={() => setTab(c.key)} className="w-full py-2 rounded-lg text-white text-xs font-semibold" style={{ background: BLUE }}>
              확인하기
            </button>
          </div>
        ))}
      </div>

      <a
        href="https://www.sbiz24.kr"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-5 py-3.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-1.5"
        style={{ background: BLUE }}
      >
        신청하러 가기 <ExternalLink size={15} />
      </a>
      <p className="text-[11px] text-center mt-2" style={{ color: MUTED }}>
        소상공인24(sbiz24.kr) 공식 사이트로 이동해요
      </p>
      <p className="text-[11px] text-center mt-3" style={{ color: MUTED }}>
        전화 상담: <a href="tel:1533-0100" style={{ color: BLUE }}>1533-0100</a> (소진공 콜센터, 평일 09~18시)
      </p>
    </div>
  );
}

function FaqList({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {items.map((f, i) => (
        <div key={i} className="border-b py-3.5" style={{ borderColor: BORDER }}>
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between text-left">
            <span className="text-sm font-medium pr-3" style={{ color: TEXT }}>{f.q}</span>
            <ChevronDown size={16} color={MUTED} style={{ transform: open === i ? "rotate(180deg)" : "rotate(0)", transition: "0.15s" }} />
          </button>
          {open === i && <p className="text-[12.5px] mt-2 leading-relaxed" style={{ color: MUTED }}>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

// 예시 데이터 프로그램용 간단 상세 화면
function SimpleDetail({ program, onBack }) {
  const dday = getDday(program.deadline);
  const color = urgencyColor(dday);
  return (
    <div>
      <SectionHeader title={program.name} onBack={onBack} />
      <div className="rounded-xl border p-4 mb-3" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: BLUE_SOFT, color: BLUE }}>{program.category}</span>
          <span className="text-[11px]" style={{ color: MUTED }}><MapPin size={10} className="inline -mt-0.5" /> {program.region}</span>
        </div>
        <ConditionRow ok text={`지원대상: ${program.target}`} />
        <ConditionRow ok text={`지원금액: ${program.amountLabel}`} />
        <div className="flex items-start gap-2 py-1.5">
          <CalendarCheck size={16} color={program.recurring ? GREEN : color} className="shrink-0 mt-0.5" />
          <span className="text-[13.5px]" style={{ color: TEXT }}>
            {program.recurring
              ? `상시접수 (${program.recurringNote || "예산 소진 시 마감"})`
              : `신청 마감: ${program.deadline} (${dday >= 0 ? `D-${dday}` : "마감"})`}
          </span>
        </div>
      </div>
      <div
        className="rounded-xl border p-3.5 flex items-start gap-2"
        style={program.verified ? { borderColor: BORDER, background: GREEN_SOFT } : { borderColor: BORDER, background: "#FAFAFA" }}
      >
        <Info size={14} color={program.verified ? GREEN : MUTED} className="shrink-0 mt-0.5" />
        <p className="text-[12px]" style={{ color: program.verified ? GREEN : MUTED }}>
          {program.verified
            ? `실제로 확인한 정보예요. ${program.note || ""}`
            : "이 항목은 아직 예시 데이터예요. 실제 출시 전에는 담당 기관 공고문으로 정확한 정보를 확인해서 채워야 해요."}
        </p>
      </div>

      <a
        href="https://www.sbiz24.kr"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-4 py-3.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-1.5"
        style={{ background: BLUE }}
      >
        신청하러 가기 <ExternalLink size={15} />
      </a>
      <p className="text-[11px] text-center mt-2" style={{ color: MUTED }}>
        소상공인24(sbiz24.kr)에서 실제 정보를 확인해보세요
      </p>
      <p className="text-[11px] text-center mt-3" style={{ color: MUTED }}>
        전화 상담: <a href="tel:1533-0100" style={{ color: BLUE }}>1533-0100</a> (소진공 콜센터, 평일 09~18시)
      </p>
    </div>
  );
}

// 환율정보 화면 — 공개 환율 API(open.er-api.com)에서 실시간 데이터를 받아와요
// TODO(출시 전 보완): 무료 API라 호출 제한·SLA가 없음. 정식 출시 전 한국수출입은행
// 공공 환율 API 또는 유료 API로 교체 검토.
function ExchangeRateContent() {
  const [state, setState] = useState({ status: "loading", rates: null, updatedAt: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/KRW");
        if (!res.ok) throw new Error("network");
        const data = await res.json();
        if (cancelled) return;
        if (data.result !== "success") throw new Error("api");
        setState({ status: "ready", rates: data.rates, updatedAt: data.time_last_update_utc });
      } catch (e) {
        if (!cancelled) setState({ status: "error", rates: null, updatedAt: null });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // data.rates는 "1원 = X 외화" 형태라서, 화면엔 "외화 1(또는 100) 단위당 원화"로 뒤집어 보여줘요
  const CURRENCIES = [
    { code: "USD", label: "미국 달러", flag: "🇺🇸", unit: 1 },
    { code: "JPY", label: "일본 엔 (100엔)", flag: "🇯🇵", unit: 100 },
    { code: "EUR", label: "유럽 유로", flag: "🇪🇺", unit: 1 },
    { code: "CNY", label: "중국 위안", flag: "🇨🇳", unit: 1 },
  ];

  return (
    <div>
      <div className="rounded-2xl border p-3.5 flex items-start gap-2 mb-4" style={{ borderColor: BORDER, background: GREEN_SOFT }}>
        <Info size={14} color={GREEN} className="shrink-0 mt-0.5" />
        <p className="text-[12px]" style={{ color: GREEN }}>
          실시간 공개 환율 API로 받아온 참고용 정보예요. 실제 송금·환전 시엔 은행 고시 환율과 차이가 있을 수 있어요.
        </p>
      </div>

      {state.status === "loading" && (
        <div className="py-16 text-center">
          <p className="text-[13px]" style={{ color: MUTED }}>환율 정보를 불러오는 중이에요...</p>
        </div>
      )}

      {state.status === "error" && (
        <div className="py-10 text-center">
          <p className="text-[13px] mb-3" style={{ color: MUTED }}>환율 정보를 불러오지 못했어요. 네트워크 상태를 확인하고 다시 시도해주세요.</p>
          <a
            href="https://finance.naver.com/marketindex/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold px-3 py-2 rounded-full"
            style={{ background: BLUE_SOFT, color: BLUE }}
          >
            네이버 환율에서 확인하기 <ExternalLink size={12} />
          </a>
        </div>
      )}

      {state.status === "ready" && (
        <>
          <div className="space-y-2.5">
            {CURRENCIES.map((c) => {
              // rates[c.code]는 "1원당 c.code 몇 개"이므로, 역수*unit이 "unit c.code당 원화"
              const krwPerUnit = state.rates && state.rates[c.code] ? (1 / state.rates[c.code]) * c.unit : null;
              return (
                <div key={c.code} className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: BORDER }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[22px]">{c.flag}</span>
                    <div>
                      <p className="text-[13.5px] font-bold" style={{ color: TEXT }}>{c.label}</p>
                      <p className="text-[11px]" style={{ color: MUTED }}>{c.code}</p>
                    </div>
                  </div>
                  <p className="text-[16px] font-extrabold tabular-nums" style={{ color: TEXT }}>
                    {krwPerUnit ? `${Math.round(krwPerUnit).toLocaleString()}원` : "-"}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-center mt-4" style={{ color: MUTED }}>
            기준시각(UTC): {state.updatedAt || "-"} · 출처: open.er-api.com
          </p>
        </>
      )}
    </div>
  );
}

// 금리 정보 — 한국은행 기준금리 및 소상공인 정책자금 금리 (2026년 9월 기준 실제 수치)
function InterestRateContent({ onOpenCalculator }) {
  const [rateAlertOn, setRateAlertOn] = useState(false);
  const history = [
    { date: "2026.06 이전", rate: "2.50%", note: "8차례 연속 동결", direction: "hold" },
    { date: "2026.07.16", rate: "2.75%", note: "3년 6개월 만에 인상 ▲0.25%p", direction: "up" },
    { date: "2026.08.27", rate: "3.00%", note: "2연속 인상 ▲0.25%p", direction: "up" },
  ];
  const trendColor = (d) => (d === "up" ? RED : d === "down" ? BLUE : GREEN);
  const maxRate = 4;
  const policyRates = [
    { label: "대표자금 (일반경영안정자금 등)", value: "연 2.96%~" },
    { label: "자금별 범위", value: "연 2~4%대" },
    { label: "비수도권 우대금리", value: "-0.2%p" },
    { label: "중·저신용자 대출 (NCB 839점 이하)", value: "정책자금 기준금리 +1.6%p" },
  ];
  return (
    <div>
      <div className="rounded-2xl p-6 mb-5" style={{ background: "linear-gradient(135deg, #3D63DD 0%, #6B8AFB 100%)" }}>
        <div className="flex items-start justify-between mb-3">
          <p className="font-bold" style={{ color: "rgba(255,255,255,0.95)", fontSize: 17 }}>한국은행 기준금리</p>
          <p className="text-right leading-snug" style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>2026.08.27 발표<br />2연속 인상</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-extrabold leading-none tracking-tight" style={{ color: "white", fontSize: 68 }}>3.00%</p>
          <span className="font-bold px-2.5 py-1 rounded-full" style={{ background: "white", color: RED, fontSize: 13 }}>▲0.25%p</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2.5">
        <p className="font-bold" style={{ color: TEXT, fontSize: 15 }}>최근 변동 추이</p>
        <button
          onClick={() => setRateAlertOn((v) => !v)}
          className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full"
          style={{ background: rateAlertOn ? BLUE_SOFT : "#F2F3F7" }}
        >
          <Bell size={11} color={rateAlertOn ? BLUE : MUTED} />
          <span className="text-[10.5px] font-semibold" style={{ color: rateAlertOn ? BLUE : MUTED }}>발표 알림</span>
          <Switch checked={rateAlertOn} onChange={() => setRateAlertOn((v) => !v)} />
        </button>
      </div>
      <div className="rounded-2xl overflow-hidden mb-5" style={{ border: `1px solid ${BORDER}` }}>
        {history.map((h, i) => (
          <div key={h.date} className="px-4 py-3.5" style={i > 0 ? { borderTop: `1px solid ${BORDER}` } : {}}>
            <div className="flex items-center gap-3 mb-2">
              <span className="shrink-0 w-[78px] font-semibold" style={{ color: TEXT, fontSize: 14 }}>{h.date}</span>
              <span className="flex-1 font-semibold leading-snug" style={{ color: trendColor(h.direction), fontSize: 14 }}>{h.note}</span>
              <span className="font-extrabold tabular-nums shrink-0" style={{ color: TEXT, fontSize: 18 }}>{h.rate}</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "#F2F3F7" }}>
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${(parseFloat(h.rate) / maxRate) * 100}%`, background: trendColor(h.direction) }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="font-bold mb-2.5" style={{ color: TEXT, fontSize: 15 }}>소상공인 정책자금 평균 금리</p>
      <div className="rounded-2xl p-4 mb-5" style={{ background: "#FAFAFB" }}>
        {policyRates.map((r, i) => (
          <div key={r.label} className="py-2.5" style={i > 0 ? { borderTop: `1px solid ${BORDER}` } : {}}>
            <p className="mb-1 leading-snug font-semibold" style={{ color: TEXT, fontSize: 15 }}>{r.label}</p>
            <p className="font-extrabold leading-snug tabular-nums" style={{ color: RED, fontSize: 19 }}>{r.value}</p>
          </div>
        ))}
      </div>

      <p className="font-bold mb-2.5" style={{ color: TEXT, fontSize: 15 }}>은행별 대출금리 비교</p>
      <div className="rounded-2xl p-4 mb-5" style={{ background: "#FAFAFB" }}>
        <p className="text-[12px] leading-relaxed mb-3" style={{ color: MUTED }}>
          은행마다 신용등급·산정 방식이 달라서, 은행별 정확한 금리는 은행연합회가 매달 공시하는 공식 자료에서 바로 비교하는 게 가장 정확해요.
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-3 mb-3.5">
          {[
            { name: "KB국민", initial: "KB", bg: "#FFB300" },
            { name: "신한", initial: "신", bg: "#0046FF" },
            { name: "하나", initial: "하", bg: "#00857C" },
            { name: "우리", initial: "우", bg: "#0067AC" },
            { name: "NH농협", initial: "NH", bg: "#00A651" },
            { name: "IBK기업", initial: "IBK", bg: "#0075C9" },
          ].map((bank) => (
            <div key={bank.name} className="flex flex-col items-center w-[62px]">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-white mb-1"
                style={{ background: bank.bg, fontSize: bank.initial.length > 2 ? 11 : 13 }}
              >
                {bank.initial}
              </div>
              <span className="text-[11px] font-semibold text-center leading-snug" style={{ color: TEXT }}>{bank.name}</span>
            </div>
          ))}
        </div>
        <a
          href="https://portal.kfb.or.kr/compare/loan_snmindustry.php"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl text-center text-[12.5px] font-bold flex items-center justify-center gap-1"
          style={{ background: BLUE_SOFT, color: BLUE }}
        >
          은행연합회 개인사업자대출 금리 비교 보기 <ExternalLink size={12} />
        </a>
      </div>

      <p className="font-bold mb-2.5" style={{ color: TEXT, fontSize: 15 }}>정책자금이 시중은행보다 유리한 이유</p>
      <div className="rounded-2xl p-4 mb-5 space-y-2.5" style={{ background: GREEN_SOFT }}>
        {[
          "정책자금 기준금리는 한국은행 기준금리와 별도로 산정돼서, 기준금리가 올라도 시중은행 대출보다 상승 폭이 작은 편이에요.",
          "신용도가 낮아 시중은행에서 거절되기 쉬운 중·저신용 소상공인도, 가산금리만 더 붙는 방식이라 정책자금은 상대적으로 문턱이 낮아요.",
          "비수도권 사업장은 우대금리(-0.2%p)까지 더해져서 지역별로 유리한 조건이 따로 있어요.",
        ].map((t, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 size={15} color={GREEN} className="shrink-0 mt-0.5" />
            <p className="text-[12.5px] leading-relaxed" style={{ color: TEXT }}>{t}</p>
          </div>
        ))}
      </div>

      {onOpenCalculator && (
        <button
          onClick={onOpenCalculator}
          className="w-full py-3.5 rounded-2xl mb-5 flex items-center justify-center gap-2 font-bold"
          style={{ background: BLUE, color: "white", fontSize: 13.5 }}
        >
          지금 금리로 내 대출이자 계산해보기 <ChevronRight size={15} />
        </button>
      )}

      <div className="rounded-2xl border p-3.5 flex items-start gap-2 mb-2" style={{ borderColor: BORDER, background: BLUE_SOFT }}>
        <Info size={14} color={BLUE} className="shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed" style={{ color: BLUE }}>
          다음 통화정책방향 결정회의: 2026.10.22, 11.26 예정. 정책자금 금리는 분기별로 조정될 수 있으니 신청 전 소상공인정책자금 홈페이지에서 최신 공고를 확인하세요.
        </p>
      </div>
      <p className="text-[11px] text-center" style={{ color: MUTED }}>출처: 한국은행, 소상공인시장진흥공단 (2026.09 기준)</p>
    </div>
  );
}

function RateAndExchangeScreen({ onBack, onOpenCalculator }) {
  const [tab, setTab] = useState("rate");
  return (
    <div>
      <HeroHeader icon={Landmark} color={BLUE} title="금리·환율 정보" subtitle="한국은행 기준금리와 환율을 한눈에 확인해요" onBack={onBack} />
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { key: "rate", label: "금리 정보" },
          { key: "exchange", label: "환율 정보" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-3 py-2.5 rounded-xl text-[13px] font-semibold text-center"
            style={tab === t.key ? { background: BLUE, color: "white" } : { background: "#F2F3F7", color: MUTED }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "rate" ? <InterestRateContent onOpenCalculator={onOpenCalculator} /> : <ExchangeRateContent />}
    </div>
  );
}

// 소상공인시장진흥공단 지역본부 실제 주소·연락처
// 2026년 2분기 조직개편으로 8개 → 12개 지역본부로 재편됨 (예: 서울/강원, 부산울산/경남, 인천/경기북부 분리)
// 본부 아래 구·시·군 단위 하위센터까지 전 지역 실제 데이터로 반영 완료 (2026.09.13 전북 확인으로 마무리)
const REGIONAL_CENTERS = [
  { name: "서울지역본부", isHQ: true, covers: ["서울"], address: "서울특별시 마포구 독막로 320 태영데시앙루브 7층", phone: "02-730-9361", lat: 37.5423, lng: 126.9106 },
  { name: "(서울)서울중부센터", covers: ["서울"], districts: ["중구", "종로구", "서대문구", "은평구"], address: "서울 종로구 삼봉로 95 대성스카이렉스 102동 2층", phone: "02-720-4711" },
  { name: "(서울)서울동부센터", covers: ["서울"], districts: ["광진구", "성동구", "강동구", "동대문구"], address: "서울 광진구 자양로 142 청양빌딩 4층", phone: "02-2215-0981" },
  { name: "(서울)서울서부센터", covers: ["서울"], districts: ["강서구", "양천구", "영등포구"], address: "서울 영등포구 영등포로 33 목동비즈타워 604호", phone: "02-839-8311" },
  { name: "(서울)서울남부센터", covers: ["서울"], districts: ["강남구", "서초구", "송파구"], address: "서울 서초구 방배로 114, 다이치빌딩 3층", phone: "02-585-8622" },
  { name: "(서울)서울북부센터", covers: ["서울"], districts: ["강북구", "성북구", "노원구", "도봉구", "중랑구"], address: "서울 강북구 도봉로 186 제이슨빌딩 5층", phone: "02-990-9101" },
  { name: "(서울)관악센터", covers: ["서울"], districts: ["관악구", "구로구", "금천구"], address: "서울 관악구 신원로 35 삼모더프라임타워 8층", phone: "02-889-9262" },
  { name: "(서울)동작센터", covers: ["서울"], districts: ["동작구", "용산구", "마포구"], address: "서울 동작구 동작대로 109 406호", phone: "02-3482-6686" },
  { name: "강원지역본부", isHQ: true, covers: ["강원"], address: "강원특별자치도 춘천시 안마산로 262 강원지방중소벤처기업청 1층", phone: "033-243-1950" },
  { name: "(강원)춘천센터", covers: ["강원"], districts: ["춘천시", "홍천군", "양구군", "화천군", "철원군"], address: "강원특별자치도 춘천시 안마산로 262 강원지방중소벤처기업청 1층", phone: "033-243-1950" },
  { name: "(강원)원주센터", covers: ["강원"], districts: ["원주시", "횡성군", "영월군"], address: "강원특별자치도 원주시 호저로 47 강원특별자치도경제진흥원 3층 306호", phone: "033-746-1950" },
  { name: "(강원)삼척센터", covers: ["강원"], districts: ["삼척시", "동해시", "태백시", "정선군"], address: "강원특별자치도 삼척시 중앙로 296 삼척시청 별관 1층", phone: "033-575-1950" },
  { name: "(강원)속초센터", covers: ["강원"], districts: ["속초시", "양양군", "고성군", "인제군"], address: "강원특별자치도 속초시 중앙동 중앙로 183 속초시청 해양수산과동 2층", phone: "033-638-1950" },
  { name: "(강원)강릉센터", covers: ["강원"], districts: ["강릉시", "평창군"], address: "강원특별자치도 강릉시 종합운동장길 88 대한상공회의소 3층", phone: "033-645-1950" },
  { name: "경기남부지역본부", isHQ: true, covers: ["경기남부"], address: "경기도 수원시 영통구 반달로 87 경기지방중소벤처기업청 4층", phone: "031-204-3012", lat: 37.2506, lng: 127.0672 },
  { name: "(경기)수원센터", covers: ["경기남부"], districts: ["수원시"], address: "경기도 수원시 영통구 반달로 87 경기지방중소기업청 1층", phone: "031-244-5161" },
  { name: "(경기)평택센터", covers: ["경기남부"], districts: ["평택시"], address: "경기도 평택시 중앙로 31 우리은행 평택금융센터 2층", phone: "031-666-0260" },
  { name: "(경기)화성센터", covers: ["경기남부"], districts: ["화성시", "오산시"], address: "경기도 화성시 병점1로 218 씨네샤르망 B동 303호", phone: "031-8015-5301" },
  { name: "(경기)성남센터", covers: ["경기남부"], districts: ["성남시"], address: "경기도 성남시 분당구 황새울로 346 우리은행 분당중앙금융센터 4층", phone: "031-705-7341" },
  { name: "(경기)안양센터", covers: ["경기남부"], districts: ["안양시", "군포시", "의왕시", "과천시"], address: "경기도 안양시 동안구 시민대로 278 신한은행 평촌금융센터 3층", phone: "031-383-1002" },
  { name: "(경기)안산센터", covers: ["경기남부"], districts: ["안산시"], address: "경기도 안산시 단원구 중앙대로 815 안산우체국 1층", phone: "031-482-2590" },
  { name: "(경기)하남센터", covers: ["경기남부"], districts: ["하남시", "광주시", "양평군"], address: "경기도 하남시 미사강변대로 52 미사강변블루 6층 606호", phone: "031-794-4383" },
  { name: "(경기)용인센터", covers: ["경기남부"], districts: ["용인시"], address: "경기도 용인시 처인구 금령로 116 용인타워 303호", phone: "031-337-1830" },
  { name: "(경기)안성센터", covers: ["경기남부"], districts: ["안성시"], address: "경기도 안성시 중앙로 327 한경대학교 산학협력관 201~203호", phone: "031-677-6199" },
  { name: "경기북부지역본부", isHQ: true, covers: ["경기북부"], address: "경기 의정부시 행복로 39 KB국민은행 의정부중앙종합금융센터 4층", phone: "031-876-4384" },
  { name: "(경기)광명센터", covers: ["경기북부"], districts: ["광명시"], address: "경기도 광명시 범안로 1035 송화빌딩 6층 601호", phone: "02-2066-6348" },
  { name: "(경기)의정부센터", covers: ["경기북부"], districts: ["의정부시", "동두천시", "포천시", "양주시", "연천군"], address: "경기 의정부시 행복로 39 KB국민은행 의정부중앙종합금융센터 4층", phone: "031-876-4384" },
  { name: "(경기)부천센터", covers: ["경기북부"], districts: ["부천시"], address: "경기도 부천시 길주로 433 네스필러타워 2층", phone: "032-655-0381" },
  { name: "(경기)고양센터", covers: ["경기북부"], districts: ["고양시", "파주시"], address: "경기도 고양시 일산동구 장백로 204 보림빌딩 604호", phone: "031-925-4266" },
  { name: "(경기)구리센터", covers: ["경기북부"], districts: ["구리시", "남양주시", "가평군"], address: "경기도 구리시 건원대로 44 태영빌딩 502호", phone: "031-554-5361" },
  { name: "(경기)김포센터", covers: ["경기북부"], districts: ["김포시"], address: "경기도 김포시 돌문로 49 원정빌딩 4층", phone: "031-997-4302" },
  { name: "(경기)시흥센터", covers: ["경기북부"], districts: ["시흥시"], address: "경기도 시흥시 은계로 347 다온프라자 403호", phone: "031-311-2689" },
  { name: "인천지역본부", isHQ: true, covers: ["인천"], address: "인천광역시 남동구 남동대로 215번길 30 인천종합비즈니스센터 713호", phone: "032-822-2619", fax: "032-822-2620", lat: 37.4483, lng: 126.7050 },
  { name: "(인천)인천남부센터", covers: ["인천"], districts: ["연수구", "미추홀구", "남동구", "중구", "동구", "옹진군"], address: "인천광역시 미추홀구 인주대로 416 삼원빌딩 2층", phone: "032-437-3570", fax: "032-437-3574" },
  { name: "(인천)인천북부센터", covers: ["인천"], districts: ["부평구", "계양구", "서구", "강화군"], address: "인천광역시 부평구 부흥로 337 신한은행 5층", phone: "032-514-4010", fax: "032-514-4014" },
  { name: "대전세종충남지역본부", isHQ: true, covers: ["대전", "세종", "충남"], address: "대전광역시 중구 계룡로 800 동아생명빌딩 9층", phone: "042-864-1609", lat: 36.3283, lng: 127.4230 },
  { name: "(대전)대전북부센터", covers: ["대전"], districts: ["유성구", "서구", "대덕구"], address: "대전광역시 유성구 가정북로 96, 102호", phone: "042-864-1602", fax: "042-864-1606" },
  { name: "(대전)대전남부센터", covers: ["대전"], districts: ["중구", "동구"], address: "대전광역시 중구 계룡로 800 동아생명빌딩 1층", phone: "042-223-5301", fax: "042-223-0665" },
  { name: "(세종)세종센터", covers: ["세종"], districts: ["세종시"], address: "세종특별자치시 한누리대로 2150 스마트허브1 3층 303호", phone: "044-868-4524", fax: "044-868-4527" },
  { name: "(충남)천안센터", covers: ["충남"], districts: ["천안시"], address: "충청남도 천안시 서북구 광장로 215 충남경제종합지원센터 8층", phone: "041-567-5302", fax: "041-567-5308" },
  { name: "(충남)공주센터", covers: ["충남"], districts: ["공주시", "보령시", "청양군"], address: "충청남도 공주시 무령로 204 금성빌딩 3층", phone: "041-852-1183", fax: "041-852-1186" },
  { name: "(충남)논산센터", covers: ["충남"], districts: ["논산시", "계룡시", "금산군"], address: "충청남도 논산시 중앙로 464 논산타워 2층", phone: "041-733-5064", fax: "041-733-5067" },
  { name: "(충남)서산센터", covers: ["충남"], districts: ["서산시", "당진시", "태안군"], address: "충청남도 서산시 고운로 177 서산시2청사 2동 2층", phone: "041-663-4981", fax: "041-663-4980" },
  { name: "(충남)아산센터", covers: ["충남"], districts: ["아산시", "예산군"], address: "충청남도 아산시 배방읍 배방로 22 삼영프라자 202호", phone: "041-549-5392", fax: "041-549-5399" },
  { name: "(충남)보령센터", covers: ["충남"], districts: ["보령시", "부여군", "서천군"], address: "충청남도 보령시 흥덕로 22 2층", phone: "041-931-4443" },
  { name: "충북지역본부", isHQ: true, covers: ["충북"], address: "충청북도 청주시 청원구 오창읍 중심상업2로 48 충북지방중소벤처기업청 1층", phone: "043-234-1095", fax: "043-234-1091" },
  { name: "(충북)청주센터", covers: ["충북"], districts: ["청주시", "보은군"], address: "충청북도 청주시 청원구 오창읍 중심상업2로 48 충북지방중소벤처기업청 1층", phone: "043-234-1095", fax: "043-234-1091" },
  { name: "(충북)충주센터", covers: ["충북"], districts: ["충주시"], address: "충청북도 충주시 으뜸로 21 충주시청 11층", phone: "043-854-3616", fax: "043-854-3619" },
  { name: "(충북)제천센터", covers: ["충북"], districts: ["제천시", "단양군"], address: "충청북도 제천시 풍양로 65 KT 제천빌딩 2층", phone: "043-652-1781", fax: "043-652-1784" },
  { name: "(충북)음성센터", covers: ["충북"], districts: ["음성군", "괴산군", "증평군", "진천군"], address: "충청북도 음성군 맹동면 대하2가길 3 미르타워 3층", phone: "043-873-1811", fax: "043-873-1814" },
  { name: "(충북)옥천센터", covers: ["충북"], districts: ["옥천군", "영동군"], address: "충청북도 옥천군 옥천읍 동부로 15 옥천읍사무소 3층", phone: "043-731-0924", fax: "043-731-0926" },
  { name: "부산울산지역본부", isHQ: true, covers: ["부산", "울산"], address: "부산광역시 중구 중앙대로 63 부산우체국 12층", phone: "051-469-4680", lat: 35.1035, lng: 129.0324 },
  { name: "(부산)부산중부센터", covers: ["부산"], districts: ["중구", "영도구", "서구", "사하구", "동구"], address: "부산 중구 중앙대로 63 부산우체국 12층", phone: "051-469-1644" },
  { name: "(부산)부산북부센터", covers: ["부산"], districts: ["북구", "사상구", "강서구"], address: "부산 북구 기찰로12 이수타워 9층", phone: "051-341-8052" },
  { name: "(부산)부산남부센터", covers: ["부산"], districts: ["부산진구", "연제구", "동래구", "금정구"], address: "부산 연제구 중앙대로 1090 프라임시티 6층", phone: "051-633-6562" },
  { name: "(부산)부산동부센터", covers: ["부산"], districts: ["남구", "수영구", "해운대구", "기장군"], address: "부산 수영구 과정로 46 SMC빌딩 6층", phone: "051-761-2561" },
  { name: "(울산)울산남부센터", covers: ["울산"], districts: ["남구", "울주군"], address: "울산 남구 돋질로 97 울산상공회의소 5층", phone: "052-260-6388" },
  { name: "(울산)울산북부센터", covers: ["울산"], districts: ["중구", "북구", "동구"], address: "울산 중구 새즈믄해거리 28 2층", phone: "052-243-7489" },
  { name: "경남지역본부", isHQ: true, covers: ["경남"], address: "경상남도 창원시 성산구 상남로 60 오션타워 5층(502,503호)", phone: "055-275-3261", fax: "055-275-3264" },
  { name: "(경남)창원센터", covers: ["경남"], districts: ["창원시(구 마산시)", "진해시", "창녕군", "함안군"], address: "경상남도 창원시 성산구 상남로 60 오션타워 5층(502,503호)", phone: "055-275-3261", fax: "055-275-3264" },
  { name: "(경남)진주센터", covers: ["경남"], districts: ["진주시", "사천시", "산청군", "의령군", "남해군", "하동군", "거창군", "함양군", "합천군"], address: "경상남도 진주시 충의로 26 경남은행 영업본부 3층", phone: "055-758-6701", fax: "055-758-7102" },
  { name: "(경남)김해센터", covers: ["경남"], districts: ["김해시"], address: "경상남도 김해시 호계로422번길 24 김해상공회의소 1층", phone: "055-323-4960", fax: "055-323-4963" },
  { name: "(경남)통영센터", covers: ["경남"], districts: ["통영시", "거제시", "고성군"], address: "경상남도 통영시 광도면 죽림1로 73 농협은행(한려지점) 3층", phone: "055-648-2107", fax: "055-648-2109" },
  { name: "(경남)양산센터", covers: ["경남"], districts: ["양산시", "밀양시"], address: "경상남도 양산시 중앙로 33-2 양산비즈니스센터 4층", phone: "055-367-7112", fax: "055-367-7116" },
  { name: "대구경북지역본부", isHQ: true, covers: ["대구", "경북"], address: "대구광역시 중구 국채보상로102길 2 우리은행(동산동지점) 3층", phone: "053-629-4633", lat: 35.8697, lng: 128.5947 },
  { name: "(대구)대구남부센터", covers: ["대구"], districts: ["서구", "중구", "남구", "수성구"], address: "대구 중구 국채보상로 102길 2 우리은행(동산동지점) 3층", phone: "1533-0100" },
  { name: "(대구)대구북부센터", covers: ["대구"], districts: ["북구", "동구", "군위군"], address: "대구 북구 옥산로 17길 14 리치프라자 2층", phone: "1533-0100" },
  { name: "(대구)대구서부센터", covers: ["대구"], districts: ["달서구", "달성군"], address: "대구 달서구 월배로 15길 8 595b 4층", phone: "1533-0100" },
  { name: "(경북)안동센터", covers: ["경북"], districts: ["안동시", "상주시", "의성군", "청송군", "영양군"], address: "경북 안동시 경동로 661 백암빌딩 6층", phone: "1533-0100" },
  { name: "(경북)구미센터", covers: ["경북"], districts: ["구미시", "김천시", "성주군", "칠곡군", "고령군"], address: "경북 구미시 구미대로 350-27 구미시종합비즈니스지원센터 4층 408호", phone: "1533-0100" },
  { name: "(경북)포항센터", covers: ["경북"], districts: ["포항시", "영덕군", "울진군", "울릉군"], address: "경북 포항시 북구 포스코대로 299 신한은행 4층", phone: "1533-0100" },
  { name: "(경북)경주센터", covers: ["경북"], districts: ["경주시", "경산시", "영천시", "청도군"], address: "경북 경주시 중앙로 67-2 경주상공회의소 2층", phone: "1533-0100" },
  { name: "(경북)영주센터", covers: ["경북"], districts: ["영주시", "문경시", "봉화군", "예천군"], address: "경북 영주시 선비로 182 영주상공회의소 1층", phone: "1533-0100" },
  { name: "광주전남제주지역본부", isHQ: true, covers: ["광주", "전남", "제주"], address: "광주광역시 서구 천변좌로 268 KDB생명빌딩 21층", phone: "062-369-8754", lat: 35.1499, lng: 126.8842 },
  { name: "(광주)광주남부센터", covers: ["광주"], districts: ["서구", "남구"], address: "광주 서구 천변좌로 268 KDB생명빌딩 21층", phone: "1533-0100" },
  { name: "(광주)광주북부센터", covers: ["광주"], districts: ["동구", "북구"], address: "광주 북구 동문대로 193 동광주빌딩 2층", phone: "1533-0100" },
  { name: "(광주)광주서부센터", covers: ["광주"], districts: ["광산구"], address: "광주 광산구 하남산단8번로 177 광주경제고용진흥원 7층", phone: "1533-0100" },
  { name: "(전남)목포센터", covers: ["전남"], districts: ["목포시", "무안군", "해남군", "강진군", "영암군", "장흥군", "신안군", "완도군", "진도군"], address: "전남 무안군 삼향읍 오룡3길 2 전남중소기업일자리경제진흥원 5층", phone: "1533-0100" },
  { name: "(전남)순천센터", covers: ["전남"], districts: ["순천시", "광양시", "구례군", "보성군", "고흥군", "곡성군"], address: "전남 순천시 해룡면 향매로109 5층", phone: "1533-0100" },
  { name: "(전남)여수센터", covers: ["전남"], districts: ["여수시"], address: "전남 여수시 좌수영로 962-12 여수상공회의소 3층", phone: "1533-0100" },
  { name: "(전남)나주센터", covers: ["전남"], districts: ["나주시", "화순군", "함평군", "영광군", "장성군", "담양군"], address: "전남 나주시 빛가람로 685 비전타워 306호", phone: "1533-0100" },
  { name: "전북지역본부", isHQ: true, covers: ["전북"], address: "전북특별자치도 전주시 완산구 홍산로 276 전주상공회의소 6층", phone: "063-231-8110", fax: "063-231-8112" },
  { name: "(전북)전주센터", covers: ["전북"], districts: ["전주시", "완주군", "진안군", "무주군"], address: "전북특별자치도 전주시 완산구 홍산로 276 전주상공회의소 6층", phone: "063-231-8110", fax: "063-231-8112" },
  { name: "(전북)익산센터", covers: ["전북"], districts: ["익산시"], address: "전북특별자치도 익산시 인북로 187 상공회의소 3층", phone: "063-853-4411", fax: "063-853-4413" },
  { name: "(전북)정읍센터", covers: ["전북"], districts: ["정읍시", "김제시", "고창군", "부안군"], address: "전북특별자치도 정읍시 중앙로 72 기업은행 3층", phone: "063-533-1781", fax: "063-533-1783" },
  { name: "(전북)남원센터", covers: ["전북"], districts: ["남원시", "장수군", "임실군", "순창군"], address: "전북특별자치도 남원시 향단로 83 KT남원빌딩 1층", phone: "063-626-0371", fax: "063-626-0372" },
  { name: "(전북)군산센터", covers: ["전북"], districts: ["군산시"], address: "전북특별자치도 군산시 대학로 600 전북특별자치도사회적경제혁신타운 연구숙박동 3층", phone: "063-445-6317", fax: "063-446-0199" },
  { name: "제주센터", covers: ["제주"], address: "제주특별자치도 제주시 연삼로 473 제주도경제통상진흥원 4층", phone: "064-751-2101", lat: 33.4996, lng: 126.5410 },
  { name: "(제주)서귀포센터", covers: ["제주"], districts: ["서귀포시"], address: "제주 서귀포시 신중로 50, 1층 (KT신서귀포빌딩)", phone: "064-739-9215" },
];

// 실제 사이트와 동일하게, 개별 도(道)가 아니라 12개 지역본부 단위로 탭을 묶어요
const CENTER_GROUPS = [
  { label: "서울", members: ["서울"] },
  { label: "부산울산", members: ["부산", "울산"] },
  { label: "대구경북", members: ["대구", "경북"] },
  { label: "경기북부", members: ["경기북부"] },
  { label: "인천", members: ["인천"] },
  { label: "대전세종충남", members: ["대전", "세종", "충남"] },
  { label: "광주전남제주", members: ["광주", "전남", "제주"] },
  { label: "경기남부", members: ["경기남부"] },
  { label: "강원", members: ["강원"] },
  { label: "충북", members: ["충북"] },
  { label: "전북", members: ["전북"] },
  { label: "경남", members: ["경남"] },
];

// 지역센터 지도 미리보기는 시도해봤지만 (구글맵 → OSM 임베드 → Nominatim 지오코딩)
// 전부 무료·키 없는 방식의 한계로 실제 배포 사이트에서 안정적으로 뜨지 않아서 제외함.
// 대신 주소 텍스트 + 복사 버튼 + "지도 앱에서 열기"(네이버지도) 링크로, 항상 확실히 동작하는 방식만 사용해요.

// 자주 묻는 질문 (앱 사용법 + 지원금 관련)
const FAQ_DATA = [
  { category: "앱 이용", q: "회원가입이 필요한가요?", a: "아니요. 로그인 없이 바로 사용할 수 있어요." },
  { category: "앱 이용", q: "즐겨찾기는 어디에 저장되나요?", a: "이 기기에만 저장돼요. 다른 기기에서는 안 보이니, 중요한 지원금은 따로 메모해두시는 게 안전해요." },
  { category: "앱 이용", q: "마감 임박 알림은 실제로 휴대폰에 오나요?", a: "아직은 화면 동작만 만들어둔 상태예요. 실제 알림이 오려면 개발 단계에서 추가로 연결해야 해요." },
  { category: "앱 이용", q: "개인정보를 수집하나요?", a: "로그인이 없어서 개인을 식별할 수 있는 정보를 서버에 저장하지 않아요. 자세한 내용은 MY 탭의 개인정보처리방침에서 확인할 수 있어요." },
  { category: "지원금", q: "신청은 앱에서 바로 되나요?", a: "아니요. 이 앱은 정보를 모아서 보여주는 역할이에요. 실제 신청은 각 지원금의 '신청하러 가기' 버튼을 눌러 이동한 공식 사이트에서 진행해요." },
  { category: "지원금", q: "지원금 여러 개를 동시에 받을 수 있나요?", a: "지원사업마다 달라요. 일부는 중복 지원이 제한되니, 신청 전에 각 지원금 상세화면의 지원대상을 꼭 확인하세요." },
  { category: "지원금", q: "여기 없는 지원금도 있나요?", a: "네. 전국에는 이 앱에 담긴 것보다 훨씬 많은 지원사업이 있어요. 지역센터나 소상공인24 공식 사이트에서 추가로 찾아보시는 것도 추천해요." },
  { category: "지원금", q: "정보가 예전 거 아닌가요?", a: "지원사업은 예산 상황에 따라 자주 바뀌어요. 앱에 나온 마감일·금액이 실제와 다를 수 있으니, 신청 전에는 반드시 공식 사이트에서 최종 확인하세요." },
  { category: "진단", q: "맞춤 진단은 얼마나 정확한가요?", a: "지역 조건은 정확히 반영되지만, 매출·업력 조건은 데이터가 구조화된 일부 지원금에만 정확히 적용돼요. 최종 확인은 상세화면에서 꼭 다시 하세요." },
  { category: "진단", q: "진단 결과를 다시 받고 싶어요", a: "MY 탭 > 맞춤 진단에서 언제든 다시 진행할 수 있어요." },
];

// Q&A 검색 화면 — 자주 묻는 질문을 검색하고, 그래도 궁금하면 콜센터로 연결해요
function FaqSearchScreen({ onBack }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [openIndex, setOpenIndex] = useState(null);
  const categories = ["전체", ...Array.from(new Set(FAQ_DATA.map((f) => f.category)))];

  const filtered = FAQ_DATA.filter((f) => {
    const matchesCategory = category === "전체" || f.category === category;
    const matchesQuery = query.trim() === "" || f.q.includes(query) || f.a.includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <HeroHeader icon={HelpCircle} color="#7A46D6" title="도움말 · Q&A" subtitle="자주 묻는 질문을 검색해서 바로 확인해요" onBack={onBack} />

      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: "#F5F6F9" }}>
        <Search size={16} color={MUTED} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="궁금한 내용을 검색해보세요"
          className="flex-1 outline-none text-sm bg-transparent"
          style={{ color: TEXT }}
        />
        {query && (
          <button onClick={() => setQuery("")}>
            <X size={14} color={MUTED} />
          </button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 -mx-5 px-5" style={{ scrollbarWidth: "none" }}>
        {categories.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap shrink-0"
              style={active ? { background: "#F3E7D3", color: "#7A5A2E" } : { background: "#F5F6F9", color: MUTED }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-14 text-sm" style={{ color: MUTED }}>
          검색 결과가 없어요.
          <br />
          다른 검색어로 다시 찾아보세요.
        </div>
      ) : (
        <div>
          {filtered.map((f, i) => (
            <div key={i} className="border-b py-3.5" style={{ borderColor: BORDER }}>
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between text-left gap-2">
                <span className="text-sm font-medium" style={{ color: TEXT }}>{f.q}</span>
                <ChevronDown
                  size={16}
                  color={MUTED}
                  className="shrink-0"
                  style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0)", transition: "0.15s" }}
                />
              </button>
              {openIndex === i && <p className="text-[12.5px] mt-2 leading-relaxed" style={{ color: MUTED }}>{f.a}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl p-4 mt-6 flex items-center gap-3" style={{ background: "#FAFAFB" }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: GREEN_SOFT }}>
          <Phone size={17} color={GREEN} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: TEXT }}>그래도 궁금한 점이 있으신가요?</p>
          <p className="text-[12px]" style={{ color: MUTED }}>소진공 콜센터 1533-0100로 편하게 물어보세요</p>
        </div>
      </div>
    </div>
  );
}

// 지원금 신청에 자주 필요한 공통 서류들 (실제 서류마다 발급처가 달라요)
const COMMON_DOCUMENTS = [
  { name: "사업자등록증", desc: "사업자 정보가 담긴 기본 서류", source: "정부24 또는 세무서", url: "https://www.gov.kr", online: true },
  { name: "사업자등록증명원", desc: "사업자등록증과 별도로 증명용으로 요구하는 경우가 많아요", source: "홈택스", url: "https://www.hometax.go.kr", online: true },
  { name: "소득금액증명원", desc: "매출·소득 확인용 (전년도 기준)", source: "홈택스", url: "https://www.hometax.go.kr", online: true },
  { name: "부가가치세과세표준증명", desc: "매출액 산정 기준으로 자주 요구돼요", source: "홈택스", url: "https://www.hometax.go.kr", online: true },
  { name: "지방세 세목별과세증명서", desc: "지방세 완납 여부 확인용", source: "정부24", url: "https://www.gov.kr", online: true },
  { name: "통장사본", desc: "지원금 입금 계좌 확인용, 사업자 명의 통장을 권장해요", source: "직접 촬영·스캔해서 준비", online: false },
  { name: "신분증", desc: "대표자 본인 확인용", source: "직접 준비", online: false },
  { name: "임대차계약서", desc: "사업장을 임차한 경우에만 필요해요", source: "직접 준비", online: false },
];

// 서류·양식 자료실 — 자주 필요한 서류를 체크리스트로 정리하고 발급처를 바로 연결해줘요
function DocumentsScreen({ onBack }) {
  const [checked, setChecked] = useState(new Set());
  const toggle = (name) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div>
      <HeroHeader icon={FileText} color="#C2410C" title="서류 · 양식 자료실" subtitle="지원금 신청 전에 자주 필요한 서류를 미리 챙겨두세요" onBack={onBack} />

      <div className="rounded-xl p-3.5 mb-4 flex items-start gap-2" style={{ background: "#FFF7ED" }}>
        <AlertTriangle size={14} color="#C2410C" className="shrink-0 mt-0.5" />
        <p className="text-[11.5px] leading-relaxed" style={{ color: "#9A3412" }}>
          지원금마다 요구하는 서류가 달라요. 아래는 대부분의 정책자금에서 공통으로 자주 쓰이는 서류예요. 경영안정바우처처럼 국세청 자료로 자동 확인해서 서류가 필요 없는 경우도 있으니, 신청 전 각 지원금 상세화면을 꼭 확인하세요.
        </p>
      </div>

      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[13px] font-bold" style={{ color: TEXT }}>공통 서류 체크리스트</p>
        <p className="text-[11.5px]" style={{ color: MUTED }}>{checked.size} / {COMMON_DOCUMENTS.length} 준비됨</p>
      </div>

      <div className="space-y-2">
        {COMMON_DOCUMENTS.map((doc) => {
          const isChecked = checked.has(doc.name);
          return (
            <div key={doc.name} className="rounded-xl p-3.5 flex items-start gap-3" style={{ background: "#FAFAFB" }}>
              <button
                onClick={() => toggle(doc.name)}
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border"
                style={isChecked ? { background: GREEN, borderColor: GREEN } : { background: "white", borderColor: BORDER }}
              >
                {isChecked && <Check size={14} color="white" strokeWidth={3} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: isChecked ? MUTED : TEXT, textDecoration: isChecked ? "line-through" : "none" }}>
                  {doc.name}
                </p>
                <p className="text-[11.5px] mt-0.5 leading-relaxed" style={{ color: MUTED }}>{doc.desc}</p>
                {doc.online ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold mt-1.5"
                    style={{ color: BLUE }}
                  >
                    {doc.source}에서 발급받기 <ExternalLink size={10} />
                  </a>
                ) : (
                  <p className="text-[11px] mt-1.5" style={{ color: "#B7BCC9" }}>{doc.source}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] mt-5" style={{ color: MUTED }}>
        * 체크 표시는 이 화면을 벗어나면 초기화돼요. 준비 상태를 계속 기억하려면 나중에 저장 기능을 연결하면 좋아요.
      </p>
    </div>
  );
}

// 세금·마감 일정 화면 — 세금 신고일 + 즐겨찾기한 지원금 마감일을 한 곳에서 보여줘요
function TaxScheduleScreen({ onBack, favorites }) {
  const favoritePrograms = ALL_PROGRAMS.filter((p) => favorites.has(p.id)).map((p) => ({
    name: p.name,
    deadline: p.deadline,
    type: "subsidy",
  }));
  const taxItems = TAX_SCHEDULE.map((t) => ({ name: t.name, deadline: t.deadline, note: t.note, type: "tax" }));
  const all = [...taxItems, ...favoritePrograms].sort((a, b) => getDday(a.deadline) - getDday(b.deadline));

  return (
    <div>
      <HeroHeader icon={CalendarCheck} color="#2C9F6B" title="세금·마감 일정" subtitle="세금 신고일과 즐겨찾기한 지원금 마감일을 한눈에 확인해요" onBack={onBack} />

      <div className="space-y-2">
        {all.map((item, i) => {
          const dday = getDday(item.deadline);
          const color = urgencyColor(dday);
          return (
            <div key={i} className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: "#FAFAFB" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: item.type === "tax" ? "#E7F7EF" : BLUE_SOFT }}
              >
                {item.type === "tax" ? <Landmark size={17} color="#2C9F6B" /> : <Heart size={16} color={BLUE} fill={BLUE} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: TEXT }}>{item.name}</p>
                <p className="text-[11.5px] mt-0.5 truncate" style={{ color: MUTED }}>
                  {item.deadline}
                  {item.note ? ` · ${item.note}` : ""}
                </p>
              </div>
              <p className="text-[13px] font-bold shrink-0" style={{ color }}>{dday >= 0 ? `D-${dday}` : "완료"}</p>
            </div>
          );
        })}
      </div>

      {favoritePrograms.length === 0 && (
        <p className="text-[11.5px] text-center py-4" style={{ color: MUTED }}>
          즐겨찾기한 지원금이 없어요. 지원금 목록에서 하트를 눌러보시면 마감일이 여기도 같이 표시돼요.
        </p>
      )}

      <p className="text-[11px] mt-5" style={{ color: MUTED }}>
        * 세금 일정은 개인 일반과세자 기준 대략적인 날짜예요. 간이과세자·법인·성실신고확인대상자 등은 신고 기한이 다를 수 있으니 홈택스나 세무사를 통해 정확한 일정을 꼭 확인하세요.
      </p>
    </div>
  );
}

// 지역센터 찾기 화면 — 소진공 지역본부 실제 주소·연락처를 보여줘요
function RegionalCentersScreen({ onBack, initialProvince }) {
  const [activeProvince, setActiveProvince] = useState(initialProvince || "전체");
  const [page, setPage] = useState(1);
  const provinceScrollRef = useRef(null);
  const provinceChipRefs = useRef({});
  const PAGE_SIZE = 8;
  const provinces = ["전체", ...CENTER_GROUPS.map((g) => g.label)];
  const activeGroup = CENTER_GROUPS.find((g) => g.label === activeProvince);
  const visibleCenters =
    activeProvince === "전체"
      ? REGIONAL_CENTERS
      : REGIONAL_CENTERS.filter((c) => activeGroup && c.covers.some((cv) => activeGroup.members.includes(cv)));
  const totalPages = Math.max(1, Math.ceil(visibleCenters.length / PAGE_SIZE));
  const pagedCenters = visibleCenters.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectProvince = (p) => {
    setActiveProvince(p);
    setPage(1);
  };
  useEffect(() => {
    provinceChipRefs.current[activeProvince]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeProvince]);

  return (
    <div>
      <HeroHeader icon={MapPin} color="#D6478E" title="지역센터 찾기" subtitle="가까운 소상공인시장진흥공단 센터를 찾아보세요" onBack={onBack} />

      <div className="rounded-2xl p-3.5 mb-4" style={{ background: "#FDF3D9" }}>
        <div className="flex items-start gap-2 mb-2.5">
          <AlertTriangle size={15} color="#B8860B" className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[12.5px] font-bold" style={{ color: "#8A6200" }}>
              2026년 조직개편으로 지역본부가 재편됐어요
            </p>
            <p className="text-[11.5px] mt-1" style={{ color: "#8A6200" }}>
              일부 신설 지역본부는 상세주소를 아직 확인 중이에요. 방문 전에는 아래 콜센터나 공식 사이트에서 최신 정보를 꼭 다시 확인해주세요.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="tel:1533-0100"
            className="flex-1 py-2 rounded-xl text-center text-[12px] font-bold flex items-center justify-center gap-1"
            style={{ background: "#FFFFFF", color: "#8A6200" }}
          >
            <Phone size={12} /> 통합콜센터 1533-0100
          </a>
          <a
            href="https://www.semas.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-xl text-center text-[12px] font-bold flex items-center justify-center gap-1"
            style={{ background: "#FFFFFF", color: "#8A6200" }}
          >
            <ExternalLink size={12} /> 공식 사이트
          </a>
        </div>
        <p className="text-[11px] mt-2 px-0.5" style={{ color: "#8A6200" }}>
          급하게 전화 상담이 필요하면 중소기업 통합콜센터 <a href="tel:1357" className="font-bold underline">1357</a>로도 문의할 수 있어요
        </p>
      </div>

      <style>{`
        @keyframes centerPageFadeIn { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="-mx-5 px-5 mb-3.5">
        <div
          ref={provinceScrollRef}
          className="flex gap-1.5 overflow-x-auto pb-1"
          style={{
            scrollbarWidth: "none",
            WebkitMaskImage: "linear-gradient(to right, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)",
          }}
        >
          {provinces.map((p) => (
            <button
              key={p}
              ref={(el) => (provinceChipRefs.current[p] = el)}
              onClick={() => selectProvince(p)}
              className="shrink-0 px-3 py-1.5 rounded-full text-[12.5px] font-semibold"
              style={
                activeProvince === p
                  ? { background: BLUE, color: "white" }
                  : { background: "#F2F3F7", color: MUTED }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div key={activeProvince} style={{ animation: "centerPageFadeIn 0.22s ease" }}>
      <div className="space-y-2.5">
        {pagedCenters.map((c) => (
          <div
            key={c.name}
            className="rounded-2xl border p-4"
            style={c.isHQ ? { borderColor: BLUE, background: BLUE_SOFT } : { borderColor: BORDER }}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-[14.5px] font-bold flex items-center gap-1" style={{ color: c.isHQ ? BLUE : TEXT }}>
                {c.isHQ && <MapPin size={14} color={BLUE} />} {c.name}
              </p>
              {!c.districts && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={
                    c.addressPending
                      ? { background: "#FDEDED", color: RED }
                      : { background: "#FDF3D9", color: "#8A6200" }
                  }
                >
                  {c.addressPending ? "주소 확인 중" : "2026년 기준"}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {(c.districts || c.covers).map((r) => (
                <span key={r} className="text-[10.5px] px-1.5 py-0.5 rounded-full" style={{ background: c.isHQ ? "white" : BLUE_SOFT, color: BLUE }}>{r}</span>
              ))}
            </div>
            {c.addressPending ? (
              <p className="text-[12.5px] mb-3 flex items-start gap-1.5" style={{ color: MUTED }}>
                <MapPin size={13} className="shrink-0 mt-0.5" /> {c.city} 인근 (2026년 조직개편으로 신설 · 정확한 상세주소는 아직 확인 중이에요)
              </p>
            ) : (
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-[12.5px] flex items-start gap-1.5" style={{ color: MUTED }}>
                  <MapPin size={13} className="shrink-0 mt-0.5" /> {c.address}
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(c.address)}
                  className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: "#EEF0F5", color: TEXT }}
                >
                  복사
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <a
                href={`tel:${c.phone}`}
                className="flex-1 py-2.5 rounded-xl text-center text-[12.5px] font-bold flex items-center justify-center gap-1"
                style={{ background: BLUE_SOFT, color: BLUE }}
              >
                <Phone size={13} /> {c.addressPending ? "콜센터로 문의" : c.phone}
              </a>
              {!c.addressPending && (
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(c.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl text-center text-[12.5px] font-bold flex items-center justify-center gap-1"
                  style={{ background: "#F2F3F7", color: TEXT }}
                >
                  <MapPin size={13} /> 지도 앱에서 열기
                </a>
              )}
            </div>
            {c.fax && (
              <p className="text-[11px] mt-2" style={{ color: MUTED }}>팩스 {c.fax}</p>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ color: page === 1 ? "#C7CBD6" : TEXT }}
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className="w-8 h-8 rounded-full text-[13px] font-bold"
              style={n === page ? { background: BLUE, color: "white" } : { color: MUTED }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ color: page === totalPages ? "#C7CBD6" : TEXT }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
      </div>

      <a
        href="https://mgr.sbiz.or.kr/cm/CM_10301_SL.do"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-4 py-3 rounded-xl text-center text-[12.5px] font-semibold flex items-center justify-center gap-1"
        style={{ background: "#FAFAFA", color: MUTED }}
      >
        공식 사이트에서 전체 센터 보기 <ExternalLink size={12} />
      </a>
    </div>
  );
}

// ---- 맞춤 진단(온보딩) ----
function DiagnosisWizard({ onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ region: null, revenueBand: null, yearsBand: null });

  const STEPS = [
    {
      key: "region",
      question: "사업장이 있는 지역이 어디인가요?",
      grid: true,
      options: REGIONS.filter((r) => r !== "전체").map((r) => ({ key: r, label: r })),
    },
    {
      key: "revenueBand",
      question: "최근 1년 연매출은 어느 정도인가요?",
      options: [
        { key: "under30", label: "3천만원 이하" },
        { key: "30to100", label: "3천만원 ~ 1억원" },
        { key: "100to140", label: "1억원 ~ 1억 4백만원" },
        { key: "over140", label: "1억 4백만원 초과" },
      ],
    },
    {
      key: "yearsBand",
      question: "사업을 시작한 지 얼마나 되셨나요?",
      options: [
        { key: "under1", label: "1년 미만" },
        { key: "1to3", label: "1~3년" },
        { key: "over3", label: "3년 이상" },
      ],
    },
  ];

  const current = STEPS[step];

  const pick = (value) => {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(next);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => (step === 0 ? onBack() : setStep(step - 1))}
          className="navArrowBtn w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center shrink-0"
        >
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div className="flex-1 flex gap-1">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= step ? BLUE : "#EDEEF2" }} />
          ))}
        </div>
      </div>

      <p className="text-[11.5px] font-bold mb-1.5" style={{ color: BLUE }}>{step + 1} / {STEPS.length}</p>
      <h2 className="text-[19px] font-bold mb-6 leading-snug" style={{ color: TEXT }}>{current.question}</h2>

      {current.grid ? (
        <div className="grid grid-cols-3 gap-2">
          {current.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => pick(opt.key)}
              className="py-2.5 rounded-lg border text-sm"
              style={{ borderColor: BORDER, color: TEXT }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {current.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => pick(opt.key)}
              className="w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium"
              style={{ borderColor: BORDER, color: TEXT }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] mt-6" style={{ color: MUTED }}>
        * 30초면 끝나요. 답변은 나중에 MY 탭에서 다시 바꿀 수 있어요.
      </p>
    </div>
  );
}

function DiagnosisResultScreen({ diagnosis, onBack, onRedo, onClear, onViewAll, onSelectProgram, statusFilter, setStatusFilter }) {
  const matched = ALL_PROGRAMS.filter((p) => matchesDiagnosis(p, diagnosis));
  const urgent = matched.filter((p) => {
    const d = getDday(p.deadline);
    return d <= 7 && d >= 0;
  }).length;
  const available = matched.length - urgent;

  const filtered = matched
    .filter((p) => {
      const d = getDday(p.deadline);
      if (statusFilter === "urgent") return d <= 7 && d >= 0;
      if (statusFilter === "available") return d > 7;
      return true;
    })
    .sort((a, b) => getDday(a.deadline) - getDday(b.deadline));

  return (
    <div>
      <SectionHeader
        title="맞춤 지원금 결과"
        onBack={onBack}
        right={
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onRedo} className="text-[11.5px] font-semibold" style={{ color: BLUE }}>
              다시 진단
            </button>
            <span className="w-px h-3" style={{ background: BORDER }} />
            <button onClick={onClear} className="text-[11.5px] font-semibold" style={{ color: MUTED }}>
              초기화
            </button>
          </div>
        }
      />

      <div className="rounded-2xl p-5 mb-3" style={{ background: BLUE }}>
        <div className="flex items-center gap-1.5 mb-2">
          <CheckCircle2 size={16} color="white" />
          <p className="text-[12.5px]" style={{ color: "#C6D3FA" }}>사장님이 받을 수 있는</p>
        </div>
        <p className="text-white font-extrabold text-[21px] leading-snug">지원금이 총 {matched.length}건 있어요!</p>
        <p className="text-[12px] mt-1" style={{ color: "#C6D3FA" }}>확인하고 신청해보세요.</p>
      </div>

      <button
        onClick={onViewAll}
        className="w-full flex items-center justify-center gap-1 py-2.5 mb-4 rounded-xl text-[12px] font-semibold"
        style={{ background: "#F5F6F9", color: MUTED }}
      >
        진단 조건과 상관없이 전체 지원금 보기 <ChevronRight size={13} />
      </button>

      <div className="flex gap-1.5 mb-4">
        {[
          { key: "all", label: "전체", count: matched.length },
          { key: "available", label: "신청가능", count: available },
          { key: "urgent", label: "마감임박", count: urgent },
        ].map((s) => {
          const active = statusFilter === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={active ? { background: "#F3E7D3", color: "#7A5A2E" } : { background: "#F5F6F9", color: MUTED }}
            >
              {s.label} <span style={{ opacity: 0.75 }}>({s.count})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sm" style={{ color: MUTED }}>
          조건에 맞는 지원금이 아직 없어요.
          <br />
          "지원금 전체보기"에서 더 찾아보세요.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => {
            const dday = getDday(p.deadline);
            const color = urgencyColor(dday);
            const catStyle = CATEGORY_COLORS[p.category] || { color: BLUE, bg: BLUE_SOFT, bg2: BLUE_SOFT };
            const CatIcon = CATEGORY_ICON[p.category] || Wallet;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProgram(p.id)}
                className="w-full text-left rounded-xl p-3.5 flex items-center gap-3"
                style={{ background: "#FAFAFB" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${catStyle.bg2}, ${catStyle.bg})` }}
                >
                  <CatIcon size={19} color={catStyle.color} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  {dday <= 7 && dday >= 0 && (
                    <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded mb-0.5 inline-block" style={{ background: RED_SOFT, color: RED }}>
                      마감임박
                    </span>
                  )}
                  <p className="text-[15px] font-bold truncate" style={{ color: TEXT }}>{p.name}</p>
                  <p className="text-[11.5px] mt-0.5" style={{ color: MUTED }}>{p.region} · {p.amountLabel}</p>
                </div>
                <p className="text-[13px] font-bold shrink-0" style={{ color }}>{dday >= 0 ? `D-${dday}` : "마감"}</p>
              </button>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-center mt-6" style={{ color: MUTED }}>
        * 지역은 정확히 반영되고, 매출·업력 조건은 정보가 구조화된 일부 지원금에만 정확히 적용돼요. 나머지는 상세화면에서 조건을 꼭 확인하세요.
      </p>
    </div>
  );
}


// 상단 히어로 배너용 장식 일러스트 (반투명 코인 스택)
function HeroCoinArt() {
  return (
    <svg viewBox="0 0 160 140" className="w-36 h-32">
      <ellipse cx="120" cy="108" rx="34" ry="12" fill="rgba(255,255,255,0.14)" />
      <ellipse cx="120" cy="96" rx="34" ry="12" fill="rgba(255,255,255,0.18)" />
      <ellipse cx="120" cy="84" rx="34" ry="12" fill="rgba(255,255,255,0.26)" />
      <text x="120" y="90" textAnchor="middle" fontSize="15" fontWeight="800" fill="rgba(255,255,255,0.85)">₩</text>
      <ellipse cx="58" cy="118" rx="24" ry="9" fill="rgba(255,255,255,0.12)" />
      <ellipse cx="58" cy="109" rx="24" ry="9" fill="rgba(255,255,255,0.18)" />
      <path d="M132 40 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}

// "경영" 카테고리용 커스텀 아이콘 — 막대그래프 + 상승 화살표를 합친 차트 느낌
// 돈주머니 일러스트 — 맞춤 진단 CTA용. sharp 렌더링으로 큰/56px/40px 검증 완료
function MoneyBagArt({ className = "w-20 h-20" }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="coinFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="100%" stopColor="#F2A72A" />
        </linearGradient>
        <linearGradient id="stackSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6CE6E" />
          <stop offset="100%" stopColor="#D98F1E" />
        </linearGradient>
      </defs>

      {/* 뒤쪽 동전 스택(옆에서 본 원통형) */}
      <g>
        <ellipse cx="72" cy="70" rx="24" ry="8.5" fill="url(#stackSide)" stroke="#8A5A1A" strokeWidth="1.8" />
        <ellipse cx="72" cy="62" rx="24" ry="8.5" fill="url(#stackSide)" stroke="#8A5A1A" strokeWidth="1.8" />
        <ellipse cx="72" cy="54" rx="24" ry="8.5" fill="url(#stackSide)" stroke="#8A5A1A" strokeWidth="1.8" />
        <ellipse cx="72" cy="46" rx="24" ry="8.5" fill="url(#stackSide)" stroke="#8A5A1A" strokeWidth="1.8" />
        <ellipse cx="72" cy="38" rx="24" ry="8.5" fill="url(#coinFace)" stroke="#8A5A1A" strokeWidth="2" />
        <text x="72" y="43" textAnchor="middle" fontSize="18" fontWeight="800" fill="#8A5A1A">₩</text>
      </g>

      {/* 앞쪽 동전(정면) */}
      <circle cx="34" cy="66" r="33" fill="url(#coinFace)" stroke="#8A5A1A" strokeWidth="2.4" />
      <circle cx="34" cy="66" r="26" fill="none" stroke="#E8B93A" strokeWidth="1.8" opacity="0.6" />
      <text x="34" y="79" textAnchor="middle" fontSize="46" fontWeight="800" fill="#8A5A1A">₩</text>
    </svg>
  );
}

function TrendChartIcon({ size = 24, color = "currentColor", strokeWidth = 2, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect x="3.5" y="14" width="3.2" height="7" rx="1" fill={color} opacity="0.55" />
      <rect x="9" y="10" width="3.2" height="11" rx="1" fill={color} opacity="0.7" />
      <rect x="14.5" y="6" width="3.2" height="15" rx="1" fill={color} opacity="0.85" />
      <path
        d="M3 12.5L9 7.5L13 10.5L21 3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 3H21V8.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlarmTileArt() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      <defs>
        <linearGradient id="alarmFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBC15B" />
          <stop offset="100%" stopColor="#E08A2C" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="24" r="7" fill="#E08A2C" />
      <circle cx="74" cy="24" r="7" fill="#E08A2C" />
      <rect x="46" y="6" width="8" height="14" rx="4" fill="#C97A22" />
      <circle cx="50" cy="56" r="34" fill="url(#alarmFace)" stroke="#C97A22" strokeWidth="2" />
      <ellipse cx="38" cy="43" rx="9" ry="6" fill="rgba(255,255,255,0.35)" />
      <line x1="50" y1="56" x2="50" y2="38" stroke="#7A4A12" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="56" x2="64" y2="56" stroke="#7A4A12" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="50" cy="56" r="3" fill="#7A4A12" />
      <path d="M76 18 Q86 22 85 32" stroke="#F2A94A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M83 11 Q97 17 95 32" stroke="#F2A94A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function SearchPinTileArt() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      <defs>
        <linearGradient id="glassFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FBD8E8" />
        </linearGradient>
      </defs>
      <rect x="60" y="60" width="14" height="34" rx="7" transform="rotate(45 67 77)" fill="#D6478E" />
      <circle cx="44" cy="44" r="30" fill="url(#glassFill)" stroke="#D6478E" strokeWidth="5" />
      <path d="M44 25c-8 0-15 6.5-15 15 0 11 15 24 15 24s15-13 15-24c0-8.5-7-15-15-15z" fill="#D6478E" />
      <circle cx="44" cy="40" r="5.5" fill="white" />
      <ellipse cx="32" cy="27" rx="7" ry="4" fill="rgba(255,255,255,0.6)" />
      <path d="M76 20 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill="#F3A9C9" />
    </svg>
  );
}

function CoinTileArt() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      <defs>
        <linearGradient id="coinTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6FDBA6" />
          <stop offset="100%" stopColor="#1E9A5C" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="72" rx="30" ry="10" fill="#B9EBD1" />
      <ellipse cx="50" cy="60" rx="30" ry="10" fill="#8FE0BA" />
      <ellipse cx="50" cy="46" rx="30" ry="10" fill="url(#coinTop)" />
      <text x="50" y="51" textAnchor="middle" fontSize="17" fontWeight="800" fill="white">₩</text>
      <path d="M75 20 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5 Z" fill="#BFF2D8" />
    </svg>
  );
}

function MegaphoneTileArt() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      <defs>
        <linearGradient id="megaBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B48CFF" />
          <stop offset="100%" stopColor="#7A46D6" />
        </linearGradient>
      </defs>
      <rect x="16" y="46" width="14" height="20" rx="4" fill="#5E32B0" />
      <path d="M30 40 L64 20 V86 L30 66 Z" fill="url(#megaBody)" />
      <ellipse cx="64" cy="53" rx="10" ry="33" fill="url(#megaBody)" />
      <path d="M40 66 l-4 16c-1 4 2 7 6 6l6-2 -3-20Z" fill="#5E32B0" />
      <path d="M78 34 Q90 40 88 52" stroke="#D9C6FF" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M82 24 Q100 32 96 50" stroke="#D9C6FF" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="20" cy="30" r="5" fill="#F3A9C9" />
    </svg>
  );
}

function CalculatorTileArt() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      <defs>
        <linearGradient id="calcBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8FA6F5" />
          <stop offset="100%" stopColor="#3D63DD" />
        </linearGradient>
      </defs>
      <rect x="22" y="10" width="56" height="80" rx="12" fill="url(#calcBody)" />
      <rect x="30" y="20" width="40" height="16" rx="4" fill="rgba(255,255,255,0.92)" />
      <text x="66" y="32" textAnchor="end" fontSize="11" fontWeight="800" fill="#3D63DD">1,250</text>
      <g fill="rgba(255,255,255,0.55)">
        <rect x="30" y="44" width="10" height="8" rx="2" />
        <rect x="45" y="44" width="10" height="8" rx="2" />
        <rect x="60" y="44" width="10" height="8" rx="2" />
        <rect x="30" y="56" width="10" height="8" rx="2" />
        <rect x="45" y="56" width="10" height="8" rx="2" />
        <rect x="60" y="56" width="10" height="8" rx="2" />
        <rect x="30" y="68" width="10" height="8" rx="2" />
        <rect x="45" y="68" width="10" height="8" rx="2" />
      </g>
      <rect x="60" y="68" width="10" height="8" rx="2" fill="#FBC15B" />
      <path d="M78 18 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5 Z" fill="#C9D6FF" />
    </svg>
  );
}

function FolderBellArt() {
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 shrink-0">
      <defs>
        <linearGradient id="folderBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6B8AF5" />
          <stop offset="100%" stopColor="#3D63DD" />
        </linearGradient>
      </defs>
      <path d="M10 34 h30 l8 10 h42 v42 a6 6 0 0 1 -6 6 h-68 a6 6 0 0 1 -6 -6 z" fill="url(#folderBody)" />
      <rect x="18" y="50" width="50" height="6" rx="3" fill="rgba(255,255,255,0.55)" />
      <rect x="18" y="62" width="36" height="6" rx="3" fill="rgba(255,255,255,0.4)" />
      <circle cx="78" cy="26" r="14" fill="#E5484D" />
      <path d="M78 18 a7 7 0 0 1 7 7 v4 l3 4 h-20 l3 -4 v-4 a7 7 0 0 1 7 -7z" fill="white" />
      <path d="M75 33 a3 3 0 0 0 6 0" fill="white" />
    </svg>
  );
}

// 실시간 검색어 스타일 상위 3개 랭킹 (주기적으로 순위가 흔들리는 느낌을 연출)
const ROW_H = 36; // px, 한 행의 높이 (인기 지원금을 작게 보이도록 축소)
function LiveTopRanking({ onSelect }) {
  const pool = useMemo(
    () => [...ALL_PROGRAMS].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 5),
    []
  );
  const scoresRef = useRef(
    pool.reduce((acc, p) => ({ ...acc, [p.id]: p.popularity || 0 }), {})
  );
  const initialOrder = useMemo(() => pool.map((p) => p.id), [pool]);
  const rankOrderRef = useRef(initialOrder);
  const [rankOrder, setRankOrder] = useState(initialOrder);
  const [prevRankOrder, setPrevRankOrder] = useState(initialOrder);

  useEffect(() => {
    const id = setInterval(() => {
      pool.forEach((p) => {
        scoresRef.current[p.id] = Math.max(10, scoresRef.current[p.id] + (Math.random() - 0.5) * 70);
      });
      const newOrder = pool.map((p) => p.id).sort((a, b) => scoresRef.current[b] - scoresRef.current[a]);
      setPrevRankOrder(rankOrderRef.current);
      rankOrderRef.current = newOrder;
      setRankOrder(newOrder);
    }, 3500);
    return () => clearInterval(id);
  }, [pool]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: ROW_H * 3 }}
    >
      {rankOrder.map((id, index) => {
        const program = pool.find((p) => p.id === id);
        const rank = index + 1;
        const prevIndex = prevRankOrder.indexOf(id);
        const prevRank = prevIndex === -1 ? rank : prevIndex + 1;
        const diff = prevRank - rank; // 양수면 순위 상승
        return (
          <button
            key={id}
            onClick={() => onSelect(program.id)}
            className="absolute left-0 right-0 flex items-center gap-2.5 px-1"
            style={{
              top: index * ROW_H,
              height: ROW_H,
              transition: "top 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <span
              className="text-[13px] font-extrabold w-4 shrink-0 text-center tabular-nums"
              style={{ color: rank <= 3 ? RED : MUTED }}
            >
              {rank}
            </span>
            <span className="text-[12px] font-semibold truncate flex-1 text-left" style={{ color: TEXT }}>
              {program.name}
            </span>
            <span className="flex items-center gap-0.5 shrink-0 w-7 justify-end">
              {diff > 0 && (
                <>
                  <ChevronUp size={10} color={GREEN} strokeWidth={3} />
                  <span className="text-[9.5px] font-bold tabular-nums" style={{ color: GREEN }}>{diff}</span>
                </>
              )}
              {diff < 0 && (
                <>
                  <ChevronDown size={10} color={BLUE} strokeWidth={3} />
                  <span className="text-[9.5px] font-bold tabular-nums" style={{ color: BLUE }}>{-diff}</span>
                </>
              )}
              {diff === 0 && <Minus size={9} color={MUTED} strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---- 사장님 필수 계산기 툴킷 ----
function useNumberInput(initial) {
  const [raw, setRaw] = useState(initial);
  const num = Number(String(raw).replace(/[^0-9.]/g, "")) || 0;
  const onChange = (e) => setRaw(e.target.value.replace(/[^0-9.]/g, ""));
  return [num, raw, onChange];
}

function CalcNumberField({ label, value, onChange, suffix, placeholder }) {
  return (
    <div className="mb-4">
      <p className="text-[13px] font-semibold mb-1.5" style={{ color: TEXT }}>{label}</p>
      <div className="flex items-center rounded-xl px-3.5 py-3" style={{ background: "#F5F6F9" }}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[16px] font-semibold"
          style={{ color: TEXT }}
        />
        {suffix && <span className="text-[13px] font-medium ml-2" style={{ color: MUTED }}>{suffix}</span>}
      </div>
    </div>
  );
}

function CalcResultCard({ rows }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: BLUE_SOFT }}>
      <div className="flex items-center gap-1.5 mb-3">
        <ClipboardIcon />
        <p className="text-[13px] font-bold" style={{ color: TEXT }}>계산 결과</p>
      </div>
      <div className="space-y-2.5">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between"
            style={i > 0 ? { borderTop: `1px solid rgba(61,99,221,0.12)`, paddingTop: 10 } : {}}
          >
            <span className={row.primary ? "text-[13.5px] font-semibold" : "text-[13px]"} style={{ color: row.primary ? TEXT : row.tone === "red" ? RED : MUTED }}>{row.label}</span>
            <span className={row.primary ? "text-[23px] font-extrabold" : "text-[15px] font-bold"} style={{ color: row.primary ? BLUE : row.tone === "red" ? RED : TEXT }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke={BLUE} strokeWidth="2" />
      <rect x="9" y="2.5" width="6" height="3.5" rx="1" fill={BLUE} />
      <path d="M8.5 11h7M8.5 15h7" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function won(n) {
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

function MarginCalc() {
  const [cost, costRaw, onCostChange] = useNumberInput("8,000");
  const [margin, marginRaw, onMarginChange] = useNumberInput("30");
  const marginAmount = cost * (margin / 100);
  const price = cost + marginAmount;
  return (
    <div>
      <p className="text-[12.5px] mb-4" style={{ color: MUTED }}>원가 및 마진율 설정</p>
      <CalcNumberField label="상품 원가 (원)" value={costRaw} onChange={onCostChange} placeholder="8,000" suffix="원" />
      <CalcNumberField label="목표 마진율 (%)" value={marginRaw} onChange={onMarginChange} placeholder="30" suffix="%" />
      <CalcResultCard
        rows={[
          { label: "권장 판매가격", value: won(price), primary: true },
          { label: "마진액", value: won(marginAmount), tone: "red" },
        ]}
      />
    </div>
  );
}

function VatSplitCalc() {
  const [total, totalRaw, onTotalChange] = useNumberInput("110,000");
  const supply = total / 1.1;
  const vat = total - supply;
  return (
    <div>
      <p className="text-[12.5px] mb-4" style={{ color: MUTED }}>부가세 포함 판매가 입력</p>
      <CalcNumberField label="판매가 (부가세 포함, 원)" value={totalRaw} onChange={onTotalChange} placeholder="110,000" suffix="원" />
      <CalcResultCard
        rows={[
          { label: "부가세 (10%)", value: won(vat), primary: true },
          { label: "공급가액", value: won(supply) },
        ]}
      />
    </div>
  );
}

function WeeklyAllowanceCalc() {
  const [wage, wageRaw, onWageChange] = useNumberInput("10,320");
  const [hours, hoursRaw, onHoursChange] = useNumberInput("40");
  const eligible = hours >= 15;
  const cappedHours = Math.min(hours, 40);
  const allowance = eligible ? (cappedHours / 40) * 8 * wage : 0;
  return (
    <div>
      <p className="text-[12.5px] mb-4" style={{ color: MUTED }}>시급 및 주 근무시간 입력</p>
      <CalcNumberField label="시급 (원)" value={wageRaw} onChange={onWageChange} placeholder="10,320" suffix="원" />
      <CalcNumberField label="1주 근무시간 (시간)" value={hoursRaw} onChange={onHoursChange} placeholder="40" suffix="시간" />
      {!eligible && (
        <div className="rounded-xl px-3.5 py-3 mb-4 flex items-start gap-2" style={{ background: RED_SOFT }}>
          <Info size={13} color={RED} className="shrink-0 mt-0.5" />
          <p className="text-[12px]" style={{ color: RED }}>1주 15시간 미만 근무는 주휴수당 지급 대상이 아니에요.</p>
        </div>
      )}
      <CalcResultCard
        rows={[{ label: "주휴수당 (1주 기준)", value: won(allowance), primary: true }]}
      />
    </div>
  );
}

function LoanInterestCalc() {
  const [principal, principalRaw, onPrincipalChange] = useNumberInput("30,000,000");
  const [rate, rateRaw, onRateChange] = useNumberInput("4.5");
  const [months, monthsRaw, onMonthsChange] = useNumberInput("12");
  const [method, setMethod] = useState("bullet"); // "bullet" | "equalPI"

  const monthlyRate = rate / 100 / 12;

  // 만기일시상환: 매달 이자만 내고, 만기에 원금을 한 번에 상환
  const bulletMonthlyPay = principal * monthlyRate;
  const bulletTotalInterest = bulletMonthlyPay * months;

  // 원리금균등상환: 매달 원금+이자를 합쳐 똑같은 금액을 상환
  const n = Math.max(1, Math.round(months));
  const equalPIMonthlyPay =
    monthlyRate === 0
      ? principal / n
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const equalPITotalPay = equalPIMonthlyPay * n;
  const equalPITotalInterest = equalPITotalPay - principal;

  return (
    <div>
      <p className="text-[12.5px] mb-4" style={{ color: MUTED }}>대출 조건 입력</p>
      <CalcNumberField label="대출 원금 (원)" value={principalRaw} onChange={onPrincipalChange} placeholder="30,000,000" suffix="원" />
      <CalcNumberField label="연 이자율 (%)" value={rateRaw} onChange={onRateChange} placeholder="4.5" suffix="%" />
      <CalcNumberField label="대출 기간 (개월)" value={monthsRaw} onChange={onMonthsChange} placeholder="12" suffix="개월" />

      <p className="text-[13px] font-semibold mb-1.5" style={{ color: TEXT }}>상환 방식</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { key: "bullet", label: "만기일시상환\n(매달 이자만)" },
          { key: "equalPI", label: "원리금균등상환\n(매달 동일금액)" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => setMethod(m.key)}
            className="px-3 py-2.5 rounded-xl text-[12.5px] font-semibold text-center whitespace-pre-line leading-snug"
            style={
              method === m.key
                ? { background: BLUE, color: "white" }
                : { background: "#F2F3F7", color: MUTED }
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {method === "bullet" ? (
        <CalcResultCard
          rows={[
            { label: "월 상환액 (이자만)", value: won(bulletMonthlyPay), primary: true },
            { label: `총 이자 (${n}개월)`, value: won(bulletTotalInterest) },
            { label: "만기 시 별도 상환", value: won(principal) },
          ]}
        />
      ) : (
        <CalcResultCard
          rows={[
            { label: "월 상환액 (원리금 합계)", value: won(equalPIMonthlyPay), primary: true },
            { label: `총 상환액 (${n}개월)`, value: won(equalPITotalPay) },
            { label: "총 이자", value: won(equalPITotalInterest) },
          ]}
        />
      )}
      <p className="text-[11px] mt-3" style={{ color: MUTED }}>
        {method === "bullet"
          ? "* 만기일시상환은 매달 이자만 내다가 만기에 원금을 한 번에 갚는 방식이에요. 실제 상품마다 조건이 달라질 수 있어요."
          : "* 원리금균등상환은 매달 똑같은 금액을 내는 방식으로, 초반엔 이자 비중이 크고 갈수록 원금 비중이 커져요. 참고용 계산이에요."}
      </p>
    </div>
  );
}

function InsuranceCalc() {
  const [pay, payRaw, onPayChange] = useNumberInput("2,500,000");
  // 2026년 기준 요율: 국민연금 9.5%(각 4.75%), 건강보험 7.19%(각 3.595%),
  // 장기요양보험 = 건강보험료 × 13.14%(각 절반), 고용보험 근로자 0.9% / 사업주 약 1.15%(사업장 규모별 상이)
  const pension = pay * 0.0475;
  const health = pay * 0.03595;
  const healthTotal = health * 2;
  const ltcTotal = healthTotal * 0.1314;
  const ltc = ltcTotal / 2;
  const employmentWorker = pay * 0.009;
  const employmentEmployer = pay * 0.0115;
  const injuryEmployer = pay * 0.007; // 업종별 상이, 평균 참고치

  const workerTotal = pension + health + ltc + employmentWorker;
  const employerTotal = pension + health + ltc + employmentEmployer + injuryEmployer;
  const totalLaborCost = pay + employerTotal;

  const breakdown = [
    { label: "국민연금", worker: pension, employer: pension },
    { label: "건강보험", worker: health, employer: health },
    { label: "장기요양보험", worker: ltc, employer: ltc },
    { label: "고용보험", worker: employmentWorker, employer: employmentEmployer },
    { label: "산재보험", worker: 0, employer: injuryEmployer },
  ];

  return (
    <div>
      <p className="text-[12.5px] mb-4" style={{ color: MUTED }}>월 급여 입력</p>
      <CalcNumberField label="월 급여 (세전, 원)" value={payRaw} onChange={onPayChange} placeholder="2,500,000" suffix="원" />

      <p className="text-[13px] font-bold mb-2" style={{ color: TEXT }}>항목별 내역</p>
      <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `1px solid ${BORDER}` }}>
        <div className="grid grid-cols-3 px-3.5 py-2" style={{ background: "#F5F6F9" }}>
          <span className="text-[11.5px] font-semibold" style={{ color: MUTED }}>항목</span>
          <span className="text-[11.5px] font-semibold text-right" style={{ color: MUTED }}>근로자 부담</span>
          <span className="text-[11.5px] font-semibold text-right" style={{ color: MUTED }}>사업주 부담</span>
        </div>
        {breakdown.map((row, i) => (
          <div
            key={row.label}
            className="grid grid-cols-3 px-3.5 py-2.5"
            style={i > 0 ? { borderTop: `1px solid ${BORDER}` } : {}}
          >
            <span className="text-[12.5px] font-medium" style={{ color: TEXT }}>{row.label}</span>
            <span className="text-[12.5px] text-right tabular-nums" style={{ color: row.worker > 0 ? TEXT : MUTED }}>
              {row.worker > 0 ? won(row.worker) : "-"}
            </span>
            <span className="text-[12.5px] text-right tabular-nums" style={{ color: TEXT }}>{won(row.employer)}</span>
          </div>
        ))}
      </div>

      <CalcResultCard
        rows={[
          { label: "사업주 총 인건비 (급여+부담액)", value: won(totalLaborCost), primary: true },
          { label: "사업주 부담액 합계", value: won(employerTotal) },
          { label: "근로자 공제액 합계 (본인부담)", value: won(workerTotal) },
        ]}
      />
      <p className="text-[11px] mt-3" style={{ color: MUTED }}>
        * 2026년 국민연금 9.5%·건강보험 7.19%·장기요양보험(건보료의 13.14%)·고용보험 근로자 0.9% 기준 참고용 계산이에요.
        산재보험은 업종별로 요율이 달라 평균치로 반영했고, 전액 사업주가 부담해요. 정확한 금액은 4대사회보험 정보연계센터에서 확인하세요.
      </p>
    </div>
  );
}

function CardFeeCalc() {
  const [amount, amountRaw, onAmountChange] = useNumberInput("100,000");
  const [rate, rateRaw, onRateChange] = useNumberInput("1.5");
  const fee = amount * (rate / 100);
  const settled = amount - fee;
  return (
    <div>
      <p className="text-[12.5px] mb-4" style={{ color: MUTED }}>판매금액 및 카드수수료율 입력</p>
      <CalcNumberField label="판매 금액 (원)" value={amountRaw} onChange={onAmountChange} placeholder="100,000" suffix="원" />
      <CalcNumberField label="카드수수료율 (%)" value={rateRaw} onChange={onRateChange} placeholder="1.5" suffix="%" />
      <CalcResultCard
        rows={[
          { label: "실 정산 입금액", value: won(settled), primary: true },
          { label: "카드수수료", value: won(fee) },
        ]}
      />
      <p className="text-[11px] mt-3" style={{ color: MUTED }}>
        * 소상공인 우대수수료율은 매출 규모(영세·중소·일반)와 카드사에 따라 달라요. 정확한 요율은{" "}
        <a href="https://gongsi.crefia.or.kr" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: MUTED }}>
          여신금융협회 공시정보 포털
        </a>
        에서 확인하세요.
      </p>
    </div>
  );
}

const MIN_WAGE_2026 = 10320;
function MinWageCheckCalc() {
  const [pay, payRaw, onPayChange] = useNumberInput("2,156,880");
  const [hours, hoursRaw, onHoursChange] = useNumberInput("209");
  const effectiveWage = hours > 0 ? pay / hours : 0;
  const isViolation = effectiveWage < MIN_WAGE_2026;
  const gap = (MIN_WAGE_2026 - effectiveWage) * hours;
  return (
    <div>
      <p className="text-[12.5px] mb-4" style={{ color: MUTED }}>월 급여 및 월 소정근로시간 입력</p>
      <CalcNumberField label="월 급여 (세전, 원)" value={payRaw} onChange={onPayChange} placeholder="2,156,880" suffix="원" />
      <CalcNumberField label="월 소정근로시간 (시간)" value={hoursRaw} onChange={onHoursChange} placeholder="209" suffix="시간" />
      <div
        className="rounded-xl px-3.5 py-3 mb-4 flex items-start gap-2"
        style={{ background: isViolation ? RED_SOFT : GREEN_SOFT }}
      >
        {isViolation ? (
          <XCircle size={14} color={RED} className="shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 size={14} color={GREEN} className="shrink-0 mt-0.5" />
        )}
        <p className="text-[12px]" style={{ color: isViolation ? RED : GREEN }}>
          {isViolation
            ? `2026년 최저시급(${MIN_WAGE_2026.toLocaleString("ko-KR")}원)보다 낮아요. 최저임금 위반 소지가 있어요.`
            : `2026년 최저시급(${MIN_WAGE_2026.toLocaleString("ko-KR")}원) 이상으로 지급하고 있어요.`}
        </p>
      </div>
      <CalcResultCard
        rows={[
          { label: "환산 시급", value: won(effectiveWage), primary: true },
          ...(isViolation ? [{ label: "월 기준 부족액", value: won(gap) }] : []),
        ]}
      />
      <p className="text-[11px] mt-3" style={{ color: MUTED }}>* 주 40시간 근무 기준 월 소정근로시간은 주휴시간 포함 약 209시간이에요. 실제 계약서상 근로시간을 입력하면 더 정확해요.</p>
    </div>
  );
}

function CalculatorToolkit({ onBack }) {
  const TABS = [
    { key: "margin", label: "마진율·판매가", Comp: MarginCalc },
    { key: "vat", label: "부가세 쪼개기", Comp: VatSplitCalc },
    { key: "allowance", label: "주휴수당", Comp: WeeklyAllowanceCalc },
    { key: "loan", label: "대출이자", Comp: LoanInterestCalc },
    { key: "insurance", label: "4대보험료", Comp: InsuranceCalc },
    { key: "cardfee", label: "카드수수료", Comp: CardFeeCalc },
    { key: "minwage", label: "최저임금 체크", Comp: MinWageCheckCalc },
  ];
  const CALC_TIPS = {
    margin: [
      "마진율은 '판매가 대비' 비율이에요. 원가 대비로 계산하는 마크업(이익률)과 헷갈리기 쉬워요.",
      "여기 나온 판매가는 부가세를 뺀 금액이에요. 소비자가로 붙이려면 부가세 계산기로 한 번 더 확인해보세요.",
    ],
    vat: [
      "일반과세자는 공급가액의 10%가 부가세예요. 간이과세자는 업종별 부가율이 적용돼서 계산이 달라요.",
      "카드 매출은 부가세가 이미 포함된 금액으로 들어와요. 신고할 땐 쪼개서 봐야 정확해요.",
    ],
    allowance: [
      "주 15시간 이상 일하고 소정근로일을 다 채운 근로자에게 주휴수당을 줘야 해요.",
      "주휴수당을 빼먹으면 최저임금 위반이 될 수 있으니, 최저임금 체크 계산기로도 같이 확인해보세요.",
    ],
    loan: [
      "정책자금은 시중은행 대출보다 금리가 낮은 편이에요. 금리 정보 화면에서 비교해보세요.",
      "같은 금리라도 상환 방식(원리금균등·원금균등·만기일시)에 따라 총 이자가 꽤 달라져요.",
    ],
    insurance: [
      "4대보험은 사업주와 근로자가 나눠서 부담해요. 여기 나온 건 사업주 부담분 기준이에요.",
      <span>
        <strong>두루누리 사회보험료 지원</strong> — 근로자 10인 미만 사업장에서 월평균보수 270만원 미만인 신규가입 근로자라면 고용보험·국민연금료의 최대 80%를 지원받을 수 있어요.{" "}
        <a href="https://www.4insure.or.kr" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: "#8A6520" }}>
          4대사회보험정보연계센터
        </a>
        에서 온라인 신청하거나, 근로복지공단(1588-0075)·국민연금공단(1355)으로 문의해보세요.
      </span>,
    ],
    cardfee: [
      <span>
        영세·중소 가맹점은 우대 수수료율이 적용돼요. 내 가맹점 등급과 카드사별 수수료율은{" "}
        <a href="https://gongsi.crefia.or.kr" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: "#8A6520" }}>
          여신금융협회 공시정보 포털
        </a>
        에서 조회하거나, 이용 중인 카드사 고객센터로 문의하세요.
      </span>,
      "수수료는 보통 정산일에 차감돼서 입금돼요. 실제 통장에 들어오는 금액으로 계산해보세요.",
    ],
    minwage: [
      "최저임금에는 기본급 외에 매월 지급되는 상여금·복리후생비 일부도 포함될 수 있어요.",
      "위반 시 3년 이하 징역 또는 2천만원 이하 벌금 대상이라, 꼭 미리 확인하는 게 좋아요.",
    ],
  };

  const [tab, setTab] = useState("margin");
  const active = TABS.find((t) => t.key === tab);
  const Active = active.Comp;
  const tips = CALC_TIPS[tab] || [];
  const tabScrollRef = useRef(null);
  const chipRefs = useRef({});
  const currentIndex = TABS.findIndex((t) => t.key === tab);
  const [dir, setDir] = useState(1);
  const goToTab = (d) => {
    setDir(d);
    const nextIndex = (currentIndex + d + TABS.length) % TABS.length;
    setTab(TABS[nextIndex].key);
  };
  useEffect(() => {
    chipRefs.current[tab]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [tab]);

  return (
    <div>
      <HeroHeader icon={Calculator} color={BLUE} title="사장님 필수 계산기" subtitle="마진율·부가세·대출이자 등 자주 쓰는 계산을 바로 해보세요" onBack={onBack} />

      <style>{`
        @keyframes calcPageInRight { 0% { opacity: 0; transform: translateX(28px); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes calcPageInLeft { 0% { opacity: 0; transform: translateX(-28px); } 100% { opacity: 1; transform: translateX(0); } }
      `}</style>

      <div className="-mx-5 px-5 mb-4">
        <div
          ref={tabScrollRef}
          className="flex gap-1.5 overflow-x-auto pb-1"
          style={{
            scrollbarWidth: "none",
            WebkitMaskImage: "linear-gradient(to right, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              ref={(el) => (chipRefs.current[t.key] = el)}
              onClick={() => setTab(t.key)}
              className="shrink-0 px-3.5 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap"
              style={
                tab === t.key
                  ? { background: BLUE, color: "white" }
                  : { background: "#F2F3F7", color: MUTED }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-5 relative">
        <button
          onClick={() => goToTab(-1)}
          aria-label="이전 계산기"
          className="navArrowBtn absolute left-1 top-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ transform: "translateY(-50%)" }}
        >
          <ChevronLeft size={20} color={TEXT} strokeWidth={2.5} />
        </button>

        <div className="px-14">
          <div
            key={tab}
            className="rounded-2xl p-4"
            style={{ background: "white", border: `1px solid ${BORDER}`, animation: `${dir === 1 ? "calcPageInRight" : "calcPageInLeft"} 0.22s ease` }}
          >
            <p className="text-[15px] font-bold mb-4" style={{ color: TEXT }}>{active.label}</p>
            <Active />
          </div>
        </div>

        <button
          onClick={() => goToTab(1)}
          aria-label="다음 계산기"
          className="navArrowBtn absolute right-1 top-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ transform: "translateY(-50%)" }}
        >
          <ChevronRight size={20} color={TEXT} strokeWidth={2.5} />
        </button>
      </div>

      {tips.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl p-4 mt-3" style={{ background: "#FFFBF0" }}>
          <div className="absolute -right-6 -bottom-8 w-24 h-24 rounded-full" style={{ background: "rgba(217,166,46,0.08)" }} />
          <div className="relative flex items-center gap-1.5 mb-2.5">
            <Info size={14} color="#B8862A" />
            <p className="text-[13px] font-bold" style={{ color: "#8A6520" }}>알아두면 좋아요</p>
          </div>
          <ul className="relative space-y-2">
            {tips.map((t, i) => (
              <li key={i} className="text-[12.5px] leading-relaxed flex items-start gap-1.5" style={{ color: "#6B5220" }}>
                <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "#B8862A" }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[11px] mt-5 leading-relaxed" style={{ color: MUTED }}>
        * 계산 결과는 참고용 추정치예요. 세금·인건비처럼 법령이 자주 바뀌는 항목은 신고·지급 전에 세무사나 관련 기관에서 꼭 확인하세요.
      </p>
    </div>
  );
}

// 뉴스 상세 화면 — 핵심 요약과 함께 원문을 앱 안에서 바로 볼 수 있게 해줘요
function NewsDetailScreen({ news, allNews, onBack, onSelectNews }) {
  const [iframeFailed, setIframeFailed] = useState(false);
  const style = NEWS_CATEGORY_STYLE[news.category] || { bg: "#F2F3F7", color: MUTED };
  const related = allNews.filter((n) => n.id !== news.id && n.category === news.category).slice(0, 3);
  let domain = "";
  try {
    domain = new URL(news.url).hostname.replace("www.", "");
  } catch (e) {
    domain = news.source;
  }

  return (
    <div>
      <SectionHeader title="기사 보기" onBack={onBack} />

      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded" style={{ background: style.bg, color: style.color }}>{news.category}</span>
        <span className="text-[11px]" style={{ color: MUTED }}>{news.date}</span>
        <span className="flex items-center gap-0.5 text-[11px]" style={{ color: MUTED }}>
          <Clock size={11} /> {news.readTime} 읽기
        </span>
      </div>

      <h1 className="text-[19px] font-extrabold leading-snug mb-2" style={{ color: TEXT }}>{news.title}</h1>
      <p className="text-[12.5px] font-semibold mb-4" style={{ color: MUTED }}>{news.source}</p>

      <div className="rounded-2xl p-4 mb-4" style={{ background: BLUE_SOFT }}>
        <p className="text-[13px] font-bold mb-2.5" style={{ color: TEXT }}>핵심 요약</p>
        <ul className="space-y-1.5">
          {news.bullets.map((b, i) => (
            <li key={i} className="text-[12.5px] leading-relaxed flex items-start gap-1.5" style={{ color: TEXT }}>
              <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: BLUE }} />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-bold" style={{ color: TEXT }}>원문 기사</p>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11.5px] font-semibold flex items-center gap-1"
          style={{ color: BLUE }}
        >
          새 창에서 열기 <ExternalLink size={11} />
        </a>
      </div>

      <div className="rounded-2xl overflow-hidden mb-2" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-3 py-2" style={{ background: "#F5F6F9" }}>
          <span className="text-[11.5px] font-medium truncate" style={{ color: MUTED }}>{domain}</span>
        </div>
        {!iframeFailed ? (
          <iframe
            key={news.url}
            src={news.url}
            title={news.title}
            className="w-full"
            style={{ height: 420, border: "none", background: "white" }}
            onError={() => setIframeFailed(true)}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <p className="text-[12.5px]" style={{ color: MUTED }}>이 언론사는 인앱 보기를 지원하지 않아요.</p>
          </div>
        )}
      </div>
      <p className="text-[11px] mb-2" style={{ color: MUTED }}>
        * 일부 언론사 사이트는 보안 설정 때문에 인앱 화면에 안 나올 수 있어요. 그럴 땐 아래 버튼으로 새 창에서 열어보세요.
      </p>
      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-1.5 py-2.5 mb-5 rounded-xl text-[12.5px] font-bold"
        style={{ background: BLUE_SOFT, color: BLUE }}
      >
        기사가 안 보이시나요? 새 창에서 열기 <ExternalLink size={12} />
      </a>

      {related.length > 0 && (
        <>
          <p className="text-[14px] font-bold mb-2.5" style={{ color: TEXT }}>같은 카테고리 다른 뉴스</p>
          <div className="space-y-2">
            {related.map((n) => (
              <button
                key={n.id}
                onClick={() => onSelectNews(n)}
                className="w-full text-left rounded-xl p-3 flex items-center justify-between gap-2"
                style={{ background: "#FAFAFB" }}
              >
                <span className="text-[12.5px] font-semibold leading-snug flex-1" style={{ color: TEXT }}>{n.title}</span>
                <ChevronRight size={15} color={MUTED} className="shrink-0" />
              </button>
            ))}
          </div>
        </>
      )}

      <button
        onClick={onBack}
        className="w-full mt-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
        style={{ background: "#F2F3F7", color: TEXT }}
      >
        <ChevronLeft size={16} /> 목록으로 돌아가기
      </button>
    </div>
  );
}

export default function App() {
  const [mainTab, setMainTab] = useState("home");
  const [screen, setScreen] = useState({ view: "home" });
  const [homeScreen, setHomeScreen] = useState("hub");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("전체");
  const [category, setCategory] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [newsCategory, setNewsCategory] = useState("전체");
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [notifyIds, setNotifyIds] = useState(new Set());
  const [diagnosis, setDiagnosis] = useState(null); // { region, revenueBand, yearsBand } | null
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState({ region: null, revenueBand: null, yearsBand: null });

  const toggleNotifyId = (id) => {
    setNotifyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const [favorites, setFavorites] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // 저장된 즐겨찾기·알림 설정 불러오기 (처음 화면이 열릴 때 한 번)
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("prefs", false);
        if (result) {
          const data = JSON.parse(result.value);
          if (Array.isArray(data.favorites)) setFavorites(new Set(data.favorites));
          if (Array.isArray(data.notifyIds)) setNotifyIds(new Set(data.notifyIds));
          if (typeof data.notifyEnabled === "boolean") setNotifyEnabled(data.notifyEnabled);
          if (data.region) setRegion(data.region);
          if (data.diagnosis) setDiagnosis(data.diagnosis);
        }
      } catch (e) {
        // 아직 저장된 값이 없으면 그냥 기본값으로 시작해요
      } finally {
        setPrefsLoaded(true);
      }
    })();
  }, []);

  // 즐겨찾기·알림·지역이 바뀔 때마다 저장 (처음 불러오기 끝난 뒤부터)
  useEffect(() => {
    if (!prefsLoaded) return;
    (async () => {
      try {
        await window.storage.set(
          "prefs",
          JSON.stringify({
            favorites: Array.from(favorites),
            notifyIds: Array.from(notifyIds),
            notifyEnabled,
            region,
            diagnosis,
          }),
          false
        );
      } catch (e) {
        // 저장 실패해도 앱 사용에는 지장 없도록 조용히 넘어가요
      }
    })();
  }, [favorites, notifyIds, notifyEnabled, region, diagnosis, prefsLoaded]);

  const toggleFavoriteId = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const [regionOpen, setRegionOpen] = useState(false);
  const [pickerStep, setPickerStep] = useState("province");
  const [tempProvince, setTempProvince] = useState(null);

  const openPicker = () => {
    setRegionOpen(true);
    setPickerStep("province");
  };

  const selectProvince = (p) => {
    if (p === "전체" || p === "전국" || !DISTRICTS[p]) {
      setRegion(p);
      setRegionOpen(false);
      return;
    }
    setTempProvince(p);
    setPickerStep("district");
  };

  const selectDistrict = (d) => {
    setRegion(d === "전체" ? tempProvince : `${tempProvince} ${d}`);
    setRegionOpen(false);
  };

  const filtered = useMemo(() => {
    return ALL_PROGRAMS.filter((p) => {
      const matchesRegion = region === "전체" || p.region === region;
      const matchesQuery =
        query.trim() === "" ||
        p.name.includes(query) ||
        p.category.includes(query) ||
        (typeof p.target === "string" && p.target.includes(query));
      const matchesCategory = category === "전체" || p.category === category;
      const matchesFavorite = !showFavoritesOnly || favorites.has(p.id);
      const dday = getDday(p.deadline);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "urgent" && dday <= 7 && dday >= 0) ||
        (statusFilter === "available" && dday > 7);
      return matchesRegion && matchesQuery && matchesCategory && matchesFavorite && matchesStatus;
    }).sort((a, b) =>
      sortBy === "amount"
        ? parseAmount(b.amountLabel) - parseAmount(a.amountLabel)
        : getDday(a.deadline) - getDday(b.deadline)
    );
  }, [query, region, category, showFavoritesOnly, favorites, sortBy, statusFilter]);

  const urgentCount = ALL_PROGRAMS.filter((p) => getDday(p.deadline) <= 7 && getDday(p.deadline) >= 0).length;
  const availableCount = ALL_PROGRAMS.length - urgentCount;
  const categories = ["전체", ...Array.from(new Set(ALL_PROGRAMS.map((p) => p.category)))];

  if (screen.view === "detail") {
    const program = ALL_PROGRAMS.find((p) => p.id === screen.id);
    return (
      <Shell>
        {program.detailed ? (
          <DetailedGuide program={program} onBack={() => setScreen({ view: "home" })} favorites={favorites} onToggleFavorite={toggleFavoriteId} />
        ) : (
          <SimpleDetail program={program} onBack={() => setScreen({ view: "home" })} />
        )}
      </Shell>
    );
  }

  if (screen.view === "exchange") {
    return (
      <Shell>
        <RateAndExchangeScreen onBack={() => setScreen({ view: "home" })} onOpenCalculator={() => setScreen({ view: "calculator" })} />
      </Shell>
    );
  }

  if (screen.view === "centers") {
    const matchedGroup = CENTER_GROUPS.find((g) => g.members.includes(region));
    return (
      <Shell>
        <RegionalCentersScreen onBack={() => setScreen({ view: "home" })} initialProvince={matchedGroup ? matchedGroup.label : "전체"} />
      </Shell>
    );
  }

  if (screen.view === "taxSchedule") {
    return (
      <Shell>
        <TaxScheduleScreen onBack={() => setScreen({ view: "home" })} favorites={favorites} />
      </Shell>
    );
  }

  if (screen.view === "faq") {
    return (
      <Shell>
        <FaqSearchScreen onBack={() => setScreen({ view: "home" })} />
      </Shell>
    );
  }

  if (screen.view === "documents") {
    return (
      <Shell>
        <DocumentsScreen onBack={() => setScreen({ view: "home" })} />
      </Shell>
    );
  }

  if (screen.view === "calculator") {
    return (
      <Shell>
        <CalculatorToolkit onBack={() => setScreen({ view: "home" })} />
      </Shell>
    );
  }

  if (screen.view === "privacy") {
    return (
      <Shell>
        <PrivacyPolicyScreen onBack={() => setScreen({ view: "home" })} />
      </Shell>
    );
  }

  if (screen.view === "terms") {
    return (
      <Shell>
        <TermsOfServiceScreen onBack={() => setScreen({ view: "home" })} />
      </Shell>
    );
  }

  if (screen.view === "diagnosis") {
    return (
      <Shell>
        <DiagnosisWizard
          onBack={() => setScreen({ view: "home" })}
          onComplete={(answers) => {
            setDiagnosis(answers);
            setStatusFilter("all");
            setScreen({ view: "diagnosisResult" });
          }}
        />
      </Shell>
    );
  }

  if (screen.view === "diagnosisResult") {
    return (
      <Shell>
        <DiagnosisResultScreen
          diagnosis={diagnosis}
          onBack={() => setScreen({ view: "home" })}
          onRedo={() => setScreen({ view: "diagnosis" })}
          onClear={() => {
            setDiagnosis(null);
            setStatusFilter("all");
            setScreen({ view: "home" });
          }}
          onViewAll={() => {
            setStatusFilter("all");
            setScreen({ view: "home" });
            setHomeScreen("list");
          }}
          onSelectProgram={(id) => setScreen({ view: "detail", id })}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </Shell>
    );
  }

  if (screen.view === "newsDetail") {
    const news = NEWS.find((n) => n.id === screen.id);
    return (
      <Shell>
        <NewsDetailScreen
          news={news}
          allNews={NEWS}
          onBack={() => setScreen({ view: "home" })}
          onSelectNews={(n) => setScreen({ view: "newsDetail", id: n.id })}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      {mainTab === "home" && (
      <>
      {homeScreen === "hub" ? (
        <>
      <div
        className="relative overflow-hidden mb-2 px-5 pt-5 pb-5"
        style={{ background: "linear-gradient(135deg, #4E77F0 0%, #2947B0 100%)", borderRadius: 32 }}
      >
        {/* 배경 장식 원 */}
        <div className="absolute -right-10 -top-14 w-44 h-44 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="absolute right-3 top-16 w-16 h-16 rounded-full" style={{ background: "rgba(255,255,255,0.10)" }} />
        <div className="absolute -right-2 -bottom-10 opacity-90">
          <HeroCoinArt />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-[15px] font-semibold" style={{ color: "rgba(255,255,255,0.95)" }}>사장님, 안녕하세요 👋</p>
            <h1 className="text-[20px] font-black mt-1 tracking-tight text-white leading-tight whitespace-nowrap" style={{ letterSpacing: "-0.02em" }}>소상공인 정책자금 알리미</h1>
          </div>
          <button
            onClick={() => setMainTab("my")}
            className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <Bell size={18} color="white" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "#FF6B6B", boxShadow: "0 0 0 2px #2947B0" }}
            />
          </button>
        </div>

        <div className="relative z-10 mt-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.16)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#6FDBA6" }} />
          <span className="text-[12px] font-semibold text-white">이번 주 새로 등록된 지원금 4건</span>
        </div>
      </div>

      {/* 맞춤 진단 CTA — 기존에 만들어둔 진단 기능으로 들어가는 입구가 없었어서 추가 */}
      <style>{`
        @keyframes shimmerSweep {
          0% { left: -20%; }
          100% { left: 104%; }
        }
      `}</style>
      <button
        onClick={() => setScreen({ view: diagnosis ? "diagnosisResult" : "diagnosis" })}
        className="relative overflow-hidden w-full text-left rounded-2xl p-4 mb-5 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #FFE58A 0%, #FFC233 100%)", border: "1px solid #FFD873" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-20%",
              width: "16%",
              height: "100%",
              background: "linear-gradient(75deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
              animation: "shimmerSweep 2.6s linear infinite",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-6px",
                left: "50%",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.95)",
                filter: "blur(5px)",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.55)" }}>
            <MoneyBagArt className="w-10 h-10" />
          </div>
          <div className="min-w-0">
            <p className="text-[14.5px] font-bold" style={{ color: "#4A2F05" }}>
              {diagnosis ? "내 맞춤 지원금 결과 보기" : "30초 맞춤 진단 받기"}
            </p>
            <p className="text-[11.5px] mt-0.5 truncate" style={{ color: "#6B4A12" }}>
              {diagnosis ? `${diagnosis.region} 사업장 기준으로 골라둔 지원금이 있어요` : "지역·매출·업력만 답하면 나에게 맞는 지원금만 보여드려요"}
            </p>
          </div>
        </div>
        <ChevronRight size={18} color="#6B4A12" className="relative z-10 shrink-0" />
      </button>


      {/* 이번 주 인기 지원금 (실시간 검색어 스타일) */}
      <div className="flex items-center justify-between mt-4 mb-2.5">
        <div className="flex items-center gap-1.5">
          <p className="text-[13.5px] font-bold" style={{ color: TEXT }}>이번 주 인기 지원금</p>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold" style={{ background: RED_SOFT, color: RED }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: RED }} />
            LIVE
          </span>
        </div>
        <button onClick={() => setHomeScreen("list")} className="text-[11px] font-medium flex items-center gap-0.5" style={{ color: MUTED }}>
          전체보기 <ChevronRight size={12} />
        </button>
      </div>
      <div className="rounded-2xl mb-6 px-3 py-1.5" style={{ background: "#FAFAFB" }}>
        <LiveTopRanking onSelect={(id) => setScreen({ view: "detail", id })} />
      </div>

      {/* 많이 찾는 서비스 */}
      <p className="text-[16px] font-bold mb-2.5" style={{ color: TEXT }}>많이 찾는 서비스</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { key: "all", label: "소상공인\n지원금", bg: "#FDEEDC", Art: AlarmTileArt, artScale: 2.1, onClick: () => { setStatusFilter("all"); setHomeScreen("list"); } },
          { key: "center", label: "지역센터\n찾기", bg: "#FCEAF3", Art: SearchPinTileArt, artScale: 2.1, onClick: () => setScreen({ view: "centers" }) },
          { key: "exchange", label: "금리·환율\n정보", bg: "#E7F7EF", Art: CoinTileArt, artScale: 2.7, onClick: () => setScreen({ view: "exchange" }) },
          { key: "news", label: "정책뉴스\n확인", bg: "#F1ECFC", Art: MegaphoneTileArt, artScale: 2.1, onClick: () => setMainTab("news") },
        ].map((tile) => (
          <button
            key={tile.key}
            onClick={tile.onClick}
            className="relative overflow-hidden p-5 text-left h-[232px] flex flex-col justify-between"
            style={{ background: tile.bg, borderRadius: 34 }}
          >
            <p className="font-extrabold leading-snug whitespace-pre-line relative z-10" style={{ color: TEXT, fontSize: 23 }}>{tile.label}</p>
            <div className="self-end -mr-2 -mb-2" style={{ transform: `rotate(8deg) scale(${tile.artScale})` }}>
              <tile.Art />
            </div>
          </button>
        ))}
      </div>

      {/* 자주 쓰는 도구 */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {[
          { key: "tax", label: "세금·마감\n일정", bg: "#E7F7EF", color: "#2C9F6B", Icon: CalendarCheck, onClick: () => setScreen({ view: "taxSchedule" }) },
          { key: "faq", label: "도움말\nQ&A", bg: "#F1ECFC", color: "#7A46D6", Icon: HelpCircle, onClick: () => setScreen({ view: "faq" }) },
          { key: "docs", label: "서류·양식\n자료실", bg: "#FFF0E6", color: "#C2410C", Icon: ClipboardCheck, onClick: () => setScreen({ view: "documents" }) },
        ].map((tile) => (
          <button
            key={tile.key}
            onClick={tile.onClick}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl"
            style={{ background: tile.bg }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "white" }}>
              <tile.Icon size={18} color={tile.color} />
            </div>
            <p className="text-[12px] font-bold leading-snug whitespace-pre-line text-center" style={{ color: TEXT }}>{tile.label}</p>
          </button>
        ))}
      </div>

      {/* 사장님 필수 계산기 툴킷 */}
      <button
        onClick={() => setScreen({ view: "calculator" })}
        className="w-full text-left rounded-2xl pt-5 pl-5 pb-4 pr-4 mb-6 relative overflow-hidden"
        style={{ background: "#E9EEFC" }}
      >
        <p className="text-[12px] font-bold relative z-10" style={{ color: BLUE }}>부가세, 대출이자 즉시 계산</p>
        <p className="text-[17px] font-extrabold mt-0.5 mb-3 relative z-10" style={{ color: TEXT }}>사장님 필수 계산기 툴킷</p>
        <div className="flex flex-wrap gap-1.5 relative z-10 max-w-[62%]">
          {["마진율·판매가", "부가세 쪼개기", "주휴수당", "대출이자", "4대보험료", "카드수수료", "최저임금 체크"].map((label) => (
            <span key={label} className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: "rgba(61,99,221,0.1)", color: BLUE }}>
              {label}
            </span>
          ))}
        </div>
        <div className="absolute -right-3 -bottom-3 rotate-[8deg] scale-125">
          <CalculatorTileArt />
        </div>
      </button>

      {/* 안내사항 */}
      <p className="text-[15px] font-bold mb-2.5" style={{ color: TEXT }}>안내사항</p>
      <div className="rounded-2xl pl-4 py-3.5 flex items-center justify-between gap-2 mb-2 overflow-hidden" style={{ background: "#EEF2FE" }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: TEXT }}>안전하고 정확한 정보 확인 안내</p>
          <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>신청 전 꼭 공식 사이트에서 최종 확인하세요</p>
        </div>
        <div className="-mr-1">
          <FolderBellArt />
        </div>
      </div>
        </>
      ) : (
        <>
      <HeroHeader icon={List} color={BLUE} title="지원금 목록" subtitle="조건에 맞는 지원금을 검색·필터링해서 찾아보세요" onBack={() => setHomeScreen("hub")} />

      {/* Status filter */}
      <div className="flex gap-1.5 mb-4">
        {[
          { key: "all", label: "전체", count: ALL_PROGRAMS.length },
          { key: "available", label: "신청가능", count: availableCount },
          { key: "urgent", label: "마감임박", count: urgentCount },
        ].map((s) => {
          const active = statusFilter === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={active ? { background: "#F3E7D3", color: "#7A5A2E" } : { background: "#F5F6F9", color: MUTED }}
            >
              {s.label} <span style={{ opacity: 0.75 }}>({s.count})</span>
            </button>
          );
        })}
      </div>

      {/* Search + region */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "#F5F6F9" }}>
          <Search size={16} color={MUTED} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·대상·카테고리로 검색"
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: TEXT }}
          />
          {query && <button onClick={() => setQuery("")}><X size={14} color={MUTED} /></button>}
        </div>
        <button
          onClick={openPicker}
          className="flex items-center gap-1 px-3 py-2.5 rounded-xl shrink-0"
          style={{ background: "#F5F6F9" }}
        >
          <MapPin size={15} color={TEXT} />
          <span className="text-[13px] font-medium" style={{ color: TEXT }}>{region}</span>
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 -mx-5 px-5">
        {categories.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap shrink-0"
              style={active ? { background: "#F3E7D3", color: "#7A5A2E" } : { background: "#F5F6F9", color: MUTED }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          {[
            { key: "deadline", label: "마감임박순" },
            { key: "amount", label: "금액순" },
          ].map((s) => {
            const active = sortBy === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className="text-xs font-semibold pb-0.5"
                style={{
                  color: active ? BLUE : MUTED,
                  borderBottom: active ? `2px solid ${BLUE}` : "2px solid transparent",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium"
          style={showFavoritesOnly ? { background: "#FDEDED", color: RED } : { background: "#F5F6F9", color: MUTED }}
        >
          <Heart size={12} fill={showFavoritesOnly ? RED : "none"} color={showFavoritesOnly ? RED : MUTED} />
          즐겨찾기 {favorites.size > 0 && `(${favorites.size})`}
        </button>
      </div>
      <p className="text-xs mb-2.5" style={{ color: MUTED }}>총 {filtered.length}건</p>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-14 text-sm" style={{ color: MUTED }}>
            조건에 맞는 지원금이 없어요.
          </div>
        )}
        {filtered.map((p) => {
          const dday = getDday(p.deadline);
          const color = urgencyColor(dday);
          const catStyle = CATEGORY_COLORS[p.category] || { color: BLUE, bg: BLUE_SOFT };
          const CatIcon = CATEGORY_ICON[p.category] || Wallet;
          return (
            <button
              key={p.id}
              onClick={() => setScreen({ view: "detail", id: p.id })}
              className="w-full text-left rounded-xl p-3.5 flex items-center gap-3"
              style={{ background: "#FAFAFB" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${catStyle.bg2}, ${catStyle.bg})`,
                  boxShadow: `0 4px 10px ${catStyle.bg}55, inset 0 -3px 6px rgba(0,0,0,0.12)`,
                }}
              >
                <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
                <CatIcon size={23} color={catStyle.color} strokeWidth={2.3} className="relative" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {dday <= 7 && dday >= 0 && (
                    <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: RED_SOFT, color: RED }}>
                      마감임박
                    </span>
                  )}
                  {(p.detailed || p.verified) && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GREEN }} />}
                </div>
                <p className="text-[18px] font-extrabold truncate" style={{ color: TEXT }}>{p.name}</p>
                <p className="text-[12px] font-normal mt-1" style={{ color: MUTED }}>{p.region} · {p.amountLabel}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-bold" style={{ color: p.recurring ? GREEN : color }}>{p.recurring ? "상시접수" : dday >= 0 ? `D-${dday}` : "마감"}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleFavoriteId(p.id); }} className="shrink-0 p-0.5">
                <Heart size={16} fill={favorites.has(p.id) ? RED : "none"} color={favorites.has(p.id) ? RED : "#C7CBD6"} />
              </button>
            </button>
          );
        })}
      </div>

      {regionOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-10" onClick={() => setRegionOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-t-2xl p-6 pb-8 max-h-[75%] overflow-y-auto">
            <div className="w-9 h-1 bg-[#E5E7EE] rounded-full mx-auto mb-5" />

            {pickerStep === "province" ? (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: TEXT }}>지역 선택</h2>
                <div className="grid grid-cols-3 gap-2">
                  {REGIONS.map((r) => {
                    const active = region === r;
                    return (
                      <button
                        key={r}
                        onClick={() => selectProvince(r)}
                        className="py-2.5 rounded-lg border text-sm flex items-center justify-center gap-1"
                        style={active ? { background: BLUE, borderColor: BLUE, color: "white" } : { background: "white", borderColor: BORDER, color: TEXT }}
                      >
                        {r}
                        {DISTRICTS[r] && <ChevronDown size={11} style={{ transform: "rotate(-90deg)" }} color={active ? "white" : MUTED} />}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setPickerStep("province")} className="w-7 h-7 -ml-1 rounded-full flex items-center justify-center active:bg-[#F2F3F7]">
                    <ChevronLeft size={18} color={TEXT} />
                  </button>
                  <h2 className="text-base font-bold" style={{ color: TEXT }}>{tempProvince} 세부 지역</h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => selectDistrict("전체")}
                    className="py-2.5 rounded-lg border text-sm"
                    style={{ background: BLUE_SOFT, borderColor: BLUE, color: BLUE }}
                  >
                    {tempProvince} 전체
                  </button>
                  {DISTRICTS[tempProvince].map((d) => (
                    <button
                      key={d}
                      onClick={() => selectDistrict(d)}
                      className="py-2.5 rounded-lg border text-sm"
                      style={{ background: "white", borderColor: BORDER, color: TEXT }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] mt-4" style={{ color: MUTED }}>
                  * 2026년 기준 행정구역이에요. 시/군 통합 등 행정구역 변경 시 업데이트가 필요해요.
                </p>
              </>
            )}
          </div>
        </div>
      )}
        </>
      )}
      </>
      )}

      {mainTab === "favorites" && (
        <>
          <h1 className="text-[19px] font-bold mb-1" style={{ color: TEXT }}>즐겨찾기</h1>
          {favorites.size > 0 && (
            <p className="text-[11.5px] mb-4" style={{ color: MUTED }}>
              <Bell size={11} className="inline -mt-0.5 mr-0.5" /> 항목을 눌러서 마감 3일 전 알림을 켤 수 있어요
              {!notifyEnabled && " (MY 탭에서 전체 알림을 먼저 켜주세요)"}
            </p>
          )}
          {favorites.size === 0 ? (
            <div className="text-center py-20 text-sm" style={{ color: MUTED }}>
              <Heart size={28} color="#D8DBE3" className="mx-auto mb-3" />
              아직 저장한 지원금이 없어요.
              <br />
              홈에서 하트를 눌러 저장해보세요.
            </div>
          ) : (
            <div className="space-y-2">
              {ALL_PROGRAMS.filter((p) => favorites.has(p.id)).map((p) => {
                const dday = getDday(p.deadline);
                const color = urgencyColor(dday);
                const catStyle = CATEGORY_COLORS[p.category] || { color: BLUE, bg: BLUE_SOFT };
                const CatIcon = CATEGORY_ICON[p.category] || Wallet;
                return (
                  <button
                    key={p.id}
                    onClick={() => setScreen({ view: "detail", id: p.id })}
                    className="w-full text-left rounded-xl p-3.5 flex items-center gap-3"
                    style={{ background: "#FAFAFB" }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${catStyle.bg2}, ${catStyle.bg})`,
                        boxShadow: `0 4px 10px ${catStyle.bg}55, inset 0 -3px 6px rgba(0,0,0,0.12)`,
                      }}
                    >
                      <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
                      <CatIcon size={23} color={catStyle.color} strokeWidth={2.3} className="relative" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {dday <= 7 && dday >= 0 && (
                          <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: RED_SOFT, color: RED }}>
                            마감임박
                          </span>
                        )}
                        {(p.detailed || p.verified) && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GREEN }} />}
                      </div>
                      <p className="text-[18px] font-extrabold truncate" style={{ color: TEXT }}>{p.name}</p>
                      <p className="text-[12px] font-normal mt-1" style={{ color: MUTED }}>{p.region} · {p.amountLabel}</p>
                    </div>
                    <p className="text-[13px] font-bold shrink-0" style={{ color: p.recurring ? GREEN : color }}>{p.recurring ? "상시접수" : dday >= 0 ? `D-${dday}` : "마감"}</p>
                    <button onClick={(e) => { e.stopPropagation(); toggleNotifyId(p.id); }} className="shrink-0 p-0.5">
                      <Bell size={16} fill={notifyIds.has(p.id) ? GOLD : "none"} color={notifyIds.has(p.id) ? GOLD : "#C7CBD6"} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavoriteId(p.id); }} className="shrink-0 p-0.5">
                      <Heart size={16} fill={RED} color={RED} />
                    </button>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {mainTab === "news" && (() => {
        const filteredNews = newsCategory === "전체" ? NEWS : NEWS.filter((n) => n.category === newsCategory);
        const featured = filteredNews.find((n) => n.featured) || filteredNews[0];
        const rest = filteredNews.filter((n) => n !== featured);
        return (
          <>
            <HeroHeader icon={Newspaper} color="#7A46D6" title="소상공인 정책 뉴스" subtitle="공식 출처와 주요 매체 기사만 엄선해서 모았어요" onBack={() => setMainTab("home")} />

            <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
              {NEWS_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewsCategory(c)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[12.5px] font-semibold"
                  style={
                    newsCategory === c
                      ? { background: BLUE, color: "white" }
                      : { background: "#F2F3F7", color: MUTED }
                  }
                >
                  {c}
                </button>
              ))}
            </div>

            {!featured && (
              <p className="text-[12.5px] text-center py-10" style={{ color: MUTED }}>이 카테고리엔 아직 뉴스가 없어요</p>
            )}

            {featured && (
              <button
                onClick={() => setScreen({ view: "newsDetail", id: featured.id })}
                className="block w-full text-left p-5 mb-3"
                style={{
                  background: "linear-gradient(135deg, #3D63DD 0%, #6B8AFB 100%)",
                  borderRadius: 24,
                  overflow: "hidden",
                  border: "none",
                  outline: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-center gap-1.5 mb-3">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.22)", color: "white" }}
                  >
                    {featured.category}
                  </span>
                  <span className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.8)" }}>{featured.date}</span>
                  <span className="flex items-center gap-0.5 text-[10.5px]" style={{ color: "rgba(255,255,255,0.8)" }}>
                    <Clock size={10} /> {featured.readTime}
                  </span>
                </div>
                <p className="text-[16.5px] font-extrabold leading-snug mb-2" style={{ color: "white" }}>{featured.title}</p>
                <p className="text-[12.5px] leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.88)" }}>{featured.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{featured.source}</span>
                  <span className="text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.22)", color: "white" }}>
                    자세히 보기 <ChevronRight size={12} />
                  </span>
                </div>
              </button>
            )}

            <div className="space-y-2.5">
              {rest.map((n) => {
                const style = NEWS_CATEGORY_STYLE[n.category] || { bg: "#F2F3F7", color: MUTED };
                return (
                  <button
                    key={n.id}
                    onClick={() => setScreen({ view: "newsDetail", id: n.id })}
                    className="block w-full text-left rounded-2xl p-4"
                    style={{ background: "#FAFAFB" }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: style.bg, color: style.color }}>{n.category}</span>
                      <span className="text-[10.5px]" style={{ color: MUTED }}>{n.date}</span>
                      <span className="flex items-center gap-0.5 text-[10.5px]" style={{ color: MUTED }}>
                        <Clock size={10} /> {n.readTime}
                      </span>
                    </div>
                    <p className="text-sm font-semibold leading-snug" style={{ color: TEXT }}>{n.title}</p>
                    <p className="text-[12px] mt-1 leading-relaxed" style={{ color: MUTED }}>{n.summary}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px]" style={{ color: MUTED }}>{n.source}</span>
                      <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: BLUE }}>
                        자세히 보기 <ChevronRight size={12} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <a
              href="https://www.korea.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1 py-3 mt-4 rounded-xl text-xs font-semibold border"
              style={{ borderColor: BORDER, color: TEXT }}
            >
              더 많은 정책 뉴스 보기 (정책브리핑) <ExternalLink size={12} />
            </a>
            <p className="text-[11px] mt-4" style={{ color: MUTED }}>
              * 검색으로 찾은 관련 뉴스가 많았지만, 출처가 불분명한 곳은 제외하고 신뢰할 수 있는 곳만 담았어요.
            </p>
          </>
        );
      })()}

      {mainTab === "my" && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMainTab("home")}
              className="navArrowBtn w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={20} color={TEXT} />
            </button>
            <h1 className="text-[19px] font-bold" style={{ color: TEXT }}>MY</h1>
          </div>

          <p className="text-[12px] font-bold mb-2 px-1" style={{ color: MUTED }}>내 정보</p>
          <div className="rounded-xl p-4 mb-3 flex items-center gap-3" style={{ background: "#FAFAFB" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: BLUE_SOFT }}>
              <MapPin size={17} color={BLUE} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: TEXT }}>내 지역</p>
              <p className="text-[12px]" style={{ color: MUTED }}>{region}</p>
            </div>
          </div>
          <button
            onClick={() => setScreen({ view: "diagnosis" })}
            className="w-full text-left rounded-xl p-4 mb-3 flex items-center justify-between gap-3"
            style={{ background: "#FAFAFB" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#FCEAC7" }}>
                <MoneyBagArt className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: TEXT }}>맞춤 진단</p>
                <p className="text-[12px] truncate" style={{ color: MUTED }}>
                  {diagnosis ? `${diagnosis.region} · 진단 완료 (다시 진단하기)` : "아직 진단 전이에요 · 30초면 끝나요"}
                </p>
              </div>
            </div>
            <ChevronRight size={16} color={MUTED} className="shrink-0" />
          </button>
          <div className="rounded-xl p-4 mb-1 flex items-center justify-between" style={{ background: "#FAFAFB" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#FDEEE9" }}>
                <Bell size={17} color="#E5674D" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: TEXT }}>마감 임박 알림</p>
                <p className="text-[12px]" style={{ color: MUTED }}>즐겨찾기한 항목 마감 3일 전 알림</p>
              </div>
            </div>
            <Switch checked={notifyEnabled} onChange={() => setNotifyEnabled(!notifyEnabled)} />
          </div>
          <p className="text-[11px] mb-5 px-1" style={{ color: MUTED }}>
            화면 동작만 만들어둔 상태예요. 실제 알림이 휴대폰으로 전송되려면 개발 단계에서 별도로 연결해야 해요.
          </p>

          <p className="text-[12px] font-bold mb-2 px-1 mt-4" style={{ color: MUTED }}>약관·정보</p>
          <div className="rounded-xl overflow-hidden mb-3" style={{ background: "#FAFAFB" }}>
            {[
              { key: "privacy", label: "개인정보처리방침" },
              { key: "terms", label: "이용약관" },
            ].map((item, i) => (
              <button
                key={item.key}
                onClick={() => setScreen({ view: item.key })}
                className="w-full text-left px-4 py-3.5 flex items-center justify-between"
                style={i > 0 ? { borderTop: `1px solid ${BORDER}` } : {}}
              >
                <span className="text-sm font-semibold" style={{ color: TEXT }}>{item.label}</span>
                <ChevronRight size={16} color={MUTED} />
              </button>
            ))}
          </div>

          <p className="text-[11.5px] text-center mt-8" style={{ color: MUTED }}>소상공인 지원금 모아보기 · 프로토타입 v3</p>
        </>
      )}

      {/* Bottom tab bar */}
      {screen.view !== "detail" && (
        <>
          <div style={{ height: 76 }} />
          <div className="fixed bottom-3 inset-x-0 flex justify-center px-4" style={{ zIndex: 50 }}>
            <div className="w-full max-w-md">
              <div
                className="flex rounded-2xl px-1.5 py-1.5"
                style={{ background: "#FDEAF0", boxShadow: "0 8px 24px rgba(232,116,154,0.35)" }}
              >
                {[
                  { key: "home", label: "홈", icon: Home },
                  { key: "favorites", label: "즐겨찾기", icon: Heart },
                  { key: "news", label: "뉴스", icon: Newspaper },
                  { key: "my", label: "MY", icon: User },
                ].map((t) => {
                  const active = mainTab === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setMainTab(t.key)}
                      className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl"
                      style={active ? { background: "#E8749A" } : {}}
                    >
                      <t.icon
                        size={18}
                        color={active ? "white" : "#C99AA6"}
                        strokeWidth={active ? 2.2 : 1.75}
                        fill={t.key === "favorites" && active ? "white" : "none"}
                      />
                      <span className="text-[10.5px]" style={{ color: active ? "white" : "#C99AA6", fontWeight: active ? 700 : 400 }}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </Shell>
  );
}

// 개인정보처리방침 — 1인 개발, 로그인/회원가입 없는 서비스 기준
// TODO(출시 전): [문의 이메일을 입력해주세요] 부분을 실제 이메일로 교체하고, 시행일자를 실제 배포일로 맞추기
function PrivacyPolicyScreen({ onBack }) {
  const CONTACT_EMAIL = "[문의 이메일을 입력해주세요]";
  const EFFECTIVE_DATE = "[시행일자를 입력해주세요 (예: 2026-10-01)]";
  const sections = [
    {
      title: "1. 수집하는 개인정보 항목",
      body:
        "이 앱은 회원가입·로그인 기능이 없어요. 이름, 전화번호, 이메일 등 개인을 식별할 수 있는 정보를 서버로 전송받거나 저장하지 않아요.",
    },
    {
      title: "2. 기기에 저장되는 정보",
      body:
        "즐겨찾기한 지원금 목록, 알림 켜기/끄기 설정, 마지막으로 선택한 지역 정보는 사용하시는 기기(브라우저)의 로컬 저장소에만 저장돼요. 이 정보는 외부 서버로 전송되지 않고, 앱을 삭제하거나 브라우저 저장공간을 초기화하면 함께 사라져요.",
    },
    {
      title: "3. 외부 공개 데이터 호출",
      body:
        "환율 정보 표시를 위해 공개 환율 API(open.er-api.com)를 호출해요. 이 요청에는 개인을 식별할 수 있는 정보가 포함되지 않아요.",
    },
    {
      title: "4. 개인정보의 제3자 제공",
      body: "이 앱은 어떤 개인정보도 수집하지 않으므로, 제3자에게 제공하거나 판매하지 않아요.",
    },
    {
      title: "5. 이용자의 권리",
      body:
        "기기에 저장된 즐겨찾기·설정 정보는 앱 내 초기화 기능이나 브라우저 설정에서 언제든지 직접 삭제할 수 있어요.",
    },
    {
      title: "6. 문의처",
      body: `개인정보 관련 문의사항은 아래 이메일로 연락해주세요.\n${CONTACT_EMAIL}`,
    },
    {
      title: "7. 시행일자",
      body: `이 개인정보처리방침은 ${EFFECTIVE_DATE}부터 적용돼요. 내용이 변경되는 경우 앱 내 공지를 통해 안내할게요.`,
    },
  ];
  return (
    <div>
      <SectionHeader title="개인정보처리방침" onBack={onBack} />
      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.title}>
            <p className="font-bold mb-1.5" style={{ color: TEXT, fontSize: 14.5 }}>{s.title}</p>
            <p className="whitespace-pre-line leading-relaxed" style={{ color: MUTED, fontSize: 13 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 이용약관 — 정보 제공 목적의 앱, 법적 효력 없는 참고 정보임을 명시
function TermsOfServiceScreen({ onBack }) {
  const EFFECTIVE_DATE = "[시행일자를 입력해주세요 (예: 2026-10-01)]";
  const sections = [
    {
      title: "제1조 (목적)",
      body:
        "이 약관은 소상공인 정책자금 알리미(이하 '이 앱')가 제공하는 서비스의 이용 조건과 절차, 이용자와 운영자의 권리·의무 및 책임사항을 정하는 것을 목적으로 해요.",
    },
    {
      title: "제2조 (서비스의 성격)",
      body:
        "이 앱은 정부·지자체·공공기관이 공개한 소상공인 정책자금·지원사업 정보를 모아 보여주는 정보 제공 서비스예요. 실제 지원금 신청·심사·지급은 각 사업의 주관 기관을 통해서만 이루어지며, 이 앱은 신청을 대행하거나 지원 여부를 결정하지 않아요.",
    },
    {
      title: "제3조 (정보의 정확성 및 면책)",
      body:
        "이 앱에 표시되는 지원사업 내용, 마감일, 금액, 연락처 등은 운영자가 확인 가능한 범위에서 정리한 참고 정보이며, 실제 공고와 다를 수 있어요. 신청 전에는 반드시 각 사업의 공식 홈페이지나 담당 기관을 통해 최신 정보를 확인해야 하고, 이 앱에 표시된 정보만을 근거로 한 의사결정에 대해 운영자는 책임을 지지 않아요.",
    },
    {
      title: "제4조 (서비스의 변경 및 중단)",
      body: "운영자는 서비스 운영상·기술상 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있어요.",
    },
    {
      title: "제5조 (지식재산권)",
      body:
        "이 앱의 디자인, 화면 구성, 자체 제작 콘텐츠에 대한 저작권은 운영자에게 있어요. 다만 앱에 인용된 정부·공공기관의 정책 정보 자체에 대한 권리는 해당 기관에 있어요.",
    },
    {
      title: "제6조 (준거법)",
      body: "이 약관은 대한민국 법령에 따라 해석·적용돼요.",
    },
    {
      title: "제7조 (시행일자)",
      body: `이 약관은 ${EFFECTIVE_DATE}부터 시행돼요.`,
    },
  ];
  return (
    <div>
      <SectionHeader title="이용약관" onBack={onBack} />
      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.title}>
            <p className="font-bold mb-1.5" style={{ color: TEXT, fontSize: 14.5 }}>{s.title}</p>
            <p className="whitespace-pre-line leading-relaxed" style={{ color: MUTED, fontSize: 13 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="w-11 h-6 rounded-full flex items-center px-0.5 shrink-0"
      style={{ background: checked ? BLUE : "#E2E4EA", justifyContent: checked ? "flex-end" : "flex-start" }}
    >
      <div className="w-5 h-5 rounded-full bg-white" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }} />
    </button>
  );
}

function Shell({ children }) {
  return (
    <div style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }} className="min-h-screen bg-white flex justify-center">
      <style>{`
        .navArrowBtn { background: transparent; border: 1px solid transparent; box-shadow: none; transition: background 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
        .navArrowBtn:active { background: #FFFFFF; border-color: ${BORDER}; box-shadow: 0 3px 10px rgba(0,0,0,0.22); }
      `}</style>
      <div className="w-full max-w-md min-h-screen bg-white px-5 pt-7 pb-10 relative">{children}</div>
    </div>
  );
}
