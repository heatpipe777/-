import React, { useState, useMemo, useEffect, useLayoutEffect, useRef } from "react";
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
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
  Check,
  Calculator,
  RefreshCw,
  ArrowUpDown,
  Lightbulb,
  Share2,
  Tag,
  Target,
  Receipt,
  CalendarDays,
  Briefcase,
  BadgeCheck,
  Copy,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import tileAllImg from "./assets/home-tiles/all.webp";
import tileCenterImg from "./assets/home-tiles/center.webp";
import tileExchangeImg from "./assets/home-tiles/exchange.webp";
import tileNewsImg from "./assets/home-tiles/news.webp";
import toolTaxImg from "./assets/home-tiles/tool-tax-icon.webp";
import toolFaqImg from "./assets/home-tiles/tool-faq-icon.webp";
import toolDocsImg from "./assets/home-tiles/tool-docs-icon.webp";
import calcArtImg from "./assets/home-tiles/calc-art.webp";
import noticeImg from "./assets/home-tiles/notice.webp";
import heroMegaImg from "./assets/home-tiles/hero-mega.webp";
import ctaCoinImg from "./assets/home-tiles/cta-coin.webp";
import newsFundImg from "./assets/news/fund.webp";
import newsFixedImg from "./assets/news/fixed.webp";
import newsTaxImg from "./assets/news/tax.webp";
import newsRegionImg from "./assets/news/region.webp";
import newsDigitalImg from "./assets/news/digital.webp";

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

// 앱 전체 공통 스타일 — 홈 화면 시안과 같은 느낌으로 맞춰요
const CARD = { background: "#FFFFFF", border: "1px solid #EEF0F6", boxShadow: "0 4px 16px rgba(40,60,120,0.05)" };
const CHIP_ON = { background: "linear-gradient(135deg, #5B8DF7, #3D63DD)", color: "white", boxShadow: "0 4px 10px rgba(61,99,221,0.22)" };
const CHIP_OFF = { background: "#F3F5FA", color: MUTED };
const INPUT_BG = "#F3F5FA";
const BTN_PRIMARY = { background: "linear-gradient(135deg, #5B8DF7, #3D63DD)", color: "white", boxShadow: "0 8px 18px rgba(61,99,221,0.28)" };

// 실제 확인한 소상공인 관련 정책 뉴스 (출처: 대한민국 정책브리핑, 한국시사경제)
const NEWS_CATEGORIES = ["전체", "정책자금", "고정비", "세제", "지역", "디지털"];
const NEWS_CATEGORY_STYLE = {
  정책자금: { bg: BLUE_SOFT, color: BLUE },
  고정비: { bg: GREEN_SOFT, color: GREEN },
  세제: { bg: GOLD_SOFT, color: GOLD },
  지역: { bg: "#FDEEE9", color: "#E5674D" },
  디지털: { bg: "#F1ECFC", color: "#7A3FE0" },
};
// 뉴스 카테고리별 대표 그림 (기사 사진은 저작권 문제가 있어서 앱 자체 일러스트를 써요)
const NEWS_THUMBS = {
  정책자금: newsFundImg,
  고정비: newsFixedImg,
  세제: newsTaxImg,
  지역: newsRegionImg,
  디지털: newsDigitalImg,
};
// 기사 대표 사진 — 사진이 없거나 불러오기 실패하면 주제 그림으로 대신해요
function NewsImage({ news, className, style }) {
  const [failed, setFailed] = useState(false);
  if (news.image && !failed) {
    return (
      <img
        src={news.image}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        draggable={false}
        onError={() => setFailed(true)}
        className={`${className} object-cover`}
        style={{ background: news.imageBg || "#F1F2F6", objectFit: news.imageFit || "cover", objectPosition: news.imagePosition || "center", ...style }}
      />
    );
  }
  const cat = NEWS_CATEGORY_STYLE[news.category] || { bg: "#F2F3F7" };
  return (
    <div className={`${className} overflow-hidden`} style={{ background: `linear-gradient(135deg, ${cat.bg} 0%, #FFFFFF 100%)`, ...style }}>
      <div className="relative w-full h-full">
        <img
          src={NEWS_THUMBS[news.category]}
          alt=""
          draggable={false}
          className="absolute right-0 top-1/2 -translate-y-1/2 h-full max-w-full object-contain"
          style={{ WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 60%, transparent 72%)", maskImage: "radial-gradient(circle at 50% 50%, #000 60%, transparent 72%)" }}
        />
      </div>
    </div>
  );
}

const NEWS = [
  {
    id: "n1",
    // 기업마당 공고엔 사진이 없어서, 같은 공고를 소개한 정책브리핑 카드뉴스 대표 이미지를 써요
    image: "https://www.korea.kr/newsWeb/resources/attaches/2025.12/30/9e6f350d84bd21ffd32562f993267431.jpg",
    imageSource: "대한민국 정책브리핑",
    imagePosition: "center top", // 이미지 위쪽 제목 글자가 잘리지 않게
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
    imageFit: "contain",
    imageBg: "#03132C",
    image: "https://yamlove77.com/wp-content/uploads/2026/08/Korean_business_support_funds_guide_202608141412-1-2.jpeg",
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
    image: "https://kbthink.com/content/dam/tam-dcp-cms/kbcontent/business/business-support-policy/opengraph-pc.png",
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
    image: "https://www.korea.kr/newsWeb/resources/attaches/2026.07/01/633cc081876773dfc4caee297fdbc63e.jpg",
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
    image: "https://www.hksisaeconomy.com/data/photos/portnews/202609/20260906201504-71428.jpg",
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

// "YYYY-MM-DD"를 한국(기기) 시간 기준 그날 0시로 해석해요 (new Date("YYYY-MM-DD")는 UTC 기준이라 하루 어긋날 수 있어요)
function parseLocalDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatLocalDate(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
// 앱을 며칠씩 켜둔 채 쓰다가 다시 열어도 D-day가 맞도록, 화면에 돌아올 때마다 refreshToday()로 갱신해요
let TODAY = startOfToday();
function refreshToday() {
  const next = startOfToday();
  if (next.getTime() === TODAY.getTime()) return false;
  TODAY = next;
  TAX_SCHEDULE = buildTaxSchedule();
  return true;
}
function getDday(deadlineStr) {
  return Math.round((parseLocalDate(deadlineStr) - TODAY) / (1000 * 60 * 60 * 24));
}
// 지원금이 적용되는 지역 목록 — 여러 시·도 공동 사업은 regions: ["대구", "경북"]처럼 적어요
function programRegions(p) {
  return p.regions || [p.region];
}
function isNational(p) {
  return programRegions(p).includes("전국");
}
// 그 지역 사장님이 받을 수 있는지 (전국 사업은 모든 지역에 해당)
function availableIn(p, r) {
  return isNational(p) || programRegions(p).includes(r);
}
function regionLabel(p) {
  return programRegions(p).join("·");
}

function isExpired(p) {
  return getDday(p.deadline) < 0;
}
// 마감 알림을 걸 수 있는 항목인지 (상시접수·이미 마감된 항목은 알릴 마감일이 없어요)
function canNotify(p) {
  return !p.recurring && !isExpired(p);
}
// 알림 받는 방식: 마감 며칠 전에 알릴지
const ALERT_PLANS = {
  light: { label: "가볍게", days: [1, 0], desc: "마감 1일 전과 당일에 알려드려요" },
  normal: { label: "적당히", days: [7, 3, 1, 0], desc: "마감 7일·3일·1일 전과 당일에 알려드려요" },
  daily: { label: "꼼꼼하게", days: [7, 6, 5, 4, 3, 2, 1, 0], desc: "마감 7일 전부터 매일 알려드려요" },
};
const ALERT_HOURS = [
  { h: 8, label: "오전 8시" },
  { h: 9, label: "오전 9시" },
  { h: 12, label: "낮 12시" },
  { h: 18, label: "오후 6시" },
];
const STAFF_TAX = ["원천세 신고·납부", "4대보험료 납부", "근로소득 지급명세서 제출"];
const MAX_ALERTS = 120; // 너무 많이 예약하지 않도록 상한을 둬요
// 알림 id는 숫자여야 해요 — 지원금 id("voucher" 같은 글자)를 숫자로 바꿔요
function alertBaseId(key) {
  let h = 0;
  for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) % 9000;
  return 100000 + h * 10;
}
function deadlineAlertText(name, days, what) {
  if (what === "일정") {
    if (days === 0) return { title: `오늘 · ${name}`, body: `오늘 '${name}' 일정이 있어요.` };
    return { title: `D-${days} · ${name}`, body: `'${name}'까지 ${days}일 남았어요. 미리 준비하세요.` };
  }
  if (days === 0) return { title: `오늘 마감 · ${name}`, body: `오늘이 ${what} 마지막 날이에요. 놓치지 마세요!` };
  return { title: `마감 D-${days} · ${name}`, body: `${what}까지 ${days}일 남았어요. 눌러서 확인하세요.` };
}
// 설정에 맞는 알림 목록을 만들어요 (시간순)
function buildAlertList({ programs, taxOn, taxStaff, rateOn, plan, hour, events = [], name = "사장님" }) {
  const now = new Date();
  const days = (ALERT_PLANS[plan] || ALERT_PLANS.normal).days;
  const list = [];
  const addDeadline = (key, name, deadline, what, extra) => {
    const base = alertBaseId(key);
    days.forEach((d, k) => {
      const at = parseLocalDate(deadline);
      at.setDate(at.getDate() - d);
      at.setHours(hour, 0, 0, 0);
      if (at <= now) return;
      list.push({ id: base + k, at, ...deadlineAlertText(name, d, what), extra });
    });
  };
  programs.forEach((p) => addDeadline(`p:${p.id}`, p.name, p.deadline, "신청 마감", { programId: p.id }));
  events.filter((ev) => ev.alert).forEach((ev) => eventOccurrences(ev).forEach((d) => addDeadline(`e:${ev.id}:${d}`, ev.title, d, "일정", { screen: "taxSchedule" })));
  if (taxOn) {
    // 세금은 60일 안의 일정만 (매달 돌아오는 원천세 등이 너무 많이 쌓이지 않게)
    const limit = new Date(now.getTime() + 60 * 864e5);
    TAX_SCHEDULE.filter((t) => taxStaff || !STAFF_TAX.includes(t.name))
      .filter((t) => parseLocalDate(t.deadline) <= limit)
      .forEach((t) => addDeadline(`t:${t.name}:${t.deadline}`, t.name, t.deadline, "신고·납부", { screen: "taxSchedule" }));
  }
  if (rateOn) {
    BOK_MEETINGS.forEach((d, i) => {
      const at = parseLocalDate(d);
      at.setHours(10, 10, 0, 0);
      if (at <= now) return;
      list.push({ id: 900000 + i, at, title: "오늘 한국은행 기준금리 발표일이에요", body: "금리가 바뀌었는지, 내 대출이자에 어떤 영향이 있는지 확인해 보세요.", extra: { screen: "exchange" } });
    });
  }
  // 알림 내용 앞에 이름을 붙여 불러요 (예: 민지님, 월급날까지 3일 남았어요)
  return list.sort((a, b) => a.at - b.at).slice(0, MAX_ALERTS).map((n) => ({ ...n, body: `${name}, ${n.body}` }));
}

// 마감임박순 정렬 — 이미 마감된 항목은 맨 뒤로 보내요
function byDeadline(a, b) {
  const da = getDday(a.deadline);
  const db = getDday(b.deadline);
  if ((da < 0) !== (db < 0)) return da < 0 ? 1 : -1;
  return da - db;
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
// 소상공인이 챙겨야 할 세금·보험 일정 (개인사업자 기준)
// monthDay: 매년 같은 날 / monthly: 매월 그 날짜 / who: 누구에게 해당하는지
const TAX_SCHEDULE_BASE = [
  { name: "원천세 신고·납부", monthly: 10, who: "직원 있음", note: "전달에 준 월급에서 뗀 세금 (반기 납부 승인 사업자는 1·7월)" },
  { name: "4대보험료 납부", monthly: 10, who: "직원 있음", note: "국민연금·건강·고용·산재보험료 (자동이체 권장)" },
  { name: "부가가치세 확정신고·납부", monthDay: "01-25", who: "모든 사업자", note: "2기 확정 (7~12월분) · 간이과세자는 1년분을 이때 한 번에" },
  { name: "사업장현황신고", monthDay: "02-10", who: "면세사업자", note: "병의원·학원 등 부가세 면세사업자만 해당" },
  { name: "근로소득 지급명세서 제출", monthDay: "03-10", who: "직원 있음", note: "작년에 지급한 근로소득 내역 제출" },
  { name: "부가가치세 예정고지·납부", monthDay: "04-25", who: "일반과세자", note: "1기 예정고지분 (고지서로 납부, 별도 신고 없음)" },
  { name: "종합소득세 신고·납부", monthDay: "05-31", who: "모든 사업자", note: "작년 소득 신고 · 지방소득세도 함께 신고" },
  { name: "근로·자녀장려금 정기 신청", monthDay: "05-31", who: "해당자", note: "소득·재산 요건을 충족하면 5월 한 달간 신청" },
  { name: "종합소득세 신고 (성실신고 대상)", monthDay: "06-30", who: "성실신고 대상", note: "매출이 업종별 기준 이상인 성실신고확인 대상자" },
  { name: "자동차세 (1기분)", monthDay: "06-30", who: "차량 보유", note: "1~6월분 · 1월에 연납하면 할인돼요" },
  { name: "부가가치세 확정신고·납부", monthDay: "07-25", who: "일반과세자", note: "1기 확정 (1~6월분)" },
  { name: "재산세 (건물분)", monthDay: "07-31", who: "사업장 소유", note: "건물·주택 1기분" },
  { name: "재산세 (토지분)", monthDay: "09-30", who: "사업장 소유", note: "토지·주택 2기분" },
  { name: "부가가치세 예정고지·납부", monthDay: "10-25", who: "일반과세자", note: "2기 예정고지분 (고지서로 납부, 별도 신고 없음)" },
  { name: "종합소득세 중간예납", monthDay: "11-30", who: "모든 사업자", note: "올해 소득세 일부를 미리 냄 (고지서로 납부)" },
  { name: "자동차세 (2기분)", monthDay: "12-31", who: "차량 보유", note: "7~12월분" },
];
function nextOccurrenceDate(item) {
  const year = TODAY.getFullYear();
  if (item.monthly) {
    const m = TODAY.getMonth();
    let d = new Date(year, m, item.monthly);
    if (d < TODAY) d = new Date(year, m + 1, item.monthly);
    return formatLocalDate(d);
  }
  let d = parseLocalDate(`${year}-${item.monthDay}`);
  if (d < TODAY) d = parseLocalDate(`${year + 1}-${item.monthDay}`);
  return formatLocalDate(d);
}
// 마감일이 토·일요일이면 다음 월요일까지 미뤄져요 (공휴일은 홈택스에서 확인)
function shiftWeekend(dateStr) {
  const d = parseLocalDate(dateStr);
  const add = d.getDay() === 6 ? 2 : d.getDay() === 0 ? 1 : 0;
  if (!add) return { deadline: dateStr, shifted: false };
  d.setDate(d.getDate() + add);
  return { deadline: formatLocalDate(d), shifted: true };
}
function buildTaxSchedule() {
  return TAX_SCHEDULE_BASE.map((t) => ({ ...t, ...shiftWeekend(nextOccurrenceDate(t)) }));
}
let TAX_SCHEDULE = buildTaxSchedule();

// ---- 호칭: 처음 실행 때 입력한 이름으로 불러요 (안 쓰면 "사장님") ----
const NICK_MAX = 6;
function callNameOf(nick) {
  const n = (nick || "").trim();
  if (!n) return "사장님";
  return n.endsWith("님") ? n : `${n}님`;
}

// 이름(닉네임) 입력 화면 — 첫 실행과 MY > 내 이름에서 같이 써요
function NicknameScreen({ initial = "", firstRun, onSave, onSkip, onBack }) {
  const [value, setValue] = useState(initial);
  const preview = callNameOf(value);
  return (
    <div className={firstRun ? "pt-8" : ""}>
      {firstRun ? (
        <div className="text-center mb-7">
          <div className="w-20 h-20 mx-auto rounded-[26px] flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #6AAEFE, #3E72F6)", boxShadow: "0 10px 24px rgba(62,114,246,0.3)" }}>
            <span className="text-[38px]">👋</span>
          </div>
          <p className="text-[22px] font-extrabold" style={{ color: TEXT }}>반가워요!</p>
          <p className="text-[15px] mt-1.5" style={{ color: "#5E6577" }}>어떻게 불러드릴까요?</p>
        </div>
      ) : (
        <HeroHeader icon={User} color={BLUE} title="내 이름" subtitle="앱 화면과 알림에서 이 이름으로 불러드려요" onBack={onBack} />
      )}

      <div className="flex items-center rounded-2xl px-4 py-3.5" style={{ background: INPUT_BG }}>
        <input
          autoFocus={firstRun}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\s+/g, "").slice(0, NICK_MAX))}
          placeholder="예: 김사장, 민지"
          className="flex-1 min-w-0 bg-transparent outline-none text-[17px] font-bold"
          style={{ color: TEXT }}
        />
        <span className="text-[12px] tabular-nums shrink-0" style={{ color: MUTED }}>{value.length}/{NICK_MAX}</span>
      </div>
      <p className="text-[11.5px] mt-2 px-1" style={{ color: MUTED }}>이름이나 가게 이름, 별명 모두 좋아요. "님"은 자동으로 붙어요.</p>

      {/* 미리보기 */}
      <div className="rounded-[22px] p-4 mt-5" style={{ background: "linear-gradient(135deg, #6AAEFE 0%, #3E72F6 100%)" }}>
        <p className="text-[11px] font-semibold text-white/70 mb-1">미리보기</p>
        <p className="text-[15px] font-semibold text-white">{preview}, 안녕하세요 👋</p>
        <p className="text-[12px] text-white/80 mt-1.5">🔔 {preview}, '월급날'까지 3일 남았어요.</p>
      </div>

      <button
        disabled={!value.trim()}
        onClick={() => onSave(value.trim())}
        className="w-full py-4 mt-6 rounded-2xl text-[15px] font-bold"
        style={value.trim() ? BTN_PRIMARY : { background: "#E7E9F0", color: MUTED }}
      >
        {firstRun ? "시작하기" : "저장하기"}
      </button>
      {firstRun ? (
        <button onClick={onSkip} className="w-full py-3.5 mt-1 text-[13px] font-semibold" style={{ color: MUTED }}>
          건너뛰기 · "사장님"으로 불러주세요
        </button>
      ) : (
        initial && (
          <button onClick={() => onSave("")} className="w-full py-3.5 mt-1 text-[13px] font-semibold" style={{ color: MUTED }}>
            이름 지우고 "사장님"으로 부르기
          </button>
        )
      )}
      <p className="text-[11px] text-center mt-3" style={{ color: "#A3A9B8" }}>이름은 이 휴대폰에만 저장되고, 어디로도 보내지 않아요.</p>
    </div>
  );
}

// ---- 사장님 일정 (내 일정 + 세금 + 즐겨찾기 지원금 마감) ----
const EVENT_PRESETS = [
  { title: "월급날", emoji: "💰", repeat: "monthly", day: 10 },
  { title: "임대료", emoji: "🏠", repeat: "monthly", day: 25 },
  { title: "대출 상환", emoji: "🏦", repeat: "monthly", day: 15 },
  { title: "카드대금", emoji: "💳", repeat: "monthly", day: 14 },
  { title: "공과금", emoji: "💡", repeat: "monthly", day: 25 },
  { title: "직접 입력", emoji: "📌", repeat: "once" },
];
const MY_ACCENT = "#E8890C";
// 매달 반복 일정의 다음 날짜 (31일처럼 없는 날은 그 달 마지막 날로)
function eventDateIn(year, month, day) {
  const last = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, last));
}
function eventOccurrences(ev, withinDays = 60) {
  const today = startOfToday();
  if (ev.repeat === "once") {
    const d = parseLocalDate(ev.date);
    return d >= today ? [formatLocalDate(d)] : [];
  }
  const out = [];
  const limit = new Date(today.getTime() + withinDays * 864e5);
  for (let m = 0; m <= Math.ceil(withinDays / 28); m++) {
    const d = eventDateIn(today.getFullYear(), today.getMonth() + m, ev.day);
    if (d >= today && d <= limit) out.push(formatLocalDate(d));
  }
  if (!out.length) out.push(formatLocalDate(eventDateIn(today.getFullYear(), today.getMonth() + 1, ev.day)));
  return out;
}
function eventRepeatLabel(ev) {
  if (ev.repeat === "once") return "한 번";
  return ev.day >= 31 ? "매달 말일" : `매달 ${ev.day}일`;
}
// 화면에 보여줄 일정 목록 (가까운 순)
const SCHEDULE_MONTHS = 12; // 일정 화면에 보여줄 기간
function buildScheduleItems({ favorites, myEvents }) {
  const items = [];
  const today = startOfToday();
  myEvents.forEach((ev) => {
    const dates = ev.repeat === "once" ? eventOccurrences(ev) : eventOccurrences(ev, SCHEDULE_MONTHS * 30);
    dates.forEach((d) =>
      items.push({ key: `my:${ev.id}:${d}`, type: "my", name: ev.title, deadline: d, who: eventRepeatLabel(ev), note: ev.alert ? "알림 켜짐" : "알림 꺼짐", ev, emoji: ev.emoji || "📌" })
    );
  });
  TAX_SCHEDULE.forEach((t) => {
    if (!t.monthly) return items.push({ key: `tax:${t.name}:${t.deadline}`, type: "tax", ...t });
    // 원천세·4대보험처럼 매달 있는 일정은 달마다 따로 넣어요 (주말이면 다음 월요일)
    for (let m = 0; m < SCHEDULE_MONTHS; m++) {
      const raw = formatLocalDate(eventDateIn(today.getFullYear(), today.getMonth() + m, t.monthly));
      if (parseLocalDate(raw) < today) continue;
      const sw = shiftWeekend(raw);
      items.push({ key: `tax:${t.name}:${sw.deadline}`, type: "tax", ...t, ...sw });
    }
  });
  ALL_PROGRAMS.filter((p) => favorites.has(p.id) && !p.recurring && getDday(p.deadline) >= 0).forEach((p) =>
    items.push({ key: `p:${p.id}`, type: "subsidy", name: p.name, deadline: p.deadline, note: p.amountLabel, who: "내 즐겨찾기", programId: p.id })
  );
  return items.sort(byDeadline);
}

const REGIONS = ["전체", "전국", "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

// ---- 맞춤 진단 ----
// 질문 보기 (결과 화면의 요약에도 같이 써요)
const DIAG_INDUSTRY = [
  { key: "food", label: "음식점·카페" },
  { key: "retail", label: "도소매·쇼핑몰" },
  { key: "service", label: "서비스 (미용·학원·수리 등)" },
  { key: "mfg", label: "제조·건설·운수" },
  { key: "etc", label: "기타" },
];
const DIAG_REVENUE = [
  { key: "under30", label: "3천만원 이하" },
  { key: "30to100", label: "3천만원 ~ 1억원" },
  { key: "100to140", label: "1억원 ~ 1억 4백만원" },
  { key: "over140", label: "1억 4백만원 초과" },
];
const DIAG_YEARS = [
  { key: "pre", label: "아직 창업 전이에요 (예비 창업)" },
  { key: "under1", label: "1년 미만" },
  { key: "1to3", label: "1~3년" },
  { key: "over3", label: "3년 이상" },
];
const DIAG_EMPLOYEES = [
  { key: "0", label: "없어요 (혼자 운영)" },
  { key: "1to4", label: "1~4명" },
  { key: "5to9", label: "5~9명" },
  { key: "10plus", label: "10명 이상" },
];
const DIAG_NEEDS = [
  { key: "funds", label: "운영자금·대출", categories: ["경영", "보증", "신용"] },
  { key: "fixed", label: "고정비 줄이기 (공과금·전기료 등)", categories: ["고정비", "에너지"] },
  { key: "hire", label: "직원 채용·인건비", categories: ["고용"] },
  { key: "digital", label: "장비·디지털 도입 (키오스크 등)", categories: ["디지털전환", "에너지"] },
  { key: "refinance", label: "비싼 대출 갈아타기", categories: [] },
  { key: "restart", label: "재기·재창업", categories: ["재기"] },
];
const DIAG_SITUATION = [
  { key: "decline", label: "매출이 줄었어요" },
  { key: "lowCredit", label: "신용점수가 낮은 편이에요" },
  { key: "closing", label: "폐업했거나 폐업을 고민 중이에요" },
  { key: "none", label: "해당 없어요" },
];
const diagLabel = (list, key) => (list.find((o) => o.key === key) || {}).label;

// 상시근로자 기준으로 소상공인에 해당하는지 (제조·건설·운수는 10인 미만, 그 외 5인 미만)
function isSmallBusiness(diag) {
  if (!diag.employees) return true;
  if (diag.employees === "10plus") return false;
  if (diag.employees === "5to9") return diag.industry === "mfg";
  return true;
}

// 지원금 하나가 진단 답변에 맞는지 판정하고, 추천 점수와 이유를 함께 돌려줘요
function diagnoseProgram(p, diag) {
  const needs = diag.needs || [];
  const situation = diag.situation || [];
  const lowCredit = situation.includes("lowCredit");
  const restartCase = situation.includes("closing") || needs.includes("restart") || diag.yearsBand === "pre";
  const declineCase = situation.includes("decline");

  // 1) 지역
  const regionOk = availableIn(p, diag.region);
  if (!regionOk) return { eligible: false };

  // 2) 소상공인 규모 — 아니면 중소기업도 받을 수 있는 자금만
  const target = typeof p.target === "string" ? p.target : "";
  if (!isSmallBusiness(diag) && !/중소기업|소기업/.test(target)) return { eligible: false };

  // 3) 예비 창업자 — 사업자등록 전이라 재창업·재도전 자금 외에는 대상이 아니에요
  if (diag.yearsBand === "pre" && p.category !== "재기") return { eligible: false };

  // 4) 매출 조건
  if (p.detailed && diag.revenueBand === "over140") return { eligible: false };
  if (p.id === 15 && diag.revenueBand === "over140") return { eligible: false };

  // 5) 신용·재기 전용 자금은 해당하는 분만
  if ((p.id === 102 || p.id === 13) && !lowCredit) return { eligible: false };
  if (p.id === 103 && !lowCredit && !needs.includes("refinance")) return { eligible: false };
  if (p.category === "재기" && !restartCase && !(p.id === 21 && declineCase)) return { eligible: false };

  // 추천 점수와 이유
  let score = 0;
  const reasons = [];
  const need = DIAG_NEEDS.find((n) => needs.includes(n.key) && n.categories.includes(p.category));
  if (need) {
    score += 3;
    reasons.push(`'${need.label.split(" (")[0]}'에 맞는 지원이에요`);
  }
  if (p.id === 103 && needs.includes("refinance")) {
    score += 3;
    reasons.push("비싼 대출을 저금리로 바꿀 수 있어요");
  }
  if (lowCredit && p.category === "신용") {
    score += 2;
    reasons.push("신용점수가 낮아도 신청할 수 있어요");
  }
  if (declineCase && (p.id === "voucher" || p.id === 101 || p.id === 21)) {
    score += 2;
    reasons.push("매출 감소 소상공인에게 도움이 돼요");
  }
  if (restartCase && p.category === "재기") {
    score += 2;
    reasons.push("재기·재창업을 지원해요");
  }
  if (diag.employees && diag.employees !== "0" && p.category === "고용") {
    score += 1;
    if (!need) reasons.push("직원을 고용 중이면 인건비를 받을 수 있어요");
  }
  if (diag.industry === "food" && p.category === "에너지") {
    score += 1;
    if (!need) reasons.push("냉장고 등 전기를 많이 쓰는 음식점에 유리해요");
  }
  if (!isNational(p)) {
    score += 1;
    if (reasons.length === 0) reasons.push(`우리 지역(${diag.region}) 소상공인 전용이에요`);
  }

  // 확인이 필요한 조건
  const warnings = [];
  if (p.id === 11 && lowCredit) warnings.push("신용점수 기준(NICE 710점 이상)을 확인하세요");
  if (p.detailed && diag.yearsBand === "under1") warnings.push("2025년 이전에 개업했어야 해요");

  return { eligible: true, score, reason: reasons[0] || warnings[0] || null, warnings };
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

// 지역·분야별 지원사업 — verified: true인 항목은 검색으로 실제 확인한 정보
const SAMPLE_PROGRAMS = [
  { id: 1, name: "소상공인 고효율기기 지원사업", region: "전국", category: "에너지", target: "비주거용 전기 사용 소상공인, 고효율가전 교체 희망자", amountLabel: "1등급 가전 구매비 40% 환급 (품목별 한도)", deadline: "2026-12-31", verified: true, note: "한국전력공사가 운영해요. 2026.2.9~12.31 접수하고, 2026년 1월 1일 이후 구매분은 소급 신청할 수 있어요. 예산(388억원)이 소진되면 조기 마감돼요.", popularity: 640 },
  { id: 2, name: "서울시 중소기업육성자금 (경영안정자금)", region: "서울", category: "보증", target: "서울특별시 소재 사업자등록을 마친 소상공인·중소기업 (융자제한업종 제외)", amountLabel: "자금 종류별 상이 (서울신용보증재단 보증부대출)", deadline: "2099-12-31", recurring: true, recurringNote: "서울신용보증재단 통해 연중 상시 접수, 예산 소진 시 조기 마감", verified: true, note: "경제활성화자금·희망동행자금(대환대출)·서울배달상생자금 등 여러 세부 자금 중 상황에 맞는 걸 골라 신청해요. 정확한 한도·금리는 서울신용보증재단 공고를 확인하세요.", popularity: 810 },
  { id: 3, name: "경기도 소상공인 정책자금", region: "경기", category: "경영", target: "경기도 소재 사업자등록을 마친 소상공인", amountLabel: "최대 5,000만원 (연 2.5%)", deadline: "2099-12-31", recurring: true, recurringNote: "경기신용보증재단 통해 연중 상시 접수, 예산 소진 시 조기 마감", verified: true, note: "일반 정책자금보다 낮은 금리로 운전·시설자금을 지원해요. 정확한 한도·조건은 경기신용보증재단 공고를 확인하세요.", popularity: 520 },
  { id: 4, name: "2026년 스마트상점 기술보급사업", region: "전국", category: "디지털전환", target: "키오스크·서빙로봇·사이니지 등 스마트기술 도입 희망 소상공인", amountLabel: "구입형 최대 700만원 · 렌탈형 연 최대 350만원", deadline: "2026-09-30", verified: true, note: "2026년 2차 모집(8.26~9.30)까지 접수가 끝났어요. 다음 공고는 보통 연초에 소상공인스마트상점(sbiz.or.kr/smst)에 올라와요.", popularity: 890 },
  { id: 5, name: "부산 자영업자 청년고용 인건비 지원", region: "부산", category: "고용", target: "부산 소재 자영업체에서 청년을 신규 고용한 소상공인", amountLabel: "1인당 월 180만원, 최대 24개월", deadline: "2099-12-31", recurring: true, recurringNote: "부산시소상공인종합지원센터 통해 연중 공모, 예산 소진 시 조기 마감", verified: true, note: "청년을 신규 채용하면 인건비 일부를 지원받아요. 세부 연령·소득 기준은 회차별 공고를 확인하세요.", popularity: 705 },
  { id: 7, name: "대구·경북 소상공인 경영안정자금 (이차보전)", region: "대구", regions: ["대구", "경북"], category: "보증", target: "연 매출 5억원 이하 소상공인 (국세·지방세 체납자, 휴·폐업, 유흥·사치업종 제외)", amountLabel: "대출이자 1~2년간 일부 지원 (신용보증재단 특례보증 연계)", deadline: "2099-12-31", recurring: true, recurringNote: "대구신용보증재단 통해 상·하반기 공고, 예산 소진 시 조기 마감", verified: true, note: "대출 자체가 아니라 대출받을 때 발생하는 이자 일부를 지자체가 보전해줘요. 보증서 발급 후 협약은행에서 대출을 실행해요.", popularity: 430 },
  { id: 8, name: "희망인천 특례보증", region: "인천", category: "보증", target: "인천광역시 소재 소기업·소상공인 (홈플러스 폐점 피해기업 등 포함)", amountLabel: "업체당 최대 5,000만원 + 이자지원(1년차 연 2%, 2~3년차 연 1.5%)", deadline: "2099-12-31", recurring: true, recurringNote: "인천신용보증재단 통해 연중 상시 접수, 예산 소진 시 조기 마감", verified: true, note: "보증기간 6년(1년 거치·5년 분할상환)에 이자까지 지원해줘요. 정확한 대상·한도는 인천신용보증재단 공고를 확인하세요.", popularity: 610 },
  { id: 11, name: "강원특별자치도 소상공인 경영안정자금", region: "강원", category: "경영", target: "강원 도내 소재 사업장 소상공인 (개인신용평점 NICE 710점 이상 또는 KCB 620점 이상)", amountLabel: "연간 2,000억원 규모 융자 (기본 이자지원 연 2%, 다자녀 추가 지원)", deadline: "2099-12-31", recurring: true, recurringNote: "1차(2~6월)·2차(7월~) 두 차례 공고, 자금 소진 시 조기 마감", verified: true, note: "일시상환(2년) 또는 분할상환(2년 거치·3년 분할) 중 선택할 수 있어요. 다자녀 소상공인은 이자지원이 추가돼요. 정확한 일정·한도는 강원특별자치도 공고를 확인하세요.", popularity: 380 },
  { id: 12, name: "제주도 소상공인 육성자금 (경영안정자금)", region: "제주", category: "경영", target: "제주특별자치도 소재 사업자등록을 마친 소상공인", amountLabel: "2026년 총 420억원 규모 저금리 융자", deadline: "2099-12-31", recurring: true, recurringNote: "제주경제통상진흥원·제주신용보증재단 통해 연중 상시 접수, 예산 소진 시 조기 마감", verified: true, note: "제주도가 시설·경영안정자금 등 저금리 융자를 지원해요. 정확한 한도·금리는 제주경제통상진흥원 공고를 확인하세요.", popularity: 295 },
  { id: 13, name: "광주광역시 미소금융 이자지원 사업", region: "광주", category: "신용", target: "미소금융(창업·운영·시설개선·긴급생계자금) 이용 중인 개인신용평점 하위 20%(KCB 700점·NICE 749점 이하), 기초생활수급자, 차상위계층, 근로장려금 수급자 소상공인", amountLabel: "연 4.5% 이자 1년 전액 지원", deadline: "2026-12-31", recurring: true, recurringNote: "예산(2억5천만원) 소진 시 조기 마감", verified: true, note: "미소금융재단 대출을 정상 상환하면 광주시가 이자를 보전해줘요. 광주지역 7개 미소금융 수행기관이나 광주경제진흥상생일자리재단에서 신청해요.", popularity: 250 },
  { id: 14, name: "대전광역시 소상공인 인건비 지원사업", region: "대전", category: "고용", target: "대전 소재 소상공인, 2026.1.1~9.10 사이 18세 이상 근로자 신규 고용(월 60시간 이상, 3개월 이상 고용유지, 4대보험 가입)", amountLabel: "근로자 1인당 150만원 (월 50만원×3개월)", deadline: "2026-11-30", verified: true, note: "대전비즈 홈페이지에서 온라인 접수하며 예산 소진 시까지 상시·선착순으로 접수해요. 문의: 대전일자리경제진흥원(042-380-3063).", popularity: 410 },
  { id: 15, name: "대전광역시 소상공인 경영회복 지원금", region: "대전", category: "고정비", target: "대전 소재 소상공인, 전년도 매출 1억 400만원 미만, 임차료·공과금 등 경영비용 지출 증빙 가능자", amountLabel: "업체당 최대 30만원", deadline: "2026-03-31", verified: true, note: "2026.2.9~3.31 접수가 끝났어요. 공동사업자는 대표자 1인만, 여러 사업체를 운영해도 1개 사업체만 지원됐어요.", popularity: 365 },
  { id: 16, name: "경상남도 소상공인 정책자금", region: "경남", category: "경영", target: "경남 도내 소재 「소상공인기본법」상 소상공인 (개인·법인)", amountLabel: "최대 1억원, 이차보전 최대 연 3.0%(1년)", deadline: "2026-12-31", recurring: true, recurringNote: "2026.1.19~12.31 상시 접수, 총 2,000억원 규모 소진 시 조기 마감", verified: true, note: "경영안정자금·창업명절 특별자금·버팀목 특별자금 등 여러 세부 자금 중 상황에 맞는 걸 골라 신청해요. 경남신용보증재단에서 온라인·방문 신청.", popularity: 455 },
  { id: 17, name: "울산광역시 소상공인 경영안정자금 (4차)", region: "울산", category: "보증", target: "울산 소재 소상공인 (도소매업·음식업은 상시근로자 5인 미만, 제조업·건설업 등은 10인 미만)", amountLabel: "업체당 최대 8,000만원, 이자지원 연 1.2~2.5%", deadline: "2026-12-31", recurring: true, recurringNote: "2026.9.10부터 선착순 접수, 200억원 규모 소진 시 조기 마감", verified: true, note: "울산신용보증재단의 보증·추천을 받아 협약은행에서 대출을 실행하고, 울산시가 대출이자 일부를 지원해요. 상환방식을 몇 가지 중 고를 수 있어요.", popularity: 500 },
  { id: 18, name: "충청북도 소상공인 육성자금", region: "충북", category: "경영", target: "충북 내 사업장을 둔 소상공인 (제조업·건설업·운수업·광업은 10인 미만, 그 외 업종은 5인 미만)", amountLabel: "최대 7,000만원 (착한가격업소는 최대 1억원), 이차보전 연 2%", deadline: "2026-12-31", recurring: true, recurringNote: "총 2,000억원을 1차(700억)·2차(600억)·3차(700억)로 나눠 접수, 회차별 예산 소진 시 마감", verified: true, note: "신규 운전자금부터 시설개보수자금까지 지원해요. '보증드림' 앱이나 충북신용보증재단(043-249-5700)에서 신청해요.", popularity: 340 },
  { id: 19, name: "세종특별자치시 소상공인자금", region: "세종", category: "경영", target: "세종 소재 사업자등록 후 운영 중인 「소상공인기본법」상 소상공인", amountLabel: "최대 7,000만원, 이자지원 최대 연 2.0%", deadline: "2026-12-31", recurring: true, recurringNote: "분기별 공급(1월 100억·4월 200억·7월 200억·10월 100억), 분기 예산 소진 시 마감", verified: true, note: "세종신용보증재단에서 보증서를 발급받아 협약은행에서 대출을 실행해요. 신청·문의는 세종신용보증재단으로.", popularity: 210 },
  { id: 21, name: "충남도 소상공인 재기 지원", region: "충남", category: "재기", target: "「충청남도 소상공인 지원 및 보호에 관한 조례」상 도내 소상공인 중 매출 감소 등 경영위기 요건 충족자", amountLabel: "경영개선·재창업 자금 최대 850만원", deadline: "2099-12-31", recurring: true, recurringNote: "충남경제진흥원 통해 연중 여러 차례 회차 모집, 회차별 접수 일정·모집 인원(70개 업체 내외) 상이", verified: true, note: "2025년 매출 감소, 2026년 1분기 매출 감소, 또는 물가상승률(2.5%)보다 적게 오른 소상공인 등이 대상이에요. 회차 공고는 충남경제진흥원에서 확인하세요.", popularity: 300 },
  { id: 22, name: "전북특별자치도 중소기업육성자금 (경영안정자금)", region: "전북", category: "경영", target: "전북 도내 사업자등록을 마친 소상공인·중소기업", amountLabel: "2026년 3분기 총 590억원 규모 (경영안정자금 400억원 포함)", deadline: "2099-12-31", recurring: true, recurringNote: "분기별 순차 공고, 전북도 중소기업종합지원시스템에서 온라인 접수", verified: true, note: "창업·경쟁력강화자금, 경영안정자금, 벤처기업육성자금으로 나뉘어요. 소상공인은 주로 경영안정자금(운전자금) 쪽에 해당돼요. 정확한 회차별 일정은 전북도 공고를 확인하세요.", popularity: 260 },
  { id: 23, name: "소상공인 고용보험료 지원사업", region: "전국", category: "고정비", target: "자영업자 고용보험에 가입한 소상공인 (상시근로자 5인 미만, 광업·제조·건설·운수업은 10인 미만)", amountLabel: "고용보험료의 50~80% (기준보수 등급별), 최대 5년", deadline: "2026-12-31", verified: true, note: "기준보수 1~2등급은 80%, 3~4등급 60%, 5~7등급 50%를 돌려받아요. 폐업 시 실업급여를 받을 수 있는 안전망이에요. 문의: 중소기업통합콜센터 1357", popularity: 0 },
  { id: 24, name: "희망리턴패키지 원스톱폐업지원", region: "전국", category: "재기", target: "폐업했거나 폐업 예정인 소상공인", amountLabel: "점포철거비 최대 600만원 + 사업정리컨설팅·법률자문·채무조정", deadline: "2099-12-31", recurring: true, recurringNote: "2026년 1월부터 예산 소진 시까지 접수", verified: true, note: "점포철거비는 전용면적 3.3㎡당 20만원 한도예요. 컨설팅(세무·부동산·심리 등 최대 3개 분야)·법률자문·채무조정을 함께 신청할 수 있어요. 희망리턴패키지(hope.sbiz.or.kr)·소상공인24에서 신청해요.", popularity: 0 },
  { id: 25, name: "희망리턴패키지 특화취업지원", region: "전국", category: "재기", target: "취업 의사가 있는 폐업(예정) 소상공인 (만 15~69세)", amountLabel: "취업교육·심리회복 + 전직장려수당 최대 100만원", deadline: "2099-12-31", recurring: true, recurringNote: "예산 소진 시까지 접수", verified: true, note: "폐업 후 직장인으로 새 출발하려는 사장님을 위한 사업이에요. 국민취업지원제도와 연계돼요. 소상공인24에서 신청하고, 문의는 1533-0100이에요.", popularity: 0 },
  { id: 26, name: "전남 함평군 소상공인 융자금 이차보전", region: "전남", category: "보증", target: "함평군에 사업장을 두고 1년 이상 운영 중인 소상공인 (신규 사업장 우선)", amountLabel: "대출 최대 3,000만원, 이자 3.0% 최장 2년 지원", deadline: "2099-12-31", recurring: true, recurringNote: "2026.3.24부터 선착순 접수, 예산 소진 시 마감", verified: true, note: "함평군청 민원봉사과에서 접수하고, 전남신용보증재단 나주지점이 보증 상담을 함께 해줘요. 전남 다른 시·군(목포 등)도 비슷한 이차보전 사업이 있으니 시·군청에 문의하세요.", popularity: 0 },
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

// 지원금 정보를 카카오톡·문자 등으로 보내요 (앱: 안드로이드 공유창, 웹: 공유 또는 복사)
async function shareProgram(p) {
  const d = getDday(p.deadline);
  const when = p.recurring ? "상시접수" : d < 0 ? "접수 마감" : `마감 ${p.deadline} (D-${d})`;
  const text = [
    `[지원금알리미] ${p.name}`,
    `· 지역: ${regionLabel(p)}`,
    `· 지원: ${p.amountLabel}`,
    `· 접수: ${when}`,
    "",
    "자세한 조건은 지원금알리미에서 확인하세요 👇",
  ].join("\n");
  const url = "https://sosanggongin.vercel.app";
  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({ title: p.name, text, url, dialogTitle: "지원금 정보 공유하기" });
    } else if (navigator.share) {
      await navigator.share({ title: p.name, text, url });
    } else {
      await copyText(`${text}\n${url}`);
      alert("지원금 정보를 복사했어요. 원하는 곳에 붙여넣기 하세요.");
    }
  } catch (e) {
    // 사용자가 공유창을 닫은 경우 — 아무것도 하지 않아요
  }
}

function ShareButton({ program }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        shareProgram(program);
      }}
      aria-label="공유하기"
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ background: "#F5F6F9" }}
    >
      <Share2 size={15} color={MUTED} strokeWidth={2} />
    </button>
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
      <button onClick={onBack} className="navArrowBtn w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center" aria-label="뒤로가기">
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
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="navArrowBtn w-9 h-9 -ml-2 rounded-full flex items-center justify-center" aria-label="뒤로가기">
          <ChevronLeft size={22} color={TEXT} />
        </button>
        <h2 className="text-[17px] font-bold flex-1" style={{ color: TEXT }}>{title}</h2>
        {right}
      </div>
      <div
        className="relative overflow-hidden rounded-[24px] px-4 py-4 flex items-center gap-3.5"
        style={{ background: `linear-gradient(135deg, ${color}1F 0%, ${color}0A 60%, #FFFFFF 100%)`, border: `1px solid ${color}14` }}
      >
        <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full" style={{ background: `${color}12` }} />
        <div className="absolute right-10 -bottom-12 w-24 h-24 rounded-full" style={{ background: `${color}0C` }} />
        {/* 광택 있는 입체 느낌 아이콘 */}
        <div
          className="relative w-[52px] h-[52px] rounded-[18px] flex items-center justify-center shrink-0 overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${color}B3 0%, ${color} 70%)`,
            boxShadow: `0 8px 16px ${color}45, inset 0 -3px 6px rgba(0,0,0,0.12)`,
          }}
        >
          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full" style={{ background: "rgba(255,255,255,0.28)" }} />
          <Icon size={24} color="white" strokeWidth={2.2} className="relative" />
        </div>
        {subtitle && <p className="relative text-[13px] leading-relaxed font-medium break-keep" style={{ color: "#5E6577" }}>{subtitle}</p>}
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
        right={
          <div className="flex items-center gap-1.5">
            <ShareButton program={program} />
            <HeartButton active={favorites.has(program.id)} onClick={() => onToggleFavorite(program.id)} />
          </div>
        }
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
        className="w-full mt-5 py-4 rounded-2xl text-white text-[14.5px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform"
        style={BTN_PRIMARY}
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
function SimpleDetail({ program, onBack, favorites, onToggleFavorite }) {
  const dday = getDday(program.deadline);
  const color = urgencyColor(dday);
  const catStyle = CATEGORY_COLORS[program.category] || { color: BLUE, bg: BLUE_SOFT, bg2: BLUE_SOFT };
  const CatIcon = CATEGORY_ICON[program.category] || Wallet;
  const closed = dday < 0 && !program.recurring;
  return (
    <div>
      <SectionHeader
        title="지원금 상세"
        onBack={onBack}
        right={
          <div className="flex items-center gap-1.5">
            <ShareButton program={program} />
            <HeartButton active={favorites.has(program.id)} onClick={() => onToggleFavorite(program.id)} />
          </div>
        }
      />
      {closed && (
        <div className="rounded-[20px] p-4 mb-3 flex items-start gap-2.5" style={{ background: "#F4F5F8" }}>
          <Clock size={15} color={MUTED} className="shrink-0 mt-0.5" />
          <p className="text-[12.5px] leading-relaxed break-keep" style={{ color: "#5E6577" }}>
            <b style={{ color: TEXT }}>올해 접수가 끝났어요.</b> 아래 내용은 지난 공고 기준이에요. 다음 공고가 나오면 새 정보로 바꿔드릴게요.
          </p>
        </div>
      )}
      <div
        className="relative overflow-hidden rounded-[24px] p-4 mb-3 flex items-center gap-3.5"
        style={{ background: `linear-gradient(135deg, ${catStyle.bg}55 0%, #FFFFFF 85%)`, border: "1px solid #EEF0F6" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${catStyle.bg2}, ${catStyle.bg})`,
            boxShadow: `0 6px 14px ${catStyle.bg}55, inset 0 -3px 6px rgba(0,0,0,0.12)`,
          }}
        >
          <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
          <CatIcon size={24} color={catStyle.color} strokeWidth={2.3} className="relative" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.8)", color: BLUE }}>{program.category}</span>
            <span className="text-[11px]" style={{ color: MUTED }}><MapPin size={10} className="inline -mt-0.5" /> {regionLabel(program)}</span>
          </div>
          <p className="text-[16.5px] font-bold leading-snug break-keep" style={{ color: TEXT }}>{program.name}</p>
        </div>
        <span
          className="text-[11.5px] font-bold px-2 py-1 rounded-lg shrink-0 self-start tabular-nums"
          style={program.recurring ? { background: GREEN_SOFT, color: GREEN } : dday < 0 ? { background: "#F1F2F5", color: MUTED } : { background: `${color}1A`, color }}
        >
          {program.recurring ? "상시" : dday >= 0 ? `D-${dday}` : "마감"}
        </span>
      </div>
      <div className="rounded-[20px] p-4 mb-3" style={CARD}>
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
        className="rounded-[20px] p-4 flex items-start gap-2"
        style={program.verified ? { background: GREEN_SOFT } : { background: "#F6F7FA" }}
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
        className="w-full mt-5 py-4 rounded-2xl text-[14.5px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform"
        style={closed ? { background: "#EEF0F5", color: "#5E6577" } : BTN_PRIMARY}
      >
        {closed ? "다음 공고 확인하기" : "신청하러 가기"} <ExternalLink size={15} />
      </a>
      <button
        onClick={() => shareProgram(program)}
        className="w-full mt-2.5 py-3.5 rounded-2xl text-[13.5px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform"
        style={{ background: BLUE_SOFT, color: BLUE }}
      >
        <Share2 size={15} /> 다른 사장님께 공유하기
      </button>
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
// 무료 공개 API — 상업적 이용 가능, 하루 1회 갱신. 약관상 "Rates By Exchange Rate API" 출처 링크를 꼭 표시해야 해요.
// 기기마다 3시간 캐시라 호출 제한(IP당)에 걸릴 일은 거의 없어요.
// unit: 화면에 "몇 단위당 원화"로 보여줄지 (엔·동·루피아는 1단위가 너무 작아 100단위 기준)
// sample: 계산기에서 그 통화를 고르면 처음 넣어줄 금액 (자주 쓰는 단위)
const FX_CURRENCIES = [
  { code: "USD", label: "미국 달러", flag: "🇺🇸", unit: 1, major: true, sample: 100 },
  { code: "JPY", label: "일본 엔", flag: "🇯🇵", unit: 100, major: true, sample: 10000 },
  { code: "EUR", label: "유럽 유로", flag: "🇪🇺", unit: 1, major: true, sample: 100 },
  { code: "CNY", label: "중국 위안", flag: "🇨🇳", unit: 1, major: true, sample: 1000 },
  { code: "GBP", label: "영국 파운드", flag: "🇬🇧", unit: 1, sample: 100 },
  { code: "HKD", label: "홍콩 달러", flag: "🇭🇰", unit: 1, sample: 1000 },
  { code: "TWD", label: "대만 달러", flag: "🇹🇼", unit: 1, sample: 1000 },
  { code: "VND", label: "베트남 동", flag: "🇻🇳", unit: 100, sample: 1000000 },
  { code: "THB", label: "태국 바트", flag: "🇹🇭", unit: 1, sample: 1000 },
  { code: "PHP", label: "필리핀 페소", flag: "🇵🇭", unit: 1, sample: 1000 },
  { code: "IDR", label: "인도네시아 루피아", flag: "🇮🇩", unit: 100, sample: 1000000 },
  { code: "MYR", label: "말레이시아 링깃", flag: "🇲🇾", unit: 1, sample: 100 },
  { code: "SGD", label: "싱가포르 달러", flag: "🇸🇬", unit: 1, sample: 100 },
  { code: "AUD", label: "호주 달러", flag: "🇦🇺", unit: 1, sample: 100 },
  { code: "CAD", label: "캐나다 달러", flag: "🇨🇦", unit: 1, sample: 100 },
  { code: "CHF", label: "스위스 프랑", flag: "🇨🇭", unit: 1, sample: 100 },
];
const FX_CACHE_KEY = "fxCache";
const FX_CACHE_TTL = 3 * 60 * 60 * 1000; // 3시간 — API가 하루 1회 갱신이라 그 안에는 다시 받을 필요가 없어요

function readFxCache() {
  try {
    const c = JSON.parse(localStorage.getItem(FX_CACHE_KEY));
    return c && c.rates ? c : null;
  } catch (e) {
    return null;
  }
}

// 100원 미만은 소수점 둘째 자리까지 보여줘야 차이가 보여요
function formatKrw(v) {
  return v >= 100 ? Math.round(v).toLocaleString() : v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 환율 자체는 은행 고시처럼 소수점 둘째 자리까지 보여줘요 (반올림해서 보여주면 계산기 결과와 안 맞아 보여요)
function formatRate(v) {
  return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatFx(v) {
  return v.toLocaleString(undefined, { maximumFractionDigits: v >= 100 ? 0 : 2 });
}

// 입력값에 천 단위 쉼표를 넣어 보여줘요 (소수점 입력도 유지)
function withCommas(raw) {
  if (!raw) return "";
  const [i, d] = raw.split(".");
  const intPart = i ? Number(i).toLocaleString() : "0";
  return d !== undefined ? `${intPart}.${d}` : intPart;
}

function ExchangeRateContent() {
  const cached = useMemo(readFxCache, []);
  const [rates, setRates] = useState(cached ? cached.rates : null);
  const [updatedAt, setUpdatedAt] = useState(cached ? cached.updatedAt : null);
  const [status, setStatus] = useState(cached ? "ready" : "loading");
  const [refreshing, setRefreshing] = useState(false);
  const [offline, setOffline] = useState(false);
  const [checkedAt, setCheckedAt] = useState(cached ? cached.savedAt : null); // 마지막으로 서버에 확인한 시각
  const [refreshMsg, setRefreshMsg] = useState(null); // 새로고침 결과 안내 { ok, text }
  const msgTimer = useRef(null);

  const [code, setCode] = useState("USD");
  const [toKrw, setToKrw] = useState(true); // true: 외화 → 원화, false: 원화 → 외화
  const [amount, setAmount] = useState("100");

  // manual: 사장님이 직접 새로고침 버튼을 누른 경우 — 결과를 눈에 보이게 알려줘요
  const load = async (manual = false) => {
    setRefreshing(true);
    clearTimeout(msgTimer.current);
    setRefreshMsg(null);
    const started = Date.now();
    const prevUpdated = updatedAt;
    const showMsg = (msg) => {
      setRefreshMsg(msg);
      msgTimer.current = setTimeout(() => setRefreshMsg(null), 3500);
    };
    // 너무 빨리 끝나면 눌렀는지 모르니, 확인 중 표시를 최소 0.7초는 보여줘요
    const minWait = () => new Promise((r) => setTimeout(r, Math.max(0, 700 - (Date.now() - started))));
    try {
      // 휴대폰에 저장된 예전 응답을 쓰지 않고 매번 서버에서 새로 받아요
      const res = await fetch("https://open.er-api.com/v6/latest/KRW", { cache: "no-store" });
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      if (data.result !== "success") throw new Error("api");
      if (manual) await minWait();
      setCheckedAt(Date.now());
      if (manual)
        showMsg(
          prevUpdated && prevUpdated === data.time_last_update_utc
            ? { ok: true, text: "최신 환율이에요 (하루 1번 바뀌어요)" }
            : { ok: true, text: "새 환율로 바꿨어요" }
        );
      setRates(data.rates);
      setUpdatedAt(data.time_last_update_utc);
      setStatus("ready");
      setOffline(false);
      try {
        localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ rates: data.rates, updatedAt: data.time_last_update_utc, savedAt: Date.now() }));
      } catch (e) {
        // 저장 실패해도 화면 표시는 그대로 돼요
      }
    } catch (e) {
      if (manual) {
        await minWait();
        showMsg({ ok: false, text: "환율을 받아오지 못했어요. 인터넷 연결을 확인해 주세요" });
      }
      // 저장된 환율이 있으면 그걸 계속 보여주고, 없을 때만 오류 화면
      if (rates || cached) setOffline(true);
      else setStatus("error");
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => () => clearTimeout(msgTimer.current), []);
  const checkedLabel = checkedAt
    ? (() => {
        const d = new Date(checkedAt);
        const sameDay = new Date().toDateString() === d.toDateString();
        const hm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        return sameDay ? `오늘 ${hm}` : `${d.getMonth() + 1}.${d.getDate()} ${hm}`;
      })()
    : null;

  useEffect(() => {
    if (!cached || Date.now() - (cached.savedAt || 0) > FX_CACHE_TTL) load();
  }, []);

  // rates[code]는 "1원당 외화 몇 개"라서, 역수가 "외화 1단위당 원화"
  const krwPer = (c) => (rates && rates[c] ? 1 / rates[c] : null);

  const updatedLabel = (() => {
    const d = updatedAt ? new Date(updatedAt) : null;
    if (!d || isNaN(d)) return updatedAt || "-";
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  })();

  const selected = FX_CURRENCIES.find((c) => c.code === code);
  const rate = krwPer(code);
  const num = Number(amount) || 0;
  const result = rate ? (toKrw ? num * rate : num / rate) : null;

  const onAmountChange = (e) => {
    let v = e.target.value.replace(/[^0-9.]/g, "");
    const firstDot = v.indexOf(".");
    if (firstDot !== -1) v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "").slice(0, 2);
    if (v.replace(".", "").length > 13) return;
    setAmount(v.replace(/^0+(?=\d)/, ""));
  };

  const selectCurrency = (c) => {
    setCode(c);
    setToKrw(true);
    setAmount(String(FX_CURRENCIES.find((x) => x.code === c).sample));
  };

  const pickCurrency = (c) => {
    selectCurrency(c);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderGroup = (title, list) => (
    <div className="mb-4">
      <p className="text-[12px] font-bold mb-2 px-1" style={{ color: MUTED }}>{title}</p>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BORDER }}>
        {list.map((c, i) => {
          const v = krwPer(c.code);
          const active = c.code === code;
          return (
            <button
              key={c.code}
              onClick={() => pickCurrency(c.code)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none", background: active ? BLUE_SOFT : "white" }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[20px] leading-none">{c.flag}</span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold truncate" style={{ color: TEXT }}>{c.label}</p>
                  <p className="text-[10.5px]" style={{ color: MUTED }}>{c.code}{c.unit > 1 ? ` · ${c.unit}단위` : ""}</p>
                </div>
              </div>
              <p className="text-[15px] font-extrabold tabular-nums shrink-0 ml-2" style={{ color: TEXT }}>
                {v ? `${formatRate(v * c.unit)}원` : "-"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <div className="rounded-2xl border p-3.5 flex items-start gap-2 mb-4" style={{ borderColor: BORDER, background: GREEN_SOFT }}>
        <Info size={14} color={GREEN} className="shrink-0 mt-0.5" />
        <p className="text-[12px]" style={{ color: GREEN }}>
          공개 환율 API로 받아온 참고용 정보예요. 실제 송금·환전 시엔 은행 고시 환율과 차이가 있을 수 있어요.
        </p>
      </div>

      {status === "loading" && (
        <div className="py-16 text-center">
          <p className="text-[13px]" style={{ color: MUTED }}>환율 정보를 불러오는 중이에요...</p>
        </div>
      )}

      {status === "error" && (
        <div className="py-10 text-center">
          <p className="text-[13px] mb-3" style={{ color: MUTED }}>환율 정보를 불러오지 못했어요. 네트워크 상태를 확인하고 다시 시도해주세요.</p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => load(true)}
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold px-3 py-2 rounded-full"
              style={CHIP_ON}
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} /> 다시 시도
            </button>
            <a
              href="https://finance.naver.com/marketindex/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold px-3 py-2 rounded-full"
              style={{ background: BLUE_SOFT, color: BLUE }}
            >
              네이버 환율 <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {status === "ready" && (
        <>
          {/* 환율 계산기 */}
          <div className="rounded-2xl p-4 mb-5" style={{ background: BLUE_SOFT }}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-[13.5px] font-bold shrink-0" style={{ color: TEXT }}>환율 계산기</p>
              <select
                value={code}
                onChange={(e) => selectCurrency(e.target.value)}
                className="min-w-0 text-[12.5px] font-semibold rounded-lg px-2 py-1.5 bg-white border outline-none"
                style={{ borderColor: BORDER, color: TEXT }}
              >
                {FX_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.label} ({c.code})</option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-white px-3.5 py-3 flex items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={withCommas(amount)}
                onChange={onAmountChange}
                placeholder="금액 입력"
                className="flex-1 min-w-0 text-[18px] font-extrabold tabular-nums outline-none bg-transparent"
                style={{ color: TEXT }}
              />
              <span className="text-[13px] font-bold shrink-0" style={{ color: MUTED }}>{toKrw ? selected.code : "원"}</span>
            </div>

            <div className="flex justify-center my-1.5">
              <button
                onClick={() => setToKrw(!toKrw)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white border"
                style={{ borderColor: BORDER }}
                aria-label="계산 방향 바꾸기"
              >
                <ArrowUpDown size={14} color={BLUE} />
              </button>
            </div>

            <div className="rounded-xl bg-white px-3.5 py-3 flex items-center justify-between gap-2">
              <p className="text-[18px] font-extrabold tabular-nums truncate" style={{ color: BLUE }}>
                {result !== null ? (toKrw ? formatKrw(result) : formatFx(result)) : "-"}
              </p>
              <span className="text-[13px] font-bold shrink-0" style={{ color: MUTED }}>{toKrw ? "원" : selected.code}</span>
            </div>
            {rate && (
              <p className="text-[11px] mt-2 text-center" style={{ color: MUTED }}>
                {selected.unit} {selected.code} = {formatRate(rate * selected.unit)}원
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <div className="min-w-0">
              <p className="text-[11px]" style={{ color: offline ? RED : MUTED }}>
                {offline ? "인터넷 연결이 없어 저장된 환율을 보여드려요" : "통화를 누르면 계산기에 바로 넣어드려요"}
              </p>
              {checkedLabel && <p className="text-[10.5px] mt-0.5" style={{ color: "#A3A9B8" }}>마지막 확인 {checkedLabel}</p>}
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11.5px] font-semibold shrink-0 active:scale-95 transition-transform"
              style={{ background: BLUE_SOFT, color: BLUE, opacity: refreshing ? 0.75 : 1 }}
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} /> {refreshing ? "확인 중…" : "새로고침"}
            </button>
          </div>
          {refreshMsg && (
            <div
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 mb-2 text-[12px] font-semibold"
              style={refreshMsg.ok ? { background: GREEN_SOFT, color: GREEN } : { background: RED_SOFT, color: RED }}
              role="status"
            >
              {refreshMsg.ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} {refreshMsg.text}
            </div>
          )}

          {renderGroup("주요 통화", FX_CURRENCIES.filter((c) => c.major))}
          {renderGroup("그 외 통화", FX_CURRENCIES.filter((c) => !c.major))}

          <p className="text-[11px] text-center mt-2" style={{ color: MUTED }}>
            기준시각: {updatedLabel} (하루 1회 갱신) ·{" "}
            <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="underline">
              Rates By Exchange Rate API
            </a>
          </p>
        </>
      )}
    </div>
  );
}

// 금리 정보 — 한국은행 기준금리 및 소상공인 정책자금 금리 (2026년 9월 기준 실제 수치)
const BOK_RATE = { rate: 3.0, date: "2026.08.27", change: "+0.25" };
const BOK_HISTORY = [
  { date: "~26.06", rate: 2.5, note: "유지" },
  { date: "26.07.16", rate: 2.75, note: "3년 9개월 만에 인상" },
  { date: "26.08.27", rate: 3.0, note: "2회 연속 인상" },
];
// 2026년 남은 통화정책방향 결정회의 (한국은행 발표 일정)
const BOK_MEETINGS = ["2026-10-22", "2026-11-26"];
// 은행 공식 로고는 상표라 쓰지 않고, 은행 대표색 배지로 보여줘요
const BANKS = [
  { name: "KB국민", mark: "KB", bg: "linear-gradient(135deg, #FFCD3C, #FFB300)", fg: "#5C4A2E", url: "https://www.kbstar.com" },
  { name: "신한", mark: "신한", bg: "linear-gradient(135deg, #2F6BFF, #0046FF)", fg: "white", url: "https://www.shinhan.com" },
  { name: "하나", mark: "하나", bg: "linear-gradient(135deg, #1AA39A, #00857C)", fg: "white", url: "https://www.kebhana.com" },
  { name: "우리", mark: "우리", bg: "linear-gradient(135deg, #2486D1, #0067AC)", fg: "white", url: "https://www.wooribank.com" },
  { name: "NH농협", mark: "NH", bg: "linear-gradient(135deg, #2BBF6C, #00A651)", fg: "white", url: "https://banking.nonghyup.com" },
  { name: "IBK기업", mark: "IBK", bg: "linear-gradient(135deg, #2F86D6, #0D5FA6)", fg: "white", url: "https://www.ibk.co.kr" },
];

function InterestRateContent({ onOpenCalculator, rateAlertOn, onToggleRateAlert }) {
  const next = BOK_MEETINGS.find((d) => getDday(d) >= 0);
  const nextD = next ? getDday(next) : null;
  const nextDate = next ? parseLocalDate(next) : null;
  const maxRate = 3.5;
  const policyRates = [
    { label: "대표 정책자금", sub: "일반경영안정자금 등", value: "연 2.96%~", tone: BLUE },
    { label: "자금별 금리 범위", sub: "자금 종류에 따라", value: "연 2~4%대", tone: TEXT },
    { label: "비수도권 우대", sub: "수도권 밖 사업장", value: "-0.2%p", tone: GREEN },
    { label: "중·저신용자 자금", sub: "NCB 839점 이하", value: "+1.6%p", tone: RED },
  ];

  return (
    <div>
      {/* 기준금리 */}
      <div className="relative overflow-hidden rounded-[24px] p-5 mb-5" style={{ background: "linear-gradient(135deg, #5B8DF7 0%, #3D63DD 100%)" }}>
        <div className="absolute -right-10 -top-12 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="relative flex items-start justify-between gap-2">
          <div>
            <p className="text-[13px] font-semibold text-white/85">한국은행 기준금리</p>
            <p className="text-[11.5px] text-white/70 mt-0.5">{BOK_RATE.date} 발표</p>
          </div>
          {next && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
              {nextD === 0 ? "오늘 발표일" : `다음 발표 ${nextDate.getMonth() + 1}/${nextDate.getDate()} · D-${nextD}`}
            </span>
          )}
        </div>
        <div className="relative flex items-end gap-2.5 mt-3">
          <p className="font-black text-white leading-none tabular-nums" style={{ fontSize: 56, letterSpacing: "-0.03em" }}>
            {BOK_RATE.rate.toFixed(2)}<span style={{ fontSize: 30 }}>%</span>
          </p>
          <span className="mb-1.5 text-[12px] font-bold px-2 py-0.5 rounded-full bg-white" style={{ color: RED }}>▲ {BOK_RATE.change.slice(1)}%p</span>
        </div>
        <p className="relative text-[12px] text-white/80 mt-3 leading-relaxed break-keep">
          기준금리가 오르면 변동금리 대출 이자도 따라 오를 수 있어요. 정책자금은 상승 폭이 작은 편이에요.
        </p>
      </div>

      {/* 금리 발표일 알림 */}
      {onToggleRateAlert && (
        <div className="rounded-[20px] p-4 mb-5 flex items-center justify-between gap-3" style={CARD}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: BLUE_SOFT }}>
              <Bell size={17} color={BLUE} />
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-bold" style={{ color: TEXT }}>금리 발표일 알림</p>
              <p className="text-[11.5px] leading-snug break-keep" style={{ color: MUTED }}>
                {Capacitor.isNativePlatform()
                  ? next
                    ? nextD === 0 ? "오늘이 발표일이에요 · 결과는 오전 10시쯤 나와요" : `발표일 오전 10~11시 사이에 알려드려요 · 다음 ${nextDate.getMonth() + 1}월 ${nextDate.getDate()}일`
                    : "올해 발표가 모두 끝났어요. 내년 일정이 나오면 알려드려요"
                  : "알림은 안드로이드 앱에서만 받을 수 있어요"}
              </p>
            </div>
          </div>
          <Switch checked={!!rateAlertOn} onChange={onToggleRateAlert} />
        </div>
      )}

      {/* 변동 추이 */}
      <p className="font-bold mb-2.5" style={{ color: TEXT, fontSize: 15 }}>최근 변동 추이</p>
      <div className="rounded-[20px] p-4 mb-5" style={CARD}>
        <div className="flex items-end justify-around gap-3 h-[150px]">
          {BOK_HISTORY.map((h, i) => {
            const last = i === BOK_HISTORY.length - 1;
            return (
              <div key={h.date} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[14px] font-extrabold tabular-nums mb-1.5" style={{ color: last ? BLUE : TEXT }}>{h.rate.toFixed(2)}%</span>
                <div
                  className="w-full max-w-[56px] rounded-t-xl"
                  style={{ height: `${(h.rate / maxRate) * 100}px`, background: last ? "linear-gradient(180deg, #5B8DF7, #3D63DD)" : i === 0 ? "#E3E7F0" : "#B9C9F5" }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-around gap-3 mt-2 pt-2" style={{ borderTop: "1px solid #F1F2F6" }}>
          {BOK_HISTORY.map((h, i) => (
            <div key={h.date} className="flex-1 text-center">
              <p className="text-[11.5px] font-semibold tabular-nums" style={{ color: TEXT }}>{h.date}</p>
              <p className="text-[10.5px] mt-0.5 break-keep leading-snug" style={{ color: i === 0 ? MUTED : RED }}>{h.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 정책자금 금리 */}
      <p className="font-bold mb-2.5" style={{ color: TEXT, fontSize: 15 }}>소상공인 정책자금 금리</p>
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {policyRates.map((r) => (
          <div key={r.label} className="rounded-[18px] p-3.5" style={CARD}>
            <p className="text-[12.5px] font-bold" style={{ color: TEXT }}>{r.label}</p>
            <p className="text-[10.5px] mt-0.5" style={{ color: MUTED }}>{r.sub}</p>
            <p className="text-[19px] font-extrabold tabular-nums mt-2" style={{ color: r.tone }}>{r.value}</p>
          </div>
        ))}
      </div>

      {/* 은행별 비교 */}
      <p className="font-bold mb-2.5" style={{ color: TEXT, fontSize: 15 }}>은행별 대출금리 비교</p>
      <div className="rounded-[20px] p-4 mb-5" style={CARD}>
        <a
          href="https://portal.kfb.or.kr/compare/loan_snmindustry.php"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-2xl text-center text-[13px] font-bold flex items-center justify-center gap-1.5 mb-3"
          style={BTN_PRIMARY}
        >
          은행연합회에서 개인사업자 대출금리 비교 <ExternalLink size={13} />
        </a>
        <p className="text-[11.5px] leading-relaxed mb-3.5 break-keep" style={{ color: MUTED }}>
          은행연합회가 매달 공시하는 공식 자료라 가장 정확해요. 아래 은행을 누르면 각 은행 홈페이지로 이동해요.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {BANKS.map((b) => (
            <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-xl active:scale-[0.97] transition-transform" style={{ background: "#F7F8FB" }}>
              <span
                className="w-8 h-8 rounded-[10px] flex items-center justify-center font-black shrink-0"
                style={{ background: b.bg, color: b.fg, fontSize: b.mark.length > 2 ? 9.5 : 11, letterSpacing: "-0.03em", boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.08)" }}
              >
                {b.mark}
              </span>
              <span className="text-[11.5px] font-semibold truncate" style={{ color: TEXT }}>{b.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 정책자금이 유리한 이유 */}
      <p className="font-bold mb-2.5" style={{ color: TEXT, fontSize: 15 }}>정책자금이 시중은행보다 유리한 이유</p>
      <div className="rounded-[20px] p-4 mb-5 space-y-2.5" style={{ background: GREEN_SOFT }}>
        {[
          "정책자금 금리는 한국은행 기준금리와 따로 정해져서, 기준금리가 올라도 시중은행보다 덜 올라요.",
          "신용점수가 낮아 은행에서 거절되기 쉬운 사장님도 가산금리만 붙이면 신청할 수 있어 문턱이 낮아요.",
          "수도권 밖 사업장은 우대금리(-0.2%p)를 더 받아요.",
        ].map((t, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 size={15} color={GREEN} className="shrink-0 mt-0.5" />
            <p className="text-[12.5px] leading-relaxed break-keep" style={{ color: TEXT }}>{t}</p>
          </div>
        ))}
      </div>

      {onOpenCalculator && (
        <button onClick={onOpenCalculator} className="w-full py-3.5 rounded-2xl mb-5 flex items-center justify-center gap-2 font-bold" style={{ background: BLUE_SOFT, color: BLUE, fontSize: 13.5 }}>
          <Calculator size={15} /> 지금 금리로 내 대출이자 계산해보기 <ChevronRight size={15} />
        </button>
      )}

      <p className="text-[11px] leading-relaxed" style={{ color: MUTED }}>
        * 남은 금리 결정회의: 2026년 10월 22일, 11월 26일. 정책자금 금리는 분기마다 바뀔 수 있으니 신청 전 소상공인정책자금 누리집에서 최신 공고를 확인하세요. 출처: 한국은행, 소상공인시장진흥공단 (2026.09 기준)
      </p>
    </div>
  );
}

function RateAndExchangeScreen({ onBack, onOpenCalculator, rateAlertOn, onToggleRateAlert }) {
  const [tab, setTab] = useState("rate");
  return (
    <div>
      <HeroHeader icon={Landmark} color={BLUE} title="금리·환율 정보" subtitle="기준금리·정책자금 금리와 환율을 한눈에 확인해요" onBack={onBack} />
      <CalcModeSwitch value={tab} onChange={setTab} options={[{ key: "rate", label: "금리 정보" }, { key: "exchange", label: "환율 정보" }]} />
      {tab === "rate" ? <InterestRateContent onOpenCalculator={onOpenCalculator} rateAlertOn={rateAlertOn} onToggleRateAlert={onToggleRateAlert} /> : <ExchangeRateContent />}
    </div>
  );
}

// 소상공인시장진흥공단 지역본부 실제 주소·연락처
// 2026년 2분기 조직개편으로 8개 → 12개 지역본부로 재편됨 (예: 서울/강원, 부산울산/경남, 인천/경기북부 분리)
// 본부 아래 구·시·군 단위 하위센터까지 전 지역 실제 데이터로 반영 완료 (2026.09.13 전북 확인으로 마무리)
const REGIONAL_CENTERS = [
  { name: "서울지역본부", isHQ: true, covers: ["서울"], address: "서울특별시 마포구 독막로 320 태영데시앙루브 7층", phone: "02-730-9361", lat: 37.5431, lng: 126.9476 },
  { name: "(서울)서울중부센터", covers: ["서울"], districts: ["중구", "종로구", "서대문구", "은평구"], address: "서울 종로구 삼봉로 95 대성스카이렉스 102동 2층", phone: "02-720-4711", lat: 37.5723, lng: 126.9825 },
  { name: "(서울)서울동부센터", covers: ["서울"], districts: ["광진구", "성동구", "강동구", "동대문구"], address: "서울 광진구 자양로 142 청양빌딩 4층", phone: "02-2215-0981", lat: 37.5402, lng: 127.0835 },
  { name: "(서울)서울서부센터", covers: ["서울"], districts: ["강서구", "양천구", "영등포구"], address: "서울 영등포구 영등포로 33 목동비즈타워 604호", phone: "02-839-8311", lat: 37.5232, lng: 126.8852 },
  { name: "(서울)서울남부센터", covers: ["서울"], districts: ["강남구", "서초구", "송파구"], address: "서울 서초구 방배로 114, 다이치빌딩 3층", phone: "02-585-8622", lat: 37.4843, lng: 126.9960 },
  { name: "(서울)서울북부센터", covers: ["서울"], districts: ["강북구", "성북구", "노원구", "도봉구", "중랑구"], address: "서울 강북구 도봉로 186 제이슨빌딩 5층", phone: "02-990-9101" },
  { name: "(서울)관악센터", covers: ["서울"], districts: ["관악구", "구로구", "금천구"], address: "서울 관악구 신원로 35 삼모더프라임타워 8층", phone: "02-889-9262", lat: 37.4822, lng: 126.9290 },
  { name: "(서울)동작센터", covers: ["서울"], districts: ["동작구", "용산구", "마포구"], address: "서울 동작구 동작대로 109 406호", phone: "02-3482-6686", lat: 37.4862, lng: 126.9815 },
  { name: "강원지역본부", isHQ: true, covers: ["강원"], address: "강원특별자치도 춘천시 안마산로 262 강원지방중소벤처기업청 1층", phone: "033-243-1950" },
  { name: "(강원)춘천센터", covers: ["강원"], districts: ["춘천시", "홍천군", "양구군", "화천군", "철원군"], address: "강원특별자치도 춘천시 안마산로 262 강원지방중소벤처기업청 1층", phone: "033-243-1950" },
  { name: "(강원)원주센터", covers: ["강원"], districts: ["원주시", "횡성군", "영월군"], address: "강원특별자치도 원주시 호저로 47 강원특별자치도경제진흥원 3층 306호", phone: "033-746-1950", lat: 37.3806, lng: 127.9413 },
  { name: "(강원)삼척센터", covers: ["강원"], districts: ["삼척시", "동해시", "태백시", "정선군"], address: "강원특별자치도 삼척시 중앙로 296 삼척시청 별관 1층", phone: "033-575-1950", lat: 37.4499, lng: 129.1652 },
  { name: "(강원)속초센터", covers: ["강원"], districts: ["속초시", "양양군", "고성군", "인제군"], address: "강원특별자치도 속초시 중앙동 중앙로 183 속초시청 해양수산과동 2층", phone: "033-638-1950", lat: 38.2073, lng: 128.5919 },
  { name: "(강원)강릉센터", covers: ["강원"], districts: ["강릉시", "평창군"], address: "강원특별자치도 강릉시 종합운동장길 88 대한상공회의소 3층", phone: "033-645-1950", lat: 37.7711, lng: 128.8965 },
  { name: "경기남부지역본부", isHQ: true, covers: ["경기남부"], address: "경기도 수원시 영통구 반달로 87 경기지방중소벤처기업청 4층", phone: "031-204-3012", lat: 37.2513, lng: 127.0780 },
  { name: "(경기)수원센터", covers: ["경기남부"], districts: ["수원시"], address: "경기도 수원시 영통구 반달로 87 경기지방중소기업청 1층", phone: "031-244-5161", lat: 37.2513, lng: 127.0780 },
  { name: "(경기)평택센터", covers: ["경기남부"], districts: ["평택시"], address: "경기도 평택시 중앙로 31 우리은행 평택금융센터 2층", phone: "031-666-0260" },
  { name: "(경기)화성센터", covers: ["경기남부"], districts: ["화성시", "오산시"], address: "경기도 화성시 병점1로 218 씨네샤르망 B동 303호", phone: "031-8015-5301" },
  { name: "(경기)성남센터", covers: ["경기남부"], districts: ["성남시"], address: "경기도 성남시 분당구 황새울로 346 우리은행 분당중앙금융센터 4층", phone: "031-705-7341", lat: 37.3861, lng: 127.1232 },
  { name: "(경기)안양센터", covers: ["경기남부"], districts: ["안양시", "군포시", "의왕시", "과천시"], address: "경기도 안양시 동안구 시민대로 278 신한은행 평촌금융센터 3층", phone: "031-383-1002", lat: 37.3943, lng: 126.9613 },
  { name: "(경기)안산센터", covers: ["경기남부"], districts: ["안산시"], address: "경기도 안산시 단원구 중앙대로 815 안산우체국 1층", phone: "031-482-2590" },
  { name: "(경기)하남센터", covers: ["경기남부"], districts: ["하남시", "광주시", "양평군"], address: "경기도 하남시 미사강변대로 52 미사강변블루 6층 606호", phone: "031-794-4383", lat: 37.5547, lng: 127.1865 },
  { name: "(경기)용인센터", covers: ["경기남부"], districts: ["용인시"], address: "경기도 용인시 처인구 금령로 116 용인타워 303호", phone: "031-337-1830" },
  { name: "(경기)안성센터", covers: ["경기남부"], districts: ["안성시"], address: "경기도 안성시 중앙로 327 한경대학교 산학협력관 201~203호", phone: "031-677-6199", lat: 37.0117, lng: 127.2634 },
  { name: "경기북부지역본부", isHQ: true, covers: ["경기북부"], address: "경기 의정부시 행복로 39 KB국민은행 의정부중앙종합금융센터 4층", phone: "031-876-4384", lat: 37.7414, lng: 127.0497 },
  { name: "(경기)광명센터", covers: ["경기북부"], districts: ["광명시"], address: "경기도 광명시 범안로 1035 송화빌딩 6층 601호", phone: "02-2066-6348", lat: 37.4619, lng: 126.8779 },
  { name: "(경기)의정부센터", covers: ["경기북부"], districts: ["의정부시", "동두천시", "포천시", "양주시", "연천군"], address: "경기 의정부시 행복로 39 KB국민은행 의정부중앙종합금융센터 4층", phone: "031-876-4384", lat: 37.7414, lng: 127.0497 },
  { name: "(경기)부천센터", covers: ["경기북부"], districts: ["부천시"], address: "경기도 부천시 길주로 433 네스필러타워 2층", phone: "032-655-0381" },
  { name: "(경기)고양센터", covers: ["경기북부"], districts: ["고양시", "파주시"], address: "경기도 고양시 일산동구 장백로 204 보림빌딩 604호", phone: "031-925-4266", lat: 37.6529, lng: 126.7762 },
  { name: "(경기)구리센터", covers: ["경기북부"], districts: ["구리시", "남양주시", "가평군"], address: "경기도 구리시 건원대로 44 태영빌딩 502호", phone: "031-554-5361", lat: 37.6050, lng: 127.1404 },
  { name: "(경기)김포센터", covers: ["경기북부"], districts: ["김포시"], address: "경기도 김포시 돌문로 49 원정빌딩 4층", phone: "031-997-4302", lat: 37.6192, lng: 126.7174 },
  { name: "(경기)시흥센터", covers: ["경기북부"], districts: ["시흥시"], address: "경기도 시흥시 은계로 347 다온프라자 403호", phone: "031-311-2689" },
  { name: "인천지역본부", isHQ: true, covers: ["인천"], address: "인천광역시 남동구 남동대로 215번길 30 인천종합비즈니스센터 713호", phone: "032-822-2619", fax: "032-822-2620", lat: 37.4055, lng: 126.6944 },
  { name: "(인천)인천남부센터", covers: ["인천"], districts: ["연수구", "미추홀구", "남동구", "중구", "동구", "옹진군"], address: "인천광역시 미추홀구 인주대로 416 삼원빌딩 2층", phone: "032-437-3570", fax: "032-437-3574" },
  { name: "(인천)인천북부센터", covers: ["인천"], districts: ["부평구", "계양구", "서구", "강화군"], address: "인천광역시 부평구 부흥로 337 신한은행 5층", phone: "032-514-4010", fax: "032-514-4014", lat: 37.4984, lng: 126.7295 },
  { name: "대전세종충남지역본부", isHQ: true, covers: ["대전", "세종", "충남"], address: "대전광역시 중구 계룡로 800 동아생명빌딩 9층", phone: "042-864-1609", lat: 36.3303, lng: 127.4031 },
  { name: "(대전)대전북부센터", covers: ["대전"], districts: ["유성구", "서구", "대덕구"], address: "대전광역시 유성구 가정북로 96, 102호", phone: "042-864-1602", fax: "042-864-1606", lat: 36.3925, lng: 127.3603 },
  { name: "(대전)대전남부센터", covers: ["대전"], districts: ["중구", "동구"], address: "대전광역시 중구 계룡로 800 동아생명빌딩 1층", phone: "042-223-5301", fax: "042-223-0665", lat: 36.3303, lng: 127.4031 },
  { name: "(세종)세종센터", covers: ["세종"], districts: ["세종시"], address: "세종특별자치시 한누리대로 2150 스마트허브1 3층 303호", phone: "044-868-4524", fax: "044-868-4527", lat: 36.4785, lng: 127.2873 },
  { name: "(충남)천안센터", covers: ["충남"], districts: ["천안시"], address: "충청남도 천안시 서북구 광장로 215 충남경제종합지원센터 8층", phone: "041-567-5302", fax: "041-567-5308", lat: 36.7980, lng: 127.1085 },
  { name: "(충남)공주센터", covers: ["충남"], districts: ["공주시", "보령시", "청양군"], address: "충청남도 공주시 무령로 204 금성빌딩 3층", phone: "041-852-1183", fax: "041-852-1186" },
  { name: "(충남)논산센터", covers: ["충남"], districts: ["논산시", "계룡시", "금산군"], address: "충청남도 논산시 중앙로 464 논산타워 2층", phone: "041-733-5064", fax: "041-733-5067" },
  { name: "(충남)서산센터", covers: ["충남"], districts: ["서산시", "당진시", "태안군"], address: "충청남도 서산시 고운로 177 서산시2청사 2동 2층", phone: "041-663-4981", fax: "041-663-4980", lat: 36.7839, lng: 126.4548 },
  { name: "(충남)아산센터", covers: ["충남"], districts: ["아산시", "예산군"], address: "충청남도 아산시 배방읍 배방로 22 삼영프라자 202호", phone: "041-549-5392", fax: "041-549-5399" },
  { name: "(충남)보령센터", covers: ["충남"], districts: ["보령시", "부여군", "서천군"], address: "충청남도 보령시 흥덕로 22 2층", phone: "041-931-4443", lat: 36.3402, lng: 126.6032 },
  { name: "충북지역본부", isHQ: true, covers: ["충북"], address: "충청북도 청주시 청원구 오창읍 중심상업2로 48 충북지방중소벤처기업청 1층", phone: "043-234-1095", fax: "043-234-1091" },
  { name: "(충북)청주센터", covers: ["충북"], districts: ["청주시", "보은군"], address: "충청북도 청주시 청원구 오창읍 중심상업2로 48 충북지방중소벤처기업청 1층", phone: "043-234-1095", fax: "043-234-1091" },
  { name: "(충북)충주센터", covers: ["충북"], districts: ["충주시"], address: "충청북도 충주시 으뜸로 21 충주시청 11층", phone: "043-854-3616", fax: "043-854-3619", lat: 36.9910, lng: 127.9260 },
  { name: "(충북)제천센터", covers: ["충북"], districts: ["제천시", "단양군"], address: "충청북도 제천시 풍양로 65 KT 제천빌딩 2층", phone: "043-652-1781", fax: "043-652-1784" },
  { name: "(충북)음성센터", covers: ["충북"], districts: ["음성군", "괴산군", "증평군", "진천군"], address: "충청북도 음성군 맹동면 대하2가길 3 미르타워 3층", phone: "043-873-1811", fax: "043-873-1814" },
  { name: "(충북)옥천센터", covers: ["충북"], districts: ["옥천군", "영동군"], address: "충청북도 옥천군 옥천읍 동부로 15 옥천읍사무소 3층", phone: "043-731-0924", fax: "043-731-0926", lat: 36.3073, lng: 127.5749 },
  { name: "부산울산지역본부", isHQ: true, covers: ["부산", "울산"], address: "부산광역시 중구 중앙대로 63 부산우체국 12층", phone: "051-469-4680", lat: 35.1031, lng: 129.0361 },
  { name: "(부산)부산중부센터", covers: ["부산"], districts: ["중구", "영도구", "서구", "사하구", "동구"], address: "부산 중구 중앙대로 63 부산우체국 12층", phone: "051-469-1644", lat: 35.1031, lng: 129.0361 },
  { name: "(부산)부산북부센터", covers: ["부산"], districts: ["북구", "사상구", "강서구"], address: "부산 북구 기찰로12 이수타워 9층", phone: "051-341-8052" },
  { name: "(부산)부산남부센터", covers: ["부산"], districts: ["부산진구", "연제구", "동래구", "금정구"], address: "부산 연제구 중앙대로 1090 프라임시티 6층", phone: "051-633-6562", lat: 35.1847, lng: 129.0810 },
  { name: "(부산)부산동부센터", covers: ["부산"], districts: ["남구", "수영구", "해운대구", "기장군"], address: "부산 수영구 과정로 46 SMC빌딩 6층", phone: "051-761-2561" },
  { name: "(울산)울산남부센터", covers: ["울산"], districts: ["남구", "울주군"], address: "울산 남구 돋질로 97 울산상공회의소 5층", phone: "052-260-6388", lat: 35.5395, lng: 129.3165 },
  { name: "(울산)울산북부센터", covers: ["울산"], districts: ["중구", "북구", "동구"], address: "울산 중구 새즈믄해거리 28 2층", phone: "052-243-7489" },
  { name: "경남지역본부", isHQ: true, covers: ["경남"], address: "경상남도 창원시 성산구 상남로 60 오션타워 5층(502,503호)", phone: "055-275-3261", fax: "055-275-3264" },
  { name: "(경남)창원센터", covers: ["경남"], districts: ["창원시(구 마산시)", "진해시", "창녕군", "함안군"], address: "경상남도 창원시 성산구 상남로 60 오션타워 5층(502,503호)", phone: "055-275-3261", fax: "055-275-3264" },
  { name: "(경남)진주센터", covers: ["경남"], districts: ["진주시", "사천시", "산청군", "의령군", "남해군", "하동군", "거창군", "함양군", "합천군"], address: "경상남도 진주시 충의로 26 경남은행 영업본부 3층", phone: "055-758-6701", fax: "055-758-7102", lat: 35.1765, lng: 128.1481 },
  { name: "(경남)김해센터", covers: ["경남"], districts: ["김해시"], address: "경상남도 김해시 호계로422번길 24 김해상공회의소 1층", phone: "055-323-4960", fax: "055-323-4963" },
  { name: "(경남)통영센터", covers: ["경남"], districts: ["통영시", "거제시", "고성군"], address: "경상남도 통영시 광도면 죽림1로 73 농협은행(한려지점) 3층", phone: "055-648-2107", fax: "055-648-2109" },
  { name: "(경남)양산센터", covers: ["경남"], districts: ["양산시", "밀양시"], address: "경상남도 양산시 중앙로 33-2 양산비즈니스센터 4층", phone: "055-367-7112", fax: "055-367-7116", lat: 35.3341, lng: 129.0378 },
  { name: "대구경북지역본부", isHQ: true, covers: ["대구", "경북"], address: "대구광역시 중구 국채보상로102길 2 우리은행(동산동지점) 3층", phone: "053-629-4633", lat: 35.8690, lng: 128.5860 },
  { name: "(대구)대구남부센터", covers: ["대구"], districts: ["서구", "중구", "남구", "수성구"], address: "대구 중구 국채보상로 102길 2 우리은행(동산동지점) 3층", phone: "1533-0100", lat: 35.8690, lng: 128.5860 },
  { name: "(대구)대구북부센터", covers: ["대구"], districts: ["북구", "동구", "군위군"], address: "대구 북구 옥산로 17길 14 리치프라자 2층", phone: "1533-0100", lat: 35.8858, lng: 128.5861 },
  { name: "(대구)대구서부센터", covers: ["대구"], districts: ["달서구", "달성군"], address: "대구 달서구 월배로 15길 8 595b 4층", phone: "1533-0100" },
  { name: "(경북)안동센터", covers: ["경북"], districts: ["안동시", "상주시", "의성군", "청송군", "영양군"], address: "경북 안동시 경동로 661 백암빌딩 6층", phone: "1533-0100" },
  { name: "(경북)구미센터", covers: ["경북"], districts: ["구미시", "김천시", "성주군", "칠곡군", "고령군"], address: "경북 구미시 구미대로 350-27 구미시종합비즈니스지원센터 4층 408호", phone: "1533-0100" },
  { name: "(경북)포항센터", covers: ["경북"], districts: ["포항시", "영덕군", "울진군", "울릉군"], address: "경북 포항시 북구 포스코대로 299 신한은행 4층", phone: "1533-0100" },
  { name: "(경북)경주센터", covers: ["경북"], districts: ["경주시", "경산시", "영천시", "청도군"], address: "경북 경주시 중앙로 67-2 경주상공회의소 2층", phone: "1533-0100" },
  { name: "(경북)영주센터", covers: ["경북"], districts: ["영주시", "문경시", "봉화군", "예천군"], address: "경북 영주시 선비로 182 영주상공회의소 1층", phone: "1533-0100" },
  { name: "광주전남제주지역본부", isHQ: true, covers: ["광주", "전남", "제주"], address: "광주광역시 서구 천변좌로 268 KDB생명빌딩 21층", phone: "062-369-8754", lat: 35.1524, lng: 126.9046 },
  { name: "(광주)광주남부센터", covers: ["광주"], districts: ["서구", "남구"], address: "광주 서구 천변좌로 268 KDB생명빌딩 21층", phone: "1533-0100", lat: 35.1524, lng: 126.9046 },
  { name: "(광주)광주북부센터", covers: ["광주"], districts: ["동구", "북구"], address: "광주 북구 동문대로 193 동광주빌딩 2층", phone: "1533-0100", lat: 35.1798, lng: 126.9295 },
  { name: "(광주)광주서부센터", covers: ["광주"], districts: ["광산구"], address: "광주 광산구 하남산단8번로 177 광주경제고용진흥원 7층", phone: "1533-0100" },
  { name: "(전남)목포센터", covers: ["전남"], districts: ["목포시", "무안군", "해남군", "강진군", "영암군", "장흥군", "신안군", "완도군", "진도군"], address: "전남 무안군 삼향읍 오룡3길 2 전남중소기업일자리경제진흥원 5층", phone: "1533-0100" },
  { name: "(전남)순천센터", covers: ["전남"], districts: ["순천시", "광양시", "구례군", "보성군", "고흥군", "곡성군"], address: "전남 순천시 해룡면 향매로109 5층", phone: "1533-0100" },
  { name: "(전남)여수센터", covers: ["전남"], districts: ["여수시"], address: "전남 여수시 좌수영로 962-12 여수상공회의소 3층", phone: "1533-0100", lat: 34.7838, lng: 127.6658 },
  { name: "(전남)나주센터", covers: ["전남"], districts: ["나주시", "화순군", "함평군", "영광군", "장성군", "담양군"], address: "전남 나주시 빛가람로 685 비전타워 306호", phone: "1533-0100", lat: 35.0215, lng: 126.7866 },
  { name: "전북지역본부", isHQ: true, covers: ["전북"], address: "전북특별자치도 전주시 완산구 홍산로 276 전주상공회의소 6층", phone: "063-231-8110", fax: "063-231-8112" },
  { name: "(전북)전주센터", covers: ["전북"], districts: ["전주시", "완주군", "진안군", "무주군"], address: "전북특별자치도 전주시 완산구 홍산로 276 전주상공회의소 6층", phone: "063-231-8110", fax: "063-231-8112" },
  { name: "(전북)익산센터", covers: ["전북"], districts: ["익산시"], address: "전북특별자치도 익산시 인북로 187 상공회의소 3층", phone: "063-853-4411", fax: "063-853-4413" },
  { name: "(전북)정읍센터", covers: ["전북"], districts: ["정읍시", "김제시", "고창군", "부안군"], address: "전북특별자치도 정읍시 중앙로 72 기업은행 3층", phone: "063-533-1781", fax: "063-533-1783" },
  { name: "(전북)남원센터", covers: ["전북"], districts: ["남원시", "장수군", "임실군", "순창군"], address: "전북특별자치도 남원시 향단로 83 KT남원빌딩 1층", phone: "063-626-0371", fax: "063-626-0372" },
  { name: "(전북)군산센터", covers: ["전북"], districts: ["군산시"], address: "전북특별자치도 군산시 대학로 600 전북특별자치도사회적경제혁신타운 연구숙박동 3층", phone: "063-445-6317", fax: "063-446-0199" },
  { name: "제주센터", covers: ["제주"], address: "제주특별자치도 제주시 연삼로 473 제주도경제통상진흥원 4층", phone: "064-751-2101", lat: 33.4991, lng: 126.5403 },
  { name: "(제주)서귀포센터", covers: ["제주"], districts: ["서귀포시"], address: "제주 서귀포시 신중로 50, 1층 (KT신서귀포빌딩)", phone: "064-739-9215", lat: 33.2544, lng: 126.5106 },
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

// 지역센터 미니맵 미리보기 — 오픈스트리트맵 embed(API 키 불필요)로 위치만 보여주고,
// 지도 안에서 +/- 확대·축소만 가능해요. 네이버 지도로 이동은 아래 "네이버 지도에서 보기" 버튼 하나로 통일했어요
// OSM 기본 하단 문구(문제점 보고·기부하기 등 2줄)는 iframe을 아래로 늘려 잘라내고, 라이선스상 필수인 저작권 표기만 작게 남겨요
// 클립보드 복사: 최신 API가 막히면 예전 방식으로 한 번 더 시도하고, 성공 여부를 돌려줘요
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

const MAP_HEIGHT = 140;
const MAP_CROP = 44; // 잘라낼 OSM 하단 문구 높이(px)
function CenterMapPreview({ center }) {
  if (typeof center.lat !== "number" || typeof center.lng !== "number") return null;
  const pad = 0.01;
  const latSpan = pad * 0.8;
  // iframe이 아래로 늘어난 만큼 지도 중심을 내려서, 마커가 보이는 영역 가운데 오도록 보정
  const latShift = (latSpan * 2 * (MAP_CROP / 2)) / (MAP_HEIGHT + MAP_CROP);
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - pad}%2C${center.lat - latSpan - latShift}%2C${center.lng + pad}%2C${center.lat + latSpan - latShift}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;

  return (
    <div
      className="relative rounded-lg overflow-hidden mb-3"
      style={{ height: MAP_HEIGHT, border: `1px solid ${BORDER}`, background: "#EAEBF1" }}
    >
      <iframe
        title={`${center.name} 위치 미리보기`}
        src={embedUrl}
        className="w-full"
        style={{ border: 0, height: MAP_HEIGHT + MAP_CROP }}
      />
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 px-1.5 py-0.5 text-[9.5px] rounded-tl-md"
        style={{ background: "rgba(255,255,255,0.8)", color: MUTED }}
      >
        © OpenStreetMap
      </a>
    </div>
  );
}
// 자주 묻는 질문 (지원금 기본 상식 + 세금 + 앱 사용법)
// top: true 는 "많이 묻는 질문"으로 맨 위에 보여줘요
const FAQ_DATA = [
  { category: "지원금 기본", top: true, q: "저도 '소상공인'에 해당하나요?", a: "상시근로자(사장님 제외) 수로 판단해요. 음식점·도소매·서비스업 등은 5명 미만, 제조·건설·운수·광업은 10명 미만이면 소상공인이에요. 여기에 업종별 매출 기준(소기업 기준) 이하여야 해요. 정확한 확인은 '중소기업현황정보시스템(sminfo.mss.go.kr)'에서 소상공인 확인서를 발급받아 보시면 돼요." },
  { category: "지원금 기본", top: true, q: "지원금과 정책자금(대출)은 뭐가 달라요?", a: "지원금·바우처는 갚지 않아도 되는 돈이에요. 정책자금은 시중은행보다 낮은 금리로 빌려주는 '대출'이라 나중에 갚아야 해요. 앱에서 '경영·보증·신용' 분야는 대부분 대출이고, '고정비·에너지·고용' 분야는 대부분 갚지 않는 지원이에요." },
  { category: "지원금 기본", top: true, q: "사업자등록 전(예비 창업)에도 받을 수 있나요?", a: "대부분의 소상공인 지원금은 사업자등록 후 운영 중인 분이 대상이에요. 창업 준비 단계라면 'K-스타트업(k-startup.go.kr)'의 예비창업 지원사업을 찾아보세요. 폐업 후 재창업을 준비 중이라면 재기 분야 지원금을 확인해 보세요." },
  { category: "지원금 기본", q: "지원금 여러 개를 동시에 받을 수 있나요?", a: "지원사업마다 달라요. 같은 목적(예: 같은 기간의 인건비)으로 중복 지원은 대부분 막혀 있지만, 목적이 다르면 함께 받을 수 있는 경우가 많아요. 신청 전 공고문의 '중복 지원 제한' 항목을 꼭 확인하세요." },
  { category: "지원금 기본", q: "세금을 밀린 게 있으면 못 받나요?", a: "국세·지방세 체납이 있으면 대부분의 지원금과 정책자금에서 제외돼요. 신청 전에 홈택스와 위택스에서 체납 여부를 확인하고, 있다면 먼저 납부하거나 분납 승인을 받아두세요." },
  { category: "신청 방법", top: true, q: "신청은 앱에서 바로 되나요?", a: "아니요. 이 앱은 정보를 모아서 보여주는 역할이에요. 실제 신청은 각 지원금의 '신청하러 가기' 버튼을 눌러 이동한 공식 사이트(소상공인24, 신용보증재단 등)에서 진행해요." },
  { category: "신청 방법", q: "신청할 때 어떤 서류가 필요해요?", a: "지원금마다 다르지만 사업자등록증명, 부가세 과세표준증명, 국세·지방세 완납증명서, 통장사본이 자주 쓰여요. 홈 화면의 '서류·양식 자료실'에서 체크리스트로 미리 챙겨두세요. 요즘은 국세청 자료를 자동으로 확인해서 서류 없이 신청되는 경우도 많아요." },
  { category: "신청 방법", q: "온라인 신청이 어려워요. 직접 방문해도 되나요?", a: "네. 가까운 소상공인시장진흥공단 지역센터를 방문하면 신청을 도와드려요. 홈 화면의 '지역센터 찾기'에서 주소와 전화번호를 확인할 수 있어요. 일부 지자체 지원금은 시·군·구청이나 신용보증재단 지점에서 접수해요." },
  { category: "신청 방법", q: "예산 소진 시 마감이라는 게 무슨 뜻이에요?", a: "정해진 예산이 다 쓰이면 마감일 전이라도 접수가 끝난다는 뜻이에요. 선착순인 경우가 많으니, 관심 있는 지원금은 공고가 나오면 빨리 신청하는 게 좋아요." },
  { category: "신청 방법", q: "신청했는데 떨어졌어요. 다시 신청할 수 있나요?", a: "탈락 사유(서류 미비, 요건 미충족, 예산 소진 등)에 따라 달라요. 서류 문제라면 보완 후 다음 회차에 다시 신청할 수 있는 경우가 많아요. 운영 기관 콜센터에 탈락 사유를 문의해 보세요." },
  { category: "세금", q: "간이과세자와 일반과세자는 뭐가 달라요?", a: "연 매출 1억 400만원 미만이면 간이과세자가 될 수 있고, 부가세를 1년에 한 번(1월) 신고해요. 일반과세자는 1월·7월 두 번 확정신고해요. 홈의 '사장님 일정'에서 날짜를 확인할 수 있어요." },
  { category: "세금", q: "세금 신고 날짜를 놓치면 어떻게 돼요?", a: "가산세가 붙어요. 늦었더라도 빨리 신고할수록 가산세가 줄어드니 바로 홈택스에서 '기한 후 신고'를 하세요. 국세청 상담센터(국번 없이 126)에서 도움을 받을 수 있어요." },
  { category: "앱 이용", q: "지원금 정보는 얼마나 자주 바뀌어요?", a: "공식 공고를 확인해서 주기적으로 업데이트해요. 지원사업은 예산 상황에 따라 자주 바뀌니, 신청 전에는 반드시 공식 사이트에서 최종 확인하세요. 접수가 끝난 지원금은 '접수마감' 탭에 따로 모아둬요." },
  { category: "앱 이용", q: "내 지역은 어떻게 바꾸나요?", a: "MY 탭 > '내 지역'을 누르면 시·도와 시·군·구를 고를 수 있어요. 한 번 정하면 지원금 목록이 내 지역 기준으로 열리고, 전국 지원금도 함께 보여요." },
  { category: "앱 이용", q: "어떤 알림을 받을 수 있나요?", a: "MY 탭 > 알림 설정에서 ① 지원금 마감 알림(즐겨찾기에서 🔔 켠 지원금) ② 세금 신고·납부일 알림 ③ 금리 발표일 알림을 켤 수 있어요. 마감 며칠 전부터 알릴지(가볍게·적당히·7일 전부터 매일)와 알림 시각도 고를 수 있어요. 상시접수 지원금은 마감일이 없어서 알림 대상이 아니에요." },
  { category: "앱 이용", q: "즐겨찾기는 어디에 저장되나요?", a: "이 휴대폰에만 저장돼요. 앱을 지우거나 휴대폰을 바꾸면 사라지니, 중요한 지원금은 '공유하기'로 나에게 보내두시면 안전해요." },
  { category: "앱 이용", q: "다른 사장님께 지원금을 알려주고 싶어요", a: "지원금 상세 화면에서 '다른 사장님께 공유하기'를 누르면 카카오톡·문자 등으로 지원금 정보를 보낼 수 있어요." },
  { category: "앱 이용", q: "회원가입이나 개인정보가 필요한가요?", a: "아니요. 로그인 없이 바로 쓸 수 있고, 개인을 알아볼 수 있는 정보는 수집하지 않아요. 자세한 내용은 MY 탭의 개인정보처리방침에서 확인할 수 있어요." },
  { category: "앱 이용", q: "맞춤 진단은 얼마나 정확한가요?", a: "지역·업종·직원 수·필요한 지원을 바탕으로 받을 수 있는 지원금을 골라드리지만, 신용점수·고용 기간 같은 세부 조건까지는 알 수 없어요. 참고용으로 보시고 최종 확인은 상세 화면과 공식 공고에서 하세요. MY 탭에서 언제든 다시 진단할 수 있어요." },
];

// 궁금할 때 전화할 곳
const HELP_CONTACTS = [
  { name: "소상공인시장진흥공단", desc: "소상공인 지원금·정책자금", tel: "1533-0100" },
  { name: "중소기업 통합콜센터", desc: "중소벤처기업부 지원사업 전반", tel: "1357" },
  { name: "국세청 상담센터", desc: "부가세·종합소득세 등 세금", tel: "126" },
];

// Q&A 검색 화면 — 자주 묻는 질문을 검색하고, 그래도 궁금하면 상담 전화로 연결해요
const FAQ_PURPLE = "#7A46D6";
function FaqSearchScreen({ onBack }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [openQ, setOpenQ] = useState(null);
  const categories = ["전체", ...Array.from(new Set(FAQ_DATA.map((f) => f.category)))];
  const searching = query.trim() !== "";

  const filtered = FAQ_DATA.filter((f) => {
    const matchesCategory = category === "전체" || f.category === category;
    const q = query.trim();
    const matchesQuery = !q || f.q.includes(q) || f.a.includes(q);
    return matchesCategory && matchesQuery;
  });
  const topList = !searching && category === "전체" ? filtered.filter((f) => f.top) : [];
  const restList = filtered.filter((f) => !topList.includes(f));

  const renderItem = (f) => {
    const open = openQ === f.q;
    return (
      <div key={f.q} className="rounded-[18px] mb-2 overflow-hidden" style={open ? { ...CARD, border: `1px solid ${FAQ_PURPLE}33` } : CARD}>
        <button onClick={() => setOpenQ(open ? null : f.q)} className="w-full flex items-start gap-2.5 px-4 py-3.5 text-left">
          <span className="text-[13px] font-black shrink-0 leading-[1.45]" style={{ color: FAQ_PURPLE }}>Q</span>
          <span className="flex-1 text-[13.5px] font-semibold leading-[1.45] break-keep" style={{ color: TEXT }}>{f.q}</span>
          <ChevronDown size={16} color={MUTED} className="shrink-0 mt-0.5" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "0.15s" }} />
        </button>
        {open && (
          <div className="flex items-start gap-2.5 px-4 pb-4">
            <span className="text-[13px] font-black shrink-0 leading-[1.6]" style={{ color: "#B9A2E8" }}>A</span>
            <p className="flex-1 text-[12.5px] leading-[1.7] break-keep" style={{ color: "#5E6577" }}>{f.a}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <HeroHeader icon={HelpCircle} color={FAQ_PURPLE} title="도움말 · Q&A" subtitle="지원금 기본 상식부터 앱 사용법까지 자주 묻는 질문을 모았어요" onBack={onBack} />

      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: INPUT_BG }}>
        <Search size={16} color={MUTED} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="궁금한 내용을 검색해보세요 (예: 서류, 대출)"
          className="flex-1 min-w-0 outline-none text-sm bg-transparent"
          style={{ color: TEXT }}
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="검색어 지우기">
            <X size={14} color={MUTED} />
          </button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pt-1 pb-3 -mt-1 mb-2 -mx-5 px-5" style={{ scrollbarWidth: "none" }}>
        {categories.map((c) => {
          const active = category === c;
          const n = c === "전체" ? FAQ_DATA.length : FAQ_DATA.filter((f) => f.category === c).length;
          return (
            <button key={c} onClick={() => setCategory(c)} className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0" style={active ? CHIP_ON : CHIP_OFF}>
              {c} <span className="opacity-70">{n}</span>
            </button>
          );
        })}
        <span data-scroll-end aria-hidden="true" className="shrink-0 w-6" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-14 text-sm" style={{ color: MUTED }}>
          검색 결과가 없어요.
          <br />
          아래 상담 전화로 편하게 물어보세요.
        </div>
      ) : (
        <>
          {topList.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <span className="w-1 h-4 rounded-full" style={{ background: FAQ_PURPLE }} />
                <p className="text-[14px] font-bold" style={{ color: TEXT }}>많이 묻는 질문</p>
              </div>
              <div className="mb-4">{topList.map(renderItem)}</div>
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <span className="w-1 h-4 rounded-full" style={{ background: "#C3C8D4" }} />
                <p className="text-[14px] font-bold" style={{ color: TEXT }}>전체 질문</p>
              </div>
            </>
          )}
          {restList.map(renderItem)}
        </>
      )}

      <p className="text-[13px] font-bold mt-6 mb-2.5 px-1" style={{ color: TEXT }}>그래도 궁금하시면 전화로 물어보세요</p>
      <div className="rounded-[20px] overflow-hidden" style={CARD}>
        {HELP_CONTACTS.map((c, i) => (
          <a key={c.tel} href={`tel:${c.tel}`} className="flex items-center gap-3 px-4 py-3.5" style={{ borderTop: i > 0 ? "1px solid #F1F2F6" : "none" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: GREEN_SOFT }}>
              <Phone size={15} color={GREEN} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold" style={{ color: TEXT }}>{c.name}</p>
              <p className="text-[11.5px]" style={{ color: MUTED }}>{c.desc}</p>
            </div>
            <span className="text-[13px] font-extrabold tabular-nums shrink-0" style={{ color: GREEN }}>{c.tel}</span>
          </a>
        ))}
      </div>
      <p className="text-[11px] mt-2 px-1" style={{ color: MUTED }}>평일 09:00~18:00 운영 (기관마다 조금씩 달라요)</p>
    </div>
  );
}

// 지원금 신청에 자주 필요한 서류 — 발급처별로 묶었어요 (when: 언제 필요한지)
const DOC_GROUPS = [
  {
    key: "hometax",
    title: "홈택스에서 발급",
    sub: "국세청 · 공동/간편인증 로그인",
    url: "https://www.hometax.go.kr",
    color: "#2C6FDB",
    docs: [
      { name: "사업자등록증명", desc: "사업자 정보 확인용 기본 서류", when: "거의 모든 지원금" },
      { name: "부가가치세 과세표준증명", desc: "매출액 확인용 (보통 전년도분)", when: "매출 기준이 있는 지원금" },
      { name: "소득금액증명원", desc: "종합소득세 신고 기준 소득 확인", when: "정책자금·보증" },
      { name: "납세증명서 (국세 완납증명)", desc: "국세 체납이 없다는 증명", when: "정책자금·보증·지자체 지원" },
      { name: "폐업사실증명원", desc: "폐업했다는 증명", when: "재기·폐업 지원" },
    ],
  },
  {
    key: "gov24",
    title: "정부24에서 발급",
    sub: "행정안전부 · 공동/간편인증 로그인",
    url: "https://www.gov.kr",
    color: "#7A46D6",
    docs: [
      { name: "지방세 납세증명서 (완납증명)", desc: "지방세 체납이 없다는 증명", when: "정책자금·지자체 지원" },
      { name: "주민등록등본", desc: "대표자 주소·가족 확인", when: "일부 지자체 지원" },
    ],
  },
  {
    key: "etc",
    title: "기타 기관에서 발급",
    sub: "필요한 경우에만 준비하세요",
    color: "#C2410C",
    docs: [
      { name: "소상공인 확인서", desc: "소상공인에 해당한다는 공식 확인서", when: "정책자금·판로 지원", url: "https://sminfo.mss.go.kr", source: "중소기업현황정보시스템" },
      { name: "4대보험 가입자 명부", desc: "직원 고용 여부 확인", when: "인건비·고용 지원", url: "https://www.4insure.or.kr", source: "4대사회보험 정보연계센터" },
    ],
  },
  {
    key: "self",
    title: "직접 준비",
    sub: "사진 촬영·스캔해서 준비",
    color: "#2C9F6B",
    docs: [
      { name: "신분증", desc: "대표자 본인 확인용", when: "거의 모든 지원금" },
      { name: "통장사본", desc: "지원금 받을 계좌 · 사업자(대표자) 명의", when: "현금 지원금" },
      { name: "임대차계약서", desc: "사업장을 빌려 쓰는 경우", when: "임차료 지원·정책자금" },
    ],
  },
];
const DOC_TOTAL = DOC_GROUPS.reduce((n, g) => n + g.docs.length, 0);
const DOC_CHECK_KEY = "docChecklist";

// 서류·양식 자료실 — 체크리스트(휴대폰에 저장) + 발급처 바로가기
const DOC_ORANGE = "#C2410C";
function DocumentsScreen({ onBack }) {
  const [checked, setChecked] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(DOC_CHECK_KEY)) || []);
    } catch (e) {
      return new Set();
    }
  });
  const save = (next) => {
    try {
      localStorage.setItem(DOC_CHECK_KEY, JSON.stringify([...next]));
    } catch (e) {
      // 저장이 안 돼도 화면 체크는 그대로 돼요
    }
  };
  const toggle = (name) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      save(next);
      return next;
    });
  };
  const reset = () => {
    const next = new Set();
    save(next);
    setChecked(next);
  };
  const pct = Math.round((checked.size / DOC_TOTAL) * 100);

  return (
    <div>
      <HeroHeader icon={FileText} color={DOC_ORANGE} title="서류 · 양식 자료실" subtitle="지원금 신청 전에 자주 필요한 서류를 미리 챙겨두세요" onBack={onBack} />

      {/* 준비 현황 */}
      <div className="rounded-[24px] p-4 mb-3" style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #FFFFFF 100%)", border: "1px solid #FBE3CF" }}>
        <div className="flex items-end justify-between mb-2.5">
          <div>
            <p className="text-[12px] font-semibold" style={{ color: "#9A3412" }}>서류 준비 현황</p>
            <p className="text-[20px] font-extrabold mt-0.5 tabular-nums" style={{ color: TEXT }}>
              {checked.size} <span className="text-[14px] font-bold" style={{ color: MUTED }}>/ {DOC_TOTAL}개</span>
            </p>
          </div>
          {checked.size > 0 && (
            <button onClick={reset} className="flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1.5 rounded-full" style={{ background: "white", color: MUTED }}>
              <RefreshCw size={11} /> 처음부터
            </button>
          )}
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#FCE3CF" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #FB923C, #EA580C)" }} />
        </div>
        <p className="text-[11px] mt-2" style={{ color: "#9A3412" }}>체크한 내용은 이 휴대폰에 저장돼요</p>
      </div>

      <div className="rounded-[20px] p-3.5 mb-5 flex items-start gap-2" style={{ background: "#FFF7ED" }}>
        <Lightbulb size={14} color={DOC_ORANGE} className="shrink-0 mt-0.5" />
        <p className="text-[11.5px] leading-relaxed break-keep" style={{ color: "#9A3412" }}>
          지원금마다 필요한 서류가 달라요. 아래는 자주 쓰는 서류예요. 증명서는 보통 <b>신청일 기준 1~3개월 이내 발급분</b>을 요구하니 신청 직전에 발급하세요. 요즘은 국세청 자료를 자동으로 확인해 서류 없이 신청되는 지원금도 많아요.
        </p>
      </div>

      {DOC_GROUPS.map((g) => {
        const done = g.docs.filter((d) => checked.has(d.name)).length;
        return (
          <div key={g.key} className="mb-5">
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1 h-4 rounded-full shrink-0" style={{ background: g.color }} />
                <div className="min-w-0">
                  <p className="text-[14px] font-bold" style={{ color: TEXT }}>
                    {g.title} <span className="text-[12px] font-semibold tabular-nums" style={{ color: MUTED }}>{done}/{g.docs.length}</span>
                  </p>
                  <p className="text-[11px]" style={{ color: MUTED }}>{g.sub}</p>
                </div>
              </div>
              {g.url && (
                <a href={g.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11.5px] font-bold px-3 py-1.5 rounded-full shrink-0" style={{ background: `${g.color}14`, color: g.color }}>
                  바로가기 <ExternalLink size={11} />
                </a>
              )}
            </div>
            <div className="rounded-[20px] overflow-hidden" style={CARD}>
              {g.docs.map((doc, i) => {
                const on = checked.has(doc.name);
                return (
                  <div key={doc.name} className="flex items-start gap-3 px-3.5 py-3" style={{ borderTop: i > 0 ? "1px solid #F1F2F6" : "none" }}>
                    <button
                      onClick={() => toggle(doc.name)}
                      aria-label={`${doc.name} ${on ? "준비 취소" : "준비 완료"}`}
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors"
                      style={on ? { background: GREEN, borderColor: GREEN } : { background: "white", borderColor: "#D5D9E3" }}
                    >
                      {on && <Check size={13} color="white" strokeWidth={3} />}
                    </button>
                    <button onClick={() => toggle(doc.name)} className="flex-1 min-w-0 text-left">
                      <p className="text-[13.5px] font-bold" style={{ color: on ? MUTED : TEXT, textDecoration: on ? "line-through" : "none" }}>{doc.name}</p>
                      <p className="text-[11.5px] mt-0.5 leading-snug" style={{ color: MUTED }}>{doc.desc}</p>
                      <span className="inline-block text-[10.5px] font-semibold mt-1.5 px-1.5 py-0.5 rounded" style={{ background: "#F3F5FA", color: "#6B7385" }}>
                        {doc.when}
                      </span>
                    </button>
                    {doc.url && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" aria-label={`${doc.source}에서 발급`} className="flex items-center gap-0.5 text-[11px] font-semibold shrink-0 mt-0.5" style={{ color: g.color }}>
                        발급 <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="text-[11px] leading-relaxed" style={{ color: MUTED }}>
        * 홈택스·정부24는 공동인증서나 간편인증(카카오·네이버 등)으로 로그인하면 무료로 바로 발급돼요. 인터넷 발급이 어려우면 가까운 세무서·주민센터 무인발급기를 이용하세요.
      </p>
    </div>
  );
}

// 세금·마감 일정 화면 → "사장님 일정": 내 일정 + 세금 신고일 + 즐겨찾기 지원금 마감일을 월별로 보여줘요
const TAX_GREEN = "#2C9F6B";
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
// 달마다 다른 색 — 일정이 많아도 어느 달인지 한눈에 보여요 (1월~12월)
const MONTH_COLORS = ["#3D63DD", "#7A46D6", "#2C9F6B", "#D6478E", "#0E9AA7", "#E8890C", "#2F86D6", "#C2410C", "#8B62D9", "#E5674D", "#A0701A", "#1F7A5C"];

// 내 일정 추가·수정 창 (아래에서 올라오는 시트)
function EventEditor({ initial, onSave, onDelete, onClose }) {
  const editing = !!initial?.id;
  const [title, setTitle] = useState(initial?.title || "");
  const [emoji, setEmoji] = useState(initial?.emoji || "📌");
  const [repeat, setRepeat] = useState(initial?.repeat || "monthly");
  const [day, setDay] = useState(initial?.day || 10);
  const [date, setDate] = useState(initial?.date || formatLocalDate(new Date(TODAY.getTime() + 7 * 864e5)));
  const [alertOn, setAlertOn] = useState(initial ? initial.alert !== false : true);
  const pickPreset = (p) => {
    setEmoji(p.emoji);
    setTitle(p.title === "직접 입력" ? "" : p.title);
    setRepeat(p.repeat);
    if (p.day) setDay(p.day);
  };
  const ok = title.trim().length > 0 && (repeat === "monthly" || date);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center" style={{ zIndex: 60 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md md:max-w-xl rounded-t-[24px] p-5 pb-7 max-h-[88%] overflow-y-auto">
        <div className="w-9 h-1 bg-[#E5E7EE] rounded-full mx-auto mb-4" />
        <p className="text-[17px] font-bold mb-4" style={{ color: TEXT }}>{editing ? "일정 수정" : "내 일정 추가"}</p>

        {!editing && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {EVENT_PRESETS.map((p) => {
              const on = (p.title === "직접 입력" && emoji === p.emoji) || title === p.title;
              return (
                <button key={p.title} onClick={() => pickPreset(p)} className="px-3 py-1.5 rounded-full text-[12.5px] font-semibold" style={on ? CHIP_ON : CHIP_OFF}>
                  {p.emoji} {p.title}
                </button>
              );
            })}
          </div>
        )}

        <p className="text-[13px] font-semibold mb-1.5" style={{ color: TEXT }}>일정 이름</p>
        <div className="flex items-center rounded-xl px-3.5 py-3 mb-4" style={{ background: INPUT_BG }}>
          <span className="mr-2 text-[16px]">{emoji}</span>
          <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 20))} placeholder="예: 직원 월급날" className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-semibold" style={{ color: TEXT }} />
        </div>

        <p className="text-[13px] font-semibold mb-1.5" style={{ color: TEXT }}>반복</p>
        <CalcModeSwitch value={repeat} onChange={setRepeat} options={[{ key: "monthly", label: "매달 반복" }, { key: "once", label: "한 번만" }]} />

        {repeat === "monthly" ? (
          <>
            <p className="text-[13px] font-semibold mb-1.5" style={{ color: TEXT }}>매달 며칠?</p>
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <button key={d} onClick={() => setDay(d)} className="aspect-square rounded-lg text-[12.5px] font-semibold tabular-nums" style={day === d ? CHIP_ON : { background: "#F5F6FA", color: TEXT }}>
                  {d === 31 ? "말일" : d}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-[13px] font-semibold mb-1.5" style={{ color: TEXT }}>날짜</p>
            <input
              type="date"
              value={date}
              min={formatLocalDate(TODAY)}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl px-3.5 py-3 mb-4 text-[15px] font-semibold outline-none"
              style={{ background: INPUT_BG, color: TEXT }}
            />
          </>
        )}

        <div className="flex items-center justify-between rounded-xl px-3.5 py-3 mb-5" style={{ background: "#F7F8FB" }}>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: TEXT }}>미리 알림 받기</p>
            <p className="text-[11px]" style={{ color: MUTED }}>알림 시점·시각은 MY 탭 알림 설정을 따라요</p>
          </div>
          <Switch checked={alertOn} onChange={() => setAlertOn(!alertOn)} />
        </div>

        <button
          disabled={!ok}
          onClick={() => onSave({ id: initial?.id || `e${Date.now()}`, title: title.trim(), emoji, repeat, day, date: repeat === "once" ? date : undefined, alert: alertOn })}
          className="w-full py-4 rounded-2xl text-[14.5px] font-bold"
          style={ok ? BTN_PRIMARY : { background: "#E7E9F0", color: MUTED }}
        >
          {editing ? "저장하기" : "일정 추가하기"}
        </button>
        {editing && (
          <button onClick={() => onDelete(initial.id)} className="w-full py-3 mt-2 rounded-2xl text-[13px] font-semibold" style={{ color: RED }}>
            이 일정 삭제
          </button>
        )}
      </div>
    </div>
  );
}

function TaxScheduleScreen({ onBack, favorites, taxAlertOn, onToggleTaxAlert, planDesc, myEvents = [], onSaveEvent, onDeleteEvent, onSelectProgram, callName = "사장님", taxStaff = false, onToggleTaxStaff }) {
  const [filter, setFilter] = useState("all"); // all | my | tax | subsidy
  const [editing, setEditing] = useState(null); // null | {} (새로) | 이벤트
  // 원천세·4대보험은 "직원이 있어요"를 켠 사장님께만 보여줘요 (홈과 같은 기준)
  const all = buildScheduleItems({ favorites, myEvents }).filter((x) => taxStaff || x.type !== "tax" || !STAFF_TAX.includes(x.name));
  const shown = all.filter((x) => filter === "all" || x.type === filter);
  const next = all.find((x) => getDday(x.deadline) >= 0);
  const counts = { my: myEvents.length, subsidy: all.filter((x) => x.type === "subsidy").length };

  const groups = [];
  for (const item of shown) {
    const d = parseLocalDate(item.deadline);
    const key = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
    let g = groups.find((x) => x.key === key);
    if (!g) groups.push((g = { key, year: d.getFullYear(), month: d.getMonth(), items: [] }));
    g.items.push(item);
  }
  const tone = (t) => (t === "my" ? { accent: MY_ACCENT, soft: "#FFF3E0" } : t === "tax" ? { accent: TAX_GREEN, soft: "#E7F7EF" } : { accent: BLUE, soft: BLUE_SOFT });

  return (
    <div>
      <HeroHeader icon={CalendarCheck} color={TAX_GREEN} title={`${callName} 일정`} subtitle="월급날·임대료 같은 내 일정과 세금 신고일, 지원금 마감일을 한눈에 챙겨요" onBack={onBack} />

      {next && (
        <div className="relative overflow-hidden rounded-[24px] p-4 mb-3" style={{ background: "linear-gradient(135deg, #3DBB82 0%, #2C9F6B 100%)" }}>
          <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
          <p className="relative text-[12px] font-semibold text-white/80">가장 가까운 일정</p>
          <div className="relative flex items-end justify-between gap-3 mt-1">
            <div className="min-w-0">
              <p className="text-[17px] font-extrabold text-white leading-snug break-keep">
                {next.type === "my" && <span className="mr-1">{next.emoji}</span>}
                {next.name}
              </p>
              <p className="text-[12px] text-white/85 mt-0.5">
                {parseLocalDate(next.deadline).getMonth() + 1}월 {parseLocalDate(next.deadline).getDate()}일 ({WEEK[parseLocalDate(next.deadline).getDay()]}) · {next.who}
              </p>
            </div>
            <span className="text-[20px] font-black text-white shrink-0 tabular-nums">{getDday(next.deadline) === 0 ? "오늘" : `D-${getDday(next.deadline)}`}</span>
          </div>
        </div>
      )}

      {onSaveEvent && (
        <button onClick={() => setEditing({})} className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-2xl mb-3 text-[13.5px] font-bold active:scale-[0.99] transition-transform" style={{ background: "#FFF3E0", color: MY_ACCENT, border: "1.5px dashed #F5C27A" }}>
          + 내 일정 추가 <span className="font-medium opacity-80">(월급날·임대료·대출 상환 등)</span>
        </button>
      )}

      {onToggleTaxAlert && (
        <div className="rounded-[20px] p-4 mb-4 flex items-center justify-between gap-3" style={CARD}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#E7F7EF" }}>
              <Bell size={17} color={TAX_GREEN} />
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-bold" style={{ color: TEXT }}>세금 신고·납부일 알림</p>
              <p className="text-[11.5px] leading-snug" style={{ color: MUTED }}>
                {Capacitor.isNativePlatform() ? (taxAlertOn ? `${planDesc} · MY에서 변경` : "신고 기한을 놓치지 않게 미리 알려드려요") : "알림은 안드로이드 앱에서만 받을 수 있어요"}
              </p>
            </div>
          </div>
          <Switch checked={!!taxAlertOn} onChange={onToggleTaxAlert} />
        </div>
      )}

      {onToggleTaxStaff && (
        <button onClick={onToggleTaxStaff} className="w-full flex items-center gap-2.5 rounded-[18px] px-4 py-3 mb-3 text-left" style={CARD}>
          <span className="w-[20px] h-[20px] rounded-md flex items-center justify-center shrink-0" style={taxStaff ? { background: TAX_GREEN } : { border: "1.5px solid #C9CEDA" }}>
            {taxStaff && <Check size={13} color="white" strokeWidth={3} />}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[13px] font-semibold" style={{ color: TEXT }}>직원이 있어요</span>
            <span className="block text-[11.5px]" style={{ color: MUTED }}>매달 10일 원천세·4대보험 납부일도 함께 보여드려요</span>
          </span>
        </button>
      )}

      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {[
          { key: "all", label: "전체" },
          { key: "my", label: `내 일정 ${counts.my}` },
          { key: "tax", label: "세금·보험" },
          { key: "subsidy", label: `지원금 ${counts.subsidy}` },
        ].map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)} className="py-2 rounded-xl text-[11.5px] font-semibold whitespace-nowrap" style={filter === t.key ? CHIP_ON : CHIP_OFF}>
            {t.label}
          </button>
        ))}
      </div>

      {groups.map((g) => {
        const mc = MONTH_COLORS[g.month];
        const thisMonth = g.year === TODAY.getFullYear() && g.month === TODAY.getMonth();
        return (
        <div key={g.key} className="mb-5">
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="px-3 py-1 rounded-full text-[13.5px] font-extrabold text-white" style={{ background: mc, boxShadow: `0 3px 8px ${mc}40` }}>
              {g.month + 1}월
            </span>
            <span className="text-[12px] font-semibold" style={{ color: MUTED }}>{g.year}년</span>
            {thisMonth && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${mc}18`, color: mc }}>이번 달</span>
            )}
            <span className="flex-1 h-px ml-1" style={{ background: `${mc}30` }} />
            <span className="text-[11.5px] font-semibold tabular-nums" style={{ color: mc }}>{g.items.length}개</span>
          </div>
          <div className="rounded-[20px] overflow-hidden" style={{ ...CARD, borderLeft: `4px solid ${mc}` }}>
            {g.items.map((item, i) => {
              const d = parseLocalDate(item.deadline);
              const dday = getDday(item.deadline);
              const { accent, soft } = tone(item.type);
              const clickable = item.type === "my" || item.type === "subsidy";
              return (
                <div
                  key={item.key}
                  role={clickable ? "button" : undefined}
                  onClick={() => (item.type === "my" ? setEditing(item.ev) : item.type === "subsidy" && onSelectProgram ? onSelectProgram(item.programId) : null)}
                  className="flex items-center gap-3 px-3.5 py-3"
                  style={{ borderTop: i > 0 ? "1px solid #F1F2F6" : "none", cursor: clickable ? "pointer" : "default" }}
                >
                  <div className="w-11 shrink-0 rounded-xl py-1.5 text-center" style={{ background: soft }}>
                    <p className="text-[16px] font-extrabold leading-none tabular-nums" style={{ color: accent }}>{d.getDate()}</p>
                    <p className="text-[10px] font-semibold mt-1" style={{ color: accent }}>{WEEK[d.getDay()]}요일</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13.5px] font-bold truncate" style={{ color: TEXT }}>
                        {item.type === "my" && <span className="mr-1">{item.emoji}</span>}
                        {item.name}
                      </p>
                      {item.type === "subsidy" && <Heart size={11} color={BLUE} fill={BLUE} className="shrink-0" />}
                      {item.type === "my" && item.ev.alert && <Bell size={11} color={MY_ACCENT} className="shrink-0" />}
                    </div>
                    <p className="text-[11.5px] mt-0.5 leading-snug line-clamp-2" style={{ color: MUTED }}>
                      <span className="font-semibold" style={{ color: accent }}>{item.who}</span>
                      {item.type !== "my" && <> · {item.note}</>}
                      {item.shifted && <span className="font-semibold" style={{ color: "#B45309" }}> · 원래 날짜가 주말이라 이날까지</span>}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 tabular-nums" style={dday <= 3 ? { background: RED, color: "white" } : { background: soft, color: accent }}>
                    {dday === 0 ? "오늘" : `D-${dday}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        );
      })}

      {filter === "my" && counts.my === 0 && (
        <div className="rounded-[20px] p-5 text-center mb-4" style={{ background: "#FFF8EE" }}>
          <p className="text-[24px] mb-1">🗓️</p>
          <p className="text-[12.5px] leading-relaxed" style={{ color: "#8A5A12" }}>
            월급날·임대료·대출 상환일을 등록하면
            <br />
            며칠 전에 미리 알려드려요.
          </p>
        </div>
      )}
      {filter === "subsidy" && counts.subsidy === 0 && (
        <div className="rounded-[20px] p-5 text-center mb-4" style={{ background: "#F6F7FA" }}>
          <Heart size={20} color="#C3C8D4" className="mx-auto mb-2" />
          <p className="text-[12.5px] leading-relaxed" style={{ color: MUTED }}>
            마감일이 있는 지원금을 ♡ 즐겨찾기 하면
            <br />
            여기에 마감일이 함께 표시돼요.
          </p>
        </div>
      )}

      <a href="https://www.hometax.go.kr" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-1.5 py-3.5 mt-2 rounded-2xl text-[13px] font-bold" style={{ background: "#E7F7EF", color: TAX_GREEN }}>
        홈택스에서 신고·납부하기 <ExternalLink size={13} />
      </a>
      <p className="text-[11px] mt-4 leading-relaxed" style={{ color: MUTED }}>
        * 세금 일정은 개인사업자 기준이에요. 마감일이 주말·공휴일이면 다음 평일까지 신고할 수 있어요. 법인이나 특수한 경우는 기한이 다를 수 있으니 홈택스 또는 국세청 상담센터(국번 없이 126)에서 꼭 확인하세요. 내 일정은 이 휴대폰에만 저장돼요.
      </p>

      {editing && (
        <EventEditor
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={(ev) => {
            onSaveEvent(ev);
            setEditing(null);
            setFilter("my");
          }}
          onDelete={(id) => {
            onDeleteEvent(id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

// 지역센터 찾기 화면 — 소진공 지역본부 실제 주소·연락처를 보여줘요
function RegionalCentersScreen({ onBack, initialProvince }) {
  const [activeProvince, setActiveProvince] = useState(initialProvince || "전체");
  const [expandedMap, setExpandedMap] = useState(null);
  const [copiedName, setCopiedName] = useState(null);
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
          className="flex gap-1.5 overflow-x-auto pt-1 pb-3 -mt-1 -mb-2"
          style={{
            scrollbarWidth: "none",
            WebkitMaskImage: "linear-gradient(to right, black 0, black calc(100% - 24px), transparent 100%)",
            maskImage: "linear-gradient(to right, black 0, black calc(100% - 24px), transparent 100%)",
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
                  ? CHIP_ON
                  : CHIP_OFF
              }
            >
              {p}
            </button>
          ))}
          <span data-scroll-end aria-hidden="true" className="shrink-0 w-6" />
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
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="text-[12.5px] flex items-start gap-1.5" style={{ color: MUTED }}>
                  <MapPin size={13} className="shrink-0 mt-0.5" /> {c.address}
                </p>
                <button
                  onClick={async () => {
                    if (!(await copyText(c.address))) return;
                    setCopiedName(c.name);
                    setTimeout(() => setCopiedName((n) => (n === c.name ? null : n)), 1500);
                  }}
                  className="shrink-0 text-[11px] font-semibold px-2 py-1 rounded-lg"
                  style={copiedName === c.name ? { background: GREEN_SOFT, color: GREEN } : { background: "#EEF0F5", color: TEXT }}
                >
                  {copiedName === c.name ? "복사됨" : "복사"}
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
              {/* 좌표가 확인되지 않은 센터는 미니맵 대신 바로 네이버 지도를 열어요 */}
              {!c.addressPending && typeof c.lat !== "number" && (
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(c.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl text-center text-[12.5px] font-bold flex items-center justify-center gap-1"
                  style={{ background: "#F2F3F7", color: TEXT }}
                >
                  <MapPin size={13} /> 지도 보기 <ExternalLink size={11} />
                </a>
              )}
              {!c.addressPending && typeof c.lat === "number" && (
                <button
                  onClick={() => setExpandedMap(expandedMap === c.name ? null : c.name)}
                  className="flex-1 py-2.5 rounded-xl text-center text-[12.5px] font-bold flex items-center justify-center gap-1"
                  style={
                    expandedMap === c.name
                      ? CHIP_ON
                      : { background: "#F2F3F7", color: TEXT }
                  }
                >
                  <MapPin size={13} /> {expandedMap === c.name ? "닫기" : "지도 보기"}
                </button>
              )}
            </div>
            {c.fax && (
              <p className="text-[11px] mt-2" style={{ color: MUTED }}>팩스 {c.fax}</p>
            )}
            {!c.addressPending && expandedMap === c.name && (
              <div className="mt-3 rounded-xl p-3.5" style={{ background: "#FAFAFA", border: `1px solid ${BORDER}` }}>
                <CenterMapPreview center={c} />
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(c.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-center text-[12.5px] font-bold flex items-center justify-center gap-1"
                  style={{ background: BLUE_SOFT, color: BLUE }}
                >
                  네이버 지도에서 보기 <ExternalLink size={12} />
                </a>
              </div>
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
              style={n === page ? CHIP_ON : { color: MUTED }}
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
  const [answers, setAnswers] = useState({ region: null, industry: null, revenueBand: null, yearsBand: null, employees: null, needs: [], situation: [] });

  const STEPS = [
    { key: "region", question: "사업장이 있는 지역이 어디인가요?", grid: true, options: REGIONS.filter((r) => r !== "전체").map((r) => ({ key: r, label: r })) },
    { key: "industry", question: "어떤 업종을 운영하고 계세요?", options: DIAG_INDUSTRY },
    { key: "revenueBand", question: "최근 1년 연매출은 어느 정도인가요?", options: DIAG_REVENUE },
    { key: "yearsBand", question: "사업을 시작한 지 얼마나 되셨나요?", options: DIAG_YEARS },
    { key: "employees", question: "사장님을 빼고 직원은 몇 명인가요?", hint: "4대보험에 가입된 상시 직원 기준이에요", options: DIAG_EMPLOYEES },
    { key: "needs", question: "지금 가장 필요한 지원은 무엇인가요?", hint: "여러 개 고를 수 있어요", multi: true, options: DIAG_NEEDS },
    { key: "situation", question: "해당되는 상황이 있나요?", hint: "여러 개 고를 수 있어요", multi: true, options: DIAG_SITUATION },
  ];
  const current = STEPS[step];
  const selected = answers[current.key];

  const goNext = (next) => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete({ ...next, version: 2 });
  };
  const pick = (value) => {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    goNext(next);
  };
  const toggle = (value) => {
    let list = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
    // "해당 없어요"는 다른 보기와 같이 고를 수 없어요
    if (value === "none") list = list.includes("none") ? ["none"] : [];
    else list = list.filter((v) => v !== "none");
    setAnswers({ ...answers, [current.key]: list });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => (step === 0 ? onBack() : setStep(step - 1))}
          className="navArrowBtn w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center shrink-0"
          aria-label="뒤로가기"
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
      <h2 className="text-[19px] font-bold leading-snug" style={{ color: TEXT }}>{current.question}</h2>
      <p className="text-[12px] mt-1 mb-5" style={{ color: MUTED }}>{current.hint || " "}</p>

      {current.grid ? (
        <div className="grid grid-cols-3 gap-2">
          {current.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => pick(opt.key)}
              className="py-3.5 rounded-2xl text-[14px] font-semibold active:scale-[0.97] transition-transform"
              style={selected === opt.key ? { ...CHIP_ON } : { ...CARD, color: TEXT }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : current.multi ? (
        <>
          <div className="space-y-2">
            {current.options.map((opt) => {
              const on = selected.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => toggle(opt.key)}
                  className="w-full text-left px-4 py-4 rounded-2xl text-[14px] font-semibold flex items-center justify-between active:scale-[0.99] transition-transform"
                  style={on ? { background: BLUE_SOFT, border: `1.5px solid ${BLUE}`, color: BLUE } : { ...CARD, color: TEXT }}
                >
                  {opt.label}
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={on ? { background: BLUE } : { border: "1.5px solid #C9CEDA" }}
                  >
                    {on && <Check size={13} color="white" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => goNext(answers)}
            className="w-full mt-5 py-4 rounded-2xl text-[14.5px] font-bold active:scale-[0.99] transition-transform"
            style={selected.length ? BTN_PRIMARY : { background: "#E7E9F0", color: MUTED }}
          >
            {selected.length ? (step === STEPS.length - 1 ? "결과 보기" : "다음") : "건너뛰기"}
          </button>
        </>
      ) : (
        <div className="space-y-2">
          {current.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => pick(opt.key)}
              className="w-full text-left px-4 py-4 rounded-2xl text-[14px] font-semibold flex items-center justify-between active:scale-[0.99] transition-transform"
              style={selected === opt.key ? { background: BLUE_SOFT, border: `1.5px solid ${BLUE}`, color: BLUE } : { ...CARD, color: TEXT }}
            >
              {opt.label}
              <ChevronRight size={16} color="#C3C8D4" />
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] mt-6" style={{ color: MUTED }}>
        * 1분이면 끝나요. 답변은 언제든 다시 진단해서 바꿀 수 있어요.
      </p>
    </div>
  );
}

function DiagnosisResultScreen({ diagnosis, onBack, onRedo, onClear, onViewAll, onSelectProgram, statusFilter, setStatusFilter, callName = "사장님" }) {
  const results = ALL_PROGRAMS.map((p) => ({ p, r: diagnoseProgram(p, diagnosis) })).filter((x) => x.r.eligible);
  const open = results.filter((x) => !isExpired(x.p));
  const urgentCount = open.filter((x) => getDday(x.p.deadline) <= 7).length;

  const sorted = results
    .filter((x) => {
      const d = getDday(x.p.deadline);
      if (statusFilter === "urgent") return d <= 7 && d >= 0;
      if (statusFilter === "closed") return d < 0;
      return d >= 0;
    })
    .sort((a, b) => {
      const ea = isExpired(a.p) ? 1 : 0;
      const eb = isExpired(b.p) ? 1 : 0;
      if (ea !== eb) return ea - eb;
      if (b.r.score !== a.r.score) return b.r.score - a.r.score;
      return byDeadline(a.p, b.p);
    });
  const top = sorted.filter((x) => !isExpired(x.p) && x.r.score >= 3).slice(0, 3);
  const rest = sorted.filter((x) => !top.includes(x));

  // 진단 답변 요약
  const chips = [
    diagnosis.region,
    diagLabel(DIAG_INDUSTRY, diagnosis.industry),
    diagLabel(DIAG_REVENUE, diagnosis.revenueBand) && `연매출 ${diagLabel(DIAG_REVENUE, diagnosis.revenueBand)}`,
    diagLabel(DIAG_YEARS, diagnosis.yearsBand) && (diagnosis.yearsBand === "pre" ? "예비 창업" : `업력 ${diagLabel(DIAG_YEARS, diagnosis.yearsBand)}`),
    diagnosis.employees && (diagnosis.employees === "0" ? "직원 없음" : `직원 ${diagLabel(DIAG_EMPLOYEES, diagnosis.employees)}`),
  ].filter(Boolean);

  // 진단 전체에 대한 안내
  const notices = [];
  if (!isSmallBusiness(diagnosis))
    notices.push("직원 수 기준으로 '소상공인'이 아닐 수 있어요 (제조·건설·운수 10인 미만, 그 외 5인 미만). 중소기업도 받을 수 있는 자금만 보여드려요.");
  if (diagnosis.yearsBand === "pre")
    notices.push("예비 창업자는 사업자등록 후 받을 수 있는 지원금이 대부분이에요. 창업 지원은 'K-스타트업(k-startup.go.kr)'에서 찾아보세요.");
  if (diagnosis.revenueBand === "over140")
    notices.push("연매출 1억 4백만원 이상이면 경영안정바우처 같은 일부 지원금은 받을 수 없어요.");
  if (!diagnosis.version)
    notices.push("예전 방식으로 진단한 결과예요. '다시 진단'을 누르면 업종·필요한 지원까지 반영해 더 정확하게 추천해드려요.");

  return (
    <div>
      <SectionHeader
        title="맞춤 진단 결과"
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

      {/* 결과 요약 */}
      <div className="relative overflow-hidden rounded-[24px] p-5 mb-3" style={{ background: "linear-gradient(135deg, #5B8DF7 0%, #3D63DD 100%)" }}>
        <div className="absolute -right-10 -top-12 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="relative flex items-center gap-1.5 mb-1.5">
          <CheckCircle2 size={15} color="white" />
          <p className="text-[12.5px] text-white/80">{callName}이 지금 신청할 수 있는</p>
        </div>
        <p className="relative text-white font-extrabold text-[22px] mt-1 pt-0.5" style={{ lineHeight: 1.45 }}>지원금이 {open.length}건 있어요</p>
        {top.length > 0 && (
          <p className="relative text-[12.5px] mt-1 text-white/85">그중 {top.length}건은 {callName} 상황에 특히 잘 맞아요</p>
        )}
        <div className="relative flex flex-wrap gap-1.5 mt-3.5">
          {chips.map((c) => (
            <span key={c} className="text-[11px] font-semibold px-2 py-1 rounded-full text-white" style={{ background: "rgba(255,255,255,0.18)" }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {notices.length > 0 && (
        <div className="rounded-[20px] p-4 mb-3 space-y-2" style={{ background: GOLD_SOFT }}>
          {notices.map((n) => (
            <div key={n} className="flex items-start gap-2">
              <AlertTriangle size={14} color={GOLD} className="shrink-0 mt-0.5" />
              <p className="text-[12px] leading-relaxed break-keep" style={{ color: "#7A5A1E" }}>{n}</p>
            </div>
          ))}
        </div>
      )}

      {/* 추천 지원금 */}
      {top.length > 0 && statusFilter === "available" && (
        <>
          <div className="flex items-center gap-2 mt-5 mb-2.5">
            <span className="w-1 h-4 rounded-full" style={{ background: BLUE }} />
            <p className="text-[15px] font-bold" style={{ color: TEXT }}>{callName}께 딱 맞는 지원금</p>
          </div>
          <div className="space-y-2 mb-5">
            {top.map(({ p, r }) => (
              <ProgramRow key={p.id} p={p} reason={r.reason} highlight onClick={() => onSelectProgram(p.id)} />
            ))}
          </div>
        </>
      )}

      <div className="flex items-center gap-2 mt-2 mb-2.5">
        <span className="w-1 h-4 rounded-full" style={{ background: "#C3C8D4" }} />
        <p className="text-[15px] font-bold" style={{ color: TEXT }}>{top.length > 0 && statusFilter === "available" ? "함께 볼 만한 지원금" : "받을 수 있는 지원금"}</p>
      </div>
      <div className="flex gap-1.5 mb-3">
        {[
          { key: "available", label: "신청가능", count: open.length },
          { key: "urgent", label: "마감임박", count: urgentCount },
          { key: "closed", label: "접수마감", count: results.length - open.length },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold"
            style={statusFilter === s.key ? CHIP_ON : CHIP_OFF}
          >
            {s.label} <span style={{ opacity: 0.75 }}>({s.count})</span>
          </button>
        ))}
      </div>

      {statusFilter === "closed" && <ClosedNotice />}
      {(statusFilter === "available" ? rest : sorted).length === 0 ? (
        <div className="text-center py-12 text-sm" style={{ color: MUTED }}>
          {statusFilter === "urgent" ? "마감이 7일 이내로 남은 지원금은 없어요." : statusFilter === "closed" ? "접수가 끝난 지원금은 없어요." : "더 보여드릴 지원금이 없어요."}
        </div>
      ) : (
        <div className="space-y-2">
          {(statusFilter === "available" ? rest : sorted).map(({ p, r }) => (
            <ProgramRow key={p.id} p={p} reason={isExpired(p) ? null : r.reason} onClick={() => onSelectProgram(p.id)} />
          ))}
        </div>
      )}

      <button
        onClick={onViewAll}
        className="w-full flex items-center justify-center gap-1 py-3 mt-4 rounded-2xl text-[12.5px] font-semibold"
        style={CHIP_OFF}
      >
        조건과 상관없이 전체 지원금 보기 <ChevronRight size={13} />
      </button>

      <p className="text-[11px] mt-4 leading-relaxed" style={{ color: MUTED }}>
        * 답변을 바탕으로 한 참고용 추천이에요. 신용점수·고용 기간 같은 세부 조건은 지원금마다 달라서, 신청 전 상세 화면과 공식 공고를 꼭 확인하세요.
      </p>
    </div>
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

// 접수가 끝난 지원금 안내 — 목록·진단 결과의 '접수마감' 탭 위에 보여줘요
function ClosedNotice() {
  return (
    <div className="rounded-[20px] p-4 mb-3 flex items-start gap-2.5" style={{ background: "#F4F5F8" }}>
      <Info size={15} color={MUTED} className="shrink-0 mt-0.5" />
      <p className="text-[12px] leading-relaxed break-keep" style={{ color: "#5E6577" }}>
        올해 접수가 끝난 지원금이에요. 대부분 <b>매년 비슷한 시기에 다시 공고</b>가 나와요. 관심 있는 지원금은 ♡ 즐겨찾기 해두시면, 새 공고로 정보가 바뀔 때 바로 확인할 수 있어요.
      </p>
    </div>
  );
}

// 지원금 목록 카드 — 목록·즐겨찾기·맞춤진단 결과에서 같이 써요
function ProgramRow({ p, onClick, actions, reason, highlight }) {
  const dday = getDday(p.deadline);
  const color = urgencyColor(dday);
  const cat = CATEGORY_COLORS[p.category] || { bg: BLUE };
  const urgent = !p.recurring && dday >= 0 && dday <= 7;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="w-full text-left rounded-[20px] px-4 py-3.5 active:scale-[0.99] transition-transform cursor-pointer"
      style={{
        ...(highlight ? { ...CARD, border: `1.5px solid ${BLUE}55`, boxShadow: "0 6px 18px rgba(61,99,221,0.12)" } : CARD),
        ...(dday < 0 && !p.recurring ? { opacity: 0.6 } : {}),
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0" style={{ background: `${cat.bg}1A`, color: cat.bg }}>
          {p.category}
        </span>
        <span className="text-[11.5px] truncate" style={{ color: MUTED }}>{regionLabel(p)}</span>
        <span className="flex-1" />
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 tabular-nums"
          style={
            p.recurring
              ? { background: GREEN_SOFT, color: GREEN }
              : dday < 0
              ? { background: "#F1F2F5", color: MUTED }
              : urgent
              ? { background: RED, color: "white" }
              : { background: `${color}1A`, color }
          }
        >
          {p.recurring ? "상시접수" : dday < 0 ? "마감" : dday === 0 ? "오늘 마감" : `D-${dday}`}
        </span>
      </div>
      <p className="text-[15px] font-bold leading-snug line-clamp-2 break-keep" style={{ color: TEXT }}>{p.name}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <p className="text-[12px] truncate flex-1" style={{ color: MUTED }}>{p.amountLabel}</p>
        {actions}
      </div>
      {reason && (
        <p className="flex items-center gap-1 text-[11.5px] font-semibold mt-2 pt-2" style={{ color: BLUE, borderTop: "1px dashed #E6E9F2" }}>
          <CheckCircle2 size={12} /> {reason}
        </p>
      )}
    </div>
  );
}

// 홈 '사장님 일정' — 가까운 일정 3개, 내 일정이 없으면 등록 안내
function HomeScheduleList({ favorites, myEvents, taxStaff, onOpen }) {
  // 직원 관련 세금(원천세·4대보험)은 "직원이 있어요"를 체크한 사장님께만 보여줘요
  const items = buildScheduleItems({ favorites, myEvents })
    .filter((x) => getDday(x.deadline) >= 0 && (taxStaff || x.type !== "tax" || !STAFF_TAX.includes(x.name)))
    .slice(0, 3);
  const tones = { my: { bg: "#FFF3E0", fg: MY_ACCENT }, tax: { bg: "#E7F7EF", fg: "#2C9F6B" }, subsidy: { bg: BLUE_SOFT, fg: BLUE } };
  return (
    <div>
      {items.map((x, i) => {
        const d = getDday(x.deadline);
        const t = tones[x.type];
        const dt = parseLocalDate(x.deadline);
        return (
          <button key={x.key} onClick={onOpen} className="w-full flex items-center gap-3 py-3" style={{ borderTop: i > 0 ? "1px solid #F1F2F6" : "none" }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] shrink-0" style={{ background: t.bg }}>
              {x.type === "my" ? x.emoji : x.type === "tax" ? "🧾" : "💙"}
            </span>
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-[13.5px] font-semibold truncate" style={{ color: TEXT }}>{x.name}</span>
              <span className="block text-[11px]" style={{ color: MUTED }}>{dt.getMonth() + 1}월 {dt.getDate()}일 · {x.who}</span>
            </span>
            <span className="text-[11.5px] font-bold px-2 py-1 rounded-lg shrink-0 tabular-nums" style={d <= 3 ? { background: RED, color: "white" } : { background: t.bg, color: t.fg }}>
              {d === 0 ? "오늘" : `D-${d}`}
            </span>
          </button>
        );
      })}
      {myEvents.length === 0 && (
        <button onClick={onOpen} className="w-full flex items-center gap-2 py-3 text-left" style={{ borderTop: items.length ? "1px solid #F1F2F6" : "none" }}>
          <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[15px] font-bold" style={{ background: "#FFF3E0", color: MY_ACCENT }}>+</span>
          <span className="text-[12.5px] font-semibold" style={{ color: MY_ACCENT }}>월급날·임대료를 등록하면 미리 알려드려요</span>
        </button>
      )}
    </div>
  );
}

// 마감이 가까운 지원금 3개 (상시 접수 사업은 마감일이 없어서 제외)
const RANK_TONES = [
  { bg: "#FEEBF1", fg: "#F04D6E" },
  { bg: "#F0E9FD", fg: "#8B62D9" },
  { bg: "#E6F0FE", fg: "#3D72E8" },
];
function DeadlineSoonList({ onSelect }) {
  const items = ALL_PROGRAMS.filter((p) => !isExpired(p) && p.deadline !== "2099-12-31")
    .sort((a, b) => getDday(a.deadline) - getDday(b.deadline))
    .slice(0, 3);

  if (items.length === 0) {
    return <p className="text-[12px] py-3 text-center" style={{ color: MUTED }}>지금 마감이 임박한 지원금이 없어요</p>;
  }

  return (
    <div>
      {items.map((p, index) => {
        const d = getDday(p.deadline);
        const urgent = d <= 7;
        const tone = RANK_TONES[index];
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full flex items-center gap-3 py-3"
            style={{ borderTop: index > 0 ? "1px solid #F1F2F6" : "none" }}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-extrabold shrink-0 tabular-nums"
              style={{ background: tone.bg, color: tone.fg }}
            >
              {index + 1}
            </span>
            <span className="text-[13.5px] font-semibold truncate flex-1 text-left" style={{ color: TEXT }}>
              {p.name}
            </span>
            <span
              className="text-[11.5px] font-bold px-2 py-1 rounded-lg shrink-0 tabular-nums"
              style={urgent ? { background: RED, color: "white" } : { background: tone.bg, color: tone.fg }}
            >
              {d === 0 ? "오늘 마감" : `D-${d}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---- 사장님 필수 계산기 툴킷 ----
// ---- 사장님 필수 계산기 ----
// 숫자 입력: 내부 값은 숫자, 화면에는 천 단위 쉼표를 붙여 보여줘요
function useNumberInput(initial) {
  const [raw, setRaw] = useState(String(initial).replace(/[^0-9.]/g, ""));
  const num = Number(raw) || 0;
  const onChange = (e) => {
    let v = e.target.value.replace(/[^0-9.]/g, "");
    const dot = v.indexOf(".");
    if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, "");
    setRaw(v.replace(/^0+(?=\d)/, ""));
  };
  return [num, withCommas(raw), onChange];
}

function CalcNumberField({ label, value, onChange, suffix, placeholder, hint }) {
  return (
    <div className="mb-3.5">
      <p className="text-[13px] font-semibold mb-1.5" style={{ color: TEXT }}>{label}</p>
      <div className="flex items-center rounded-xl px-3.5 py-3" style={{ background: INPUT_BG }}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent outline-none text-[16px] font-semibold tabular-nums"
          style={{ color: TEXT }}
        />
        {suffix && <span className="text-[13px] font-medium ml-2 shrink-0" style={{ color: MUTED }}>{suffix}</span>}
      </div>
      {hint && <p className="text-[11px] mt-1 px-1" style={{ color: MUTED }}>{hint}</p>}
    </div>
  );
}

// 계산 방식 고르기 (예: 판매가 정하기 / 마진 확인)
function CalcModeSwitch({ value, onChange, options }) {
  return (
    <div className="flex p-1 rounded-xl mb-4" style={{ background: INPUT_BG }}>
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className="flex-1 py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
          style={value === o.key ? { background: "white", color: BLUE, boxShadow: "0 1px 4px rgba(40,60,120,0.12)" } : { color: MUTED }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CalcNotice({ tone = "red", children }) {
  const red = tone === "red";
  return (
    <div className="rounded-xl px-3.5 py-3 mb-3.5 flex items-start gap-2" style={{ background: red ? RED_SOFT : GREEN_SOFT }}>
      {red ? <XCircle size={14} color={RED} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={14} color={GREEN} className="shrink-0 mt-0.5" />}
      <p className="text-[12px] leading-relaxed break-keep" style={{ color: red ? RED : GREEN }}>{children}</p>
    </div>
  );
}

// 계산 결과 카드 — 결과를 복사해서 메모·카톡에 붙여넣을 수 있어요
function CalcResultCard({ rows, title = "계산 결과" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const text = [`[지원금알리미 계산기] ${title}`, ...rows.map((r) => `· ${r.label}: ${r.value}`)].join("\n");
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };
  return (
    <div className="rounded-[18px] p-4" style={{ background: BLUE_SOFT }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <ClipboardIcon />
          <p className="text-[13px] font-bold" style={{ color: TEXT }}>{title}</p>
        </div>
        <button onClick={copy} className="flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "white", color: copied ? GREEN : BLUE }}>
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "복사됨" : "결과 복사"}
        </button>
      </div>
      <div className="space-y-2.5">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3"
            style={i > 0 ? { borderTop: `1px solid rgba(61,99,221,0.12)`, paddingTop: 10 } : {}}
          >
            <span className={row.primary ? "text-[13.5px] font-semibold" : "text-[13px]"} style={{ color: row.primary ? TEXT : row.tone === "red" ? RED : MUTED }}>{row.label}</span>
            <span className={`${row.primary ? "text-[22px] font-extrabold" : "text-[15px] font-bold"} tabular-nums text-right`} style={{ color: row.primary ? BLUE : row.tone === "red" ? RED : TEXT }}>{row.value}</span>
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
function pct(n) {
  return `${(Math.round(n * 10) / 10).toLocaleString("ko-KR")}%`;
}

// 마진율: 판매가 대비 이익 비율 (마진율 30% = 판매가의 30%가 남는 돈)
function MarginCalc() {
  const [mode, setMode] = useState("price");
  const [cost, costRaw, onCostChange] = useNumberInput("8000");
  const [margin, marginRaw, onMarginChange] = useNumberInput("30");
  const [sell, sellRaw, onSellChange] = useNumberInput("12000");
  const okMargin = margin < 100;
  const price = okMargin ? cost / (1 - margin / 100) : 0;
  const myMargin = sell > 0 ? ((sell - cost) / sell) * 100 : 0;
  return (
    <div>
      <CalcModeSwitch value={mode} onChange={setMode} options={[{ key: "price", label: "판매가 정하기" }, { key: "check", label: "내 마진 확인" }]} />
      <CalcNumberField label="상품 원가" value={costRaw} onChange={onCostChange} placeholder="8,000" suffix="원" hint="재료비·포장비 등 1개를 만드는 데 드는 돈" />
      {mode === "price" ? (
        <>
          <CalcNumberField label="목표 마진율" value={marginRaw} onChange={onMarginChange} placeholder="30" suffix="%" hint="판매가 중 남기고 싶은 비율" />
          {!okMargin && <CalcNotice>마진율은 100%보다 작아야 해요.</CalcNotice>}
          <CalcResultCard
            title="판매가 계산 결과"
            rows={[
              { label: "판매가 (부가세 별도)", value: won(price), primary: true },
              { label: "소비자가 (부가세 10% 포함)", value: won(price * 1.1) },
              { label: "1개 팔 때 남는 돈", value: won(price - cost), tone: "red" },
            ]}
          />
        </>
      ) : (
        <>
          <CalcNumberField label="현재 판매가 (부가세 별도)" value={sellRaw} onChange={onSellChange} placeholder="12,000" suffix="원" />
          {sell > 0 && sell < cost && <CalcNotice>판매가가 원가보다 낮아요. 팔수록 손해예요.</CalcNotice>}
          <CalcResultCard
            title="마진 확인 결과"
            rows={[
              { label: "마진율 (판매가 대비)", value: pct(myMargin), primary: true },
              { label: "1개 팔 때 남는 돈", value: won(sell - cost), tone: sell < cost ? "red" : undefined },
              { label: "원가 대비 이익률", value: cost > 0 ? pct(((sell - cost) / cost) * 100) : "-" },
            ]}
          />
        </>
      )}
    </div>
  );
}

// 손익분기점: 한 달 고정비를 다 갚으려면 얼마를 팔아야 하는지
function BreakEvenCalc() {
  const [fixed, fixedRaw, onFixedChange] = useNumberInput("5000000");
  const [costRate, costRateRaw, onCostRateChange] = useNumberInput("35");
  const [ticket, ticketRaw, onTicketChange] = useNumberInput("15000");
  const [days, daysRaw, onDaysChange] = useNumberInput("26");
  const ok = costRate < 100;
  const monthly = ok ? fixed / (1 - costRate / 100) : 0;
  const daily = days > 0 ? monthly / days : 0;
  const customers = ticket > 0 ? Math.ceil(daily / ticket) : 0;
  return (
    <div>
      <CalcNumberField label="한 달 고정비" value={fixedRaw} onChange={onFixedChange} placeholder="5,000,000" suffix="원" hint="월세·인건비·관리비·대출이자 등 매달 나가는 돈" />
      <CalcNumberField label="원가율 (변동비 비율)" value={costRateRaw} onChange={onCostRateChange} placeholder="35" suffix="%" hint="매출 중 재료비·카드수수료 등으로 나가는 비율" />
      <div className="grid grid-cols-2 gap-2.5">
        <CalcNumberField label="손님 1명 평균 결제" value={ticketRaw} onChange={onTicketChange} placeholder="15,000" suffix="원" />
        <CalcNumberField label="한 달 영업일" value={daysRaw} onChange={onDaysChange} placeholder="26" suffix="일" />
      </div>
      {!ok && <CalcNotice>원가율은 100%보다 작아야 해요.</CalcNotice>}
      <CalcResultCard
        title="손익분기점"
        rows={[
          { label: "한 달 최소 매출", value: won(monthly), primary: true },
          { label: "하루 최소 매출", value: won(daily) },
          { label: "하루 필요한 손님", value: `${customers.toLocaleString("ko-KR")}명`, tone: "red" },
        ]}
      />
    </div>
  );
}

function VatSplitCalc() {
  const [mode, setMode] = useState("split");
  const [total, totalRaw, onTotalChange] = useNumberInput("110000");
  const [supplyIn, supplyRaw, onSupplyChange] = useNumberInput("100000");
  const supply = total / 1.1;
  return (
    <div>
      <CalcModeSwitch value={mode} onChange={setMode} options={[{ key: "split", label: "합계에서 쪼개기" }, { key: "add", label: "공급가에 더하기" }]} />
      {mode === "split" ? (
        <>
          <CalcNumberField label="합계 금액 (부가세 포함)" value={totalRaw} onChange={onTotalChange} placeholder="110,000" suffix="원" hint="카드 매출·영수증 금액처럼 부가세가 들어간 금액" />
          <CalcResultCard
            title="부가세 쪼개기"
            rows={[
              { label: "부가세 (10%)", value: won(total - supply), primary: true },
              { label: "공급가액", value: won(supply) },
            ]}
          />
        </>
      ) : (
        <>
          <CalcNumberField label="공급가액 (부가세 별도)" value={supplyRaw} onChange={onSupplyChange} placeholder="100,000" suffix="원" hint="견적서·세금계산서의 공급가액" />
          <CalcResultCard
            title="부가세 더하기"
            rows={[
              { label: "합계 금액", value: won(supplyIn * 1.1), primary: true },
              { label: "부가세 (10%)", value: won(supplyIn * 0.1) },
            ]}
          />
        </>
      )}
    </div>
  );
}

function WeeklyAllowanceCalc() {
  const [wage, wageRaw, onWageChange] = useNumberInput("10320");
  const [hours, hoursRaw, onHoursChange] = useNumberInput("20");
  const eligible = hours >= 15;
  const allowance = eligible ? (Math.min(hours, 40) / 40) * 8 * wage : 0;
  const monthly = allowance * (365 / 7 / 12);
  return (
    <div>
      <CalcNumberField label="시급" value={wageRaw} onChange={onWageChange} placeholder="10,320" suffix="원" hint={`2026년 최저시급 ${MIN_WAGE_2026.toLocaleString("ko-KR")}원`} />
      <CalcNumberField label="1주 근무시간" value={hoursRaw} onChange={onHoursChange} placeholder="20" suffix="시간" />
      {!eligible && <CalcNotice>1주 15시간 미만 근무는 주휴수당 지급 대상이 아니에요.</CalcNotice>}
      {wage > 0 && wage < MIN_WAGE_2026 && <CalcNotice>입력한 시급이 2026년 최저시급보다 낮아요.</CalcNotice>}
      <CalcResultCard
        title="주휴수당"
        rows={[
          { label: "주휴수당 (1주)", value: won(allowance), primary: true },
          { label: "한 달 주휴수당 (약 4.35주)", value: won(monthly) },
          { label: "한 달 급여 합계 (주휴 포함)", value: won(wage * hours * (365 / 7 / 12) + monthly) },
        ]}
      />
    </div>
  );
}

function LoanInterestCalc() {
  const [principal, principalRaw, onPrincipalChange] = useNumberInput("30000000");
  const [rate, rateRaw, onRateChange] = useNumberInput("4.5");
  const [months, monthsRaw, onMonthsChange] = useNumberInput("24");
  const [method, setMethod] = useState("equalPI");
  const r = rate / 100 / 12;
  const n = Math.max(1, Math.round(months));
  // 만기일시: 매달 이자만, 만기에 원금
  const bulletMonthly = principal * r;
  // 원리금균등: 매달 같은 금액
  const piMonthly = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  // 원금균등: 원금은 매달 같고 이자는 줄어듦
  const pFirst = principal / n + principal * r;
  const pTotalInterest = (principal * r * (n + 1)) / 2;
  const results = {
    equalPI: { first: piMonthly, interest: piMonthly * n - principal, label: "매달 갚는 돈 (같은 금액)" },
    equalP: { first: pFirst, interest: pTotalInterest, label: "첫 달 갚는 돈 (점점 줄어요)" },
    bullet: { first: bulletMonthly, interest: bulletMonthly * n, label: "매달 이자" },
  };
  const cur = results[method];
  return (
    <div>
      <CalcNumberField label="대출 원금" value={principalRaw} onChange={onPrincipalChange} placeholder="30,000,000" suffix="원" />
      <div className="grid grid-cols-2 gap-2.5">
        <CalcNumberField label="연 이자율" value={rateRaw} onChange={onRateChange} placeholder="4.5" suffix="%" />
        <CalcNumberField label="대출 기간" value={monthsRaw} onChange={onMonthsChange} placeholder="24" suffix="개월" />
      </div>
      <p className="text-[13px] font-semibold mb-1.5" style={{ color: TEXT }}>상환 방식</p>
      <CalcModeSwitch
        value={method}
        onChange={setMethod}
        options={[
          { key: "equalPI", label: "원리금균등" },
          { key: "equalP", label: "원금균등" },
          { key: "bullet", label: "만기일시" },
        ]}
      />
      <CalcResultCard
        title="대출이자 계산"
        rows={[
          { label: cur.label, value: won(cur.first), primary: true },
          { label: `총 이자 (${n}개월)`, value: won(cur.interest), tone: "red" },
          { label: "총 갚는 돈", value: won(principal + cur.interest) },
        ]}
      />
      {/* 세 방식 총 이자 비교 */}
      <div className="rounded-[18px] mt-3 overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <p className="text-[12px] font-bold px-3.5 py-2" style={{ background: INPUT_BG, color: MUTED }}>상환 방식별 총 이자 비교</p>
        {[
          ["원금균등", results.equalP.interest],
          ["원리금균등", results.equalPI.interest],
          ["만기일시", results.bullet.interest],
        ].map(([k, v], i) => (
          <div key={k} className="flex items-center justify-between px-3.5 py-2.5" style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
            <span className="text-[12.5px]" style={{ color: TEXT }}>{k}{i === 0 && <span className="ml-1 text-[11px] font-bold" style={{ color: GREEN }}>이자 가장 적음</span>}</span>
            <span className="text-[12.5px] font-bold tabular-nums" style={{ color: TEXT }}>{won(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2026년 요율: 국민연금 9.5%(각 4.75%), 건강보험 7.19%(각 3.595%), 장기요양 = 건보료×13.14%,
// 고용보험 근로자 0.9%·사업주 1.15%(150인 미만), 산재 = 도소매·음식·숙박업 0.8% + 출퇴근 0.06%
function InsuranceCalc() {
  const [pay, payRaw, onPayChange] = useNumberInput("2500000");
  const cut10 = (v) => Math.floor(v / 10) * 10; // 보험료는 10원 미만을 버려요
  // 국민연금: 기준소득월액(천원 미만 버림)에 상·하한 적용 — 2026.7~2027.6 하한 41만원·상한 659만원
  const pensionBase = Math.min(6590000, Math.max(410000, Math.floor(pay / 1000) * 1000));
  const pension = pay > 0 ? cut10(pensionBase * 0.0475) : 0;
  // 건강보험: 전체 7.19%를 계산해 반씩 / 장기요양: 건강보험료의 13.14%를 반씩
  const healthTotal = cut10(pay * 0.0719);
  const health = cut10(healthTotal / 2);
  const ltc = cut10(cut10(healthTotal * 0.1314) / 2);
  // 고용보험: 실업급여 각 0.9% + 사장님만 고용안정·직업능력개발 0.25%(150인 미만)
  const empWorker = cut10(pay * 0.009);
  const empEmployer = cut10(pay * 0.0115);
  // 산재보험: 전액 사장님 부담 — 도소매·음식·숙박업 0.8% + 출퇴근재해 0.06%
  const injury = cut10(pay * 0.0086);
  const workerTotal = pension + health + ltc + empWorker;
  const employerTotal = pension + health + ltc + empEmployer + injury;
  const breakdown = [
    { label: "국민연금", worker: pension, employer: pension },
    { label: "건강보험", worker: health, employer: health },
    { label: "장기요양보험", worker: ltc, employer: ltc },
    { label: "고용보험", worker: empWorker, employer: empEmployer },
    { label: "산재보험", worker: 0, employer: injury },
  ];
  return (
    <div>
      <CalcNumberField label="직원 월 급여 (세전)" value={payRaw} onChange={onPayChange} placeholder="2,500,000" suffix="원" />
      <div className="rounded-[18px] overflow-hidden mb-3.5" style={{ border: `1px solid ${BORDER}` }}>
        <div className="grid grid-cols-3 px-3.5 py-2" style={{ background: INPUT_BG }}>
          <span className="text-[11.5px] font-semibold" style={{ color: MUTED }}>항목</span>
          <span className="text-[11.5px] font-semibold text-right" style={{ color: MUTED }}>직원 부담</span>
          <span className="text-[11.5px] font-semibold text-right" style={{ color: MUTED }}>사장님 부담</span>
        </div>
        {breakdown.map((row, i) => (
          <div key={row.label} className="grid grid-cols-3 px-3.5 py-2.5" style={i > 0 ? { borderTop: `1px solid ${BORDER}` } : {}}>
            <span className="text-[12.5px] font-medium" style={{ color: TEXT }}>{row.label}</span>
            <span className="text-[12.5px] text-right tabular-nums" style={{ color: row.worker > 0 ? TEXT : MUTED }}>{row.worker > 0 ? won(row.worker) : "-"}</span>
            <span className="text-[12.5px] text-right tabular-nums" style={{ color: TEXT }}>{won(row.employer)}</span>
          </div>
        ))}
      </div>
      <CalcResultCard
        title="4대보험료"
        rows={[
          { label: "사장님 실제 인건비 (월)", value: won(pay + employerTotal), primary: true },
          { label: "사장님 부담 보험료", value: won(employerTotal), tone: "red" },
          { label: "직원 월급에서 빠지는 보험료", value: won(workerTotal) },
        ]}
      />
      <p className="text-[11px] mt-3 leading-relaxed" style={{ color: MUTED }}>
        * 2026년 요율 기준이에요. 국민연금 각 4.75%(월 소득 41만~659만원 구간에만 적용), 건강보험 각 3.595%, 장기요양 건강보험료의 13.14%, 고용보험 직원 0.9%·사장님 1.15%(150인 미만), 산재보험 사장님만 0.86%(도소매·음식·숙박업, 업종마다 달라요). 실제 고지서와 몇십 원 차이가 날 수 있어요.
      </p>
    </div>
  );
}

// 퇴직금: 1년 이상 일한 직원(주 15시간 이상)에게 1년마다 30일분 평균임금
function SeveranceCalc() {
  const [pay, payRaw, onPayChange] = useNumberInput("2500000");
  const [years, yearsRaw, onYearsChange] = useNumberInput("2");
  const [extraMonths, monthsRaw, onMonthsChange] = useNumberInput("6");
  const totalMonths = years * 12 + extraMonths;
  const eligible = totalMonths >= 12;
  const dailyAvg = (pay * 3) / 91; // 퇴직 전 3개월 임금 ÷ 그 기간 일수(약 91일)
  const workDays = totalMonths * (365 / 12);
  const severance = eligible ? dailyAvg * 30 * (workDays / 365) : 0;
  return (
    <div>
      <CalcNumberField label="최근 3개월 평균 월급 (세전)" value={payRaw} onChange={onPayChange} placeholder="2,500,000" suffix="원" hint="기본급 + 매달 주는 수당 (주휴수당 포함)" />
      <p className="text-[13px] font-semibold mb-1.5" style={{ color: TEXT }}>일한 기간</p>
      <div className="grid grid-cols-2 gap-2.5">
        <CalcNumberField label="" value={yearsRaw} onChange={onYearsChange} placeholder="2" suffix="년" />
        <CalcNumberField label="" value={monthsRaw} onChange={onMonthsChange} placeholder="6" suffix="개월" />
      </div>
      {!eligible ? (
        <CalcNotice>1년 미만 일한 직원은 퇴직금 지급 대상이 아니에요.</CalcNotice>
      ) : (
        <CalcNotice tone="green">1년 이상, 주 15시간 이상 일했다면 퇴직금을 줘야 해요. 퇴사 후 14일 안에 지급해요.</CalcNotice>
      )}
      <CalcResultCard
        title="퇴직금"
        rows={[
          { label: "예상 퇴직금", value: won(severance), primary: true },
          { label: "1일 평균임금", value: won(dailyAvg) },
          { label: "일한 기간", value: `${Math.floor(totalMonths / 12)}년 ${Math.round(totalMonths % 12)}개월` },
        ]}
      />
      <p className="text-[11px] mt-3 leading-relaxed" style={{ color: MUTED }}>
        * 상여금·연차수당은 빠진 간편 계산이에요. 정확한 금액은 고용노동부 퇴직금 계산기(moel.go.kr)에서 확인하세요.
      </p>
    </div>
  );
}

function CardFeeCalc() {
  const [amount, amountRaw, onAmountChange] = useNumberInput("10000000");
  const [rate, rateRaw, onRateChange] = useNumberInput("1.5");
  const fee = amount * (rate / 100);
  return (
    <div>
      <CalcNumberField label="카드 매출 (한 달)" value={amountRaw} onChange={onAmountChange} placeholder="10,000,000" suffix="원" />
      <CalcNumberField label="카드수수료율" value={rateRaw} onChange={onRateChange} placeholder="1.5" suffix="%" hint="영세가맹점(연매출 3억 이하) 신용카드 0.4%대" />
      <CalcResultCard
        title="카드수수료"
        rows={[
          { label: "실제 입금액", value: won(amount - fee), primary: true },
          { label: "한 달 카드수수료", value: won(fee), tone: "red" },
          { label: "1년이면", value: won(fee * 12) },
        ]}
      />
    </div>
  );
}

const MIN_WAGE_2026 = 10320;
function MinWageCheckCalc() {
  const [mode, setMode] = useState("hourly");
  const [wage, wageRaw, onWageChange] = useNumberInput("10320");
  const [weekHours, weekRaw, onWeekChange] = useNumberInput("40");
  const [pay, payRaw, onPayChange] = useNumberInput("2156880");
  const [hours, hoursRaw, onHoursChange] = useNumberInput("209");
  const MW = MIN_WAGE_2026.toLocaleString("ko-KR");

  if (mode === "hourly") {
    // 주 15시간 이상이면 주휴시간(주 근무시간 ÷ 5, 최대 8시간)을 더해 월 소정근로시간을 구해요
    const juhu = weekHours >= 15 ? Math.min(weekHours, 40) / 5 : 0;
    const monthHours = Math.round((weekHours + juhu) * (365 / 7 / 12)); // 주 40시간 → 209시간 (고용노동부 기준과 같게 반올림)
    const ok = wage >= MIN_WAGE_2026;
    return (
      <div>
        <CalcModeSwitch value={mode} onChange={setMode} options={[{ key: "hourly", label: "시급으로 확인" }, { key: "monthly", label: "월급으로 확인" }]} />
        <CalcNumberField label="시급" value={wageRaw} onChange={onWageChange} placeholder="10,320" suffix="원" />
        <CalcNumberField label="1주 근무시간" value={weekRaw} onChange={onWeekChange} placeholder="40" suffix="시간" hint="주 15시간 이상이면 주휴수당이 붙어요" />
        <CalcNotice tone={ok ? "green" : "red"}>
          {ok
            ? `2026년 최저시급(${MW}원) 이상이에요.`
            : `2026년 최저시급(${MW}원)보다 시간당 ${won(MIN_WAGE_2026 - wage)} 적어요. 최저임금 위반 소지가 있어요.`}
        </CalcNotice>
        <CalcResultCard
          title="최저임금 체크 (시급)"
          rows={[
            { label: "한 달 줘야 할 월급 (주휴 포함)", value: won(wage * monthHours), primary: true },
            { label: "월 소정근로시간 (주휴 포함)", value: `${monthHours}시간` },
            { label: "최저임금 기준 월급", value: won(MIN_WAGE_2026 * monthHours) },
            ...(!ok ? [{ label: "한 달 부족한 금액", value: won((MIN_WAGE_2026 - wage) * monthHours), tone: "red" }] : []),
          ]}
        />
      </div>
    );
  }

  const effectiveWage = hours > 0 ? pay / hours : 0;
  const isViolation = effectiveWage < MIN_WAGE_2026;
  return (
    <div>
      <CalcModeSwitch value={mode} onChange={setMode} options={[{ key: "hourly", label: "시급으로 확인" }, { key: "monthly", label: "월급으로 확인" }]} />
      <CalcNumberField label="월 급여 (세전)" value={payRaw} onChange={onPayChange} placeholder="2,156,880" suffix="원" />
      <CalcNumberField label="월 소정근로시간" value={hoursRaw} onChange={onHoursChange} placeholder="209" suffix="시간" hint="주 40시간이면 주휴 포함 209시간" />
      <CalcNotice tone={isViolation ? "red" : "green"}>
        {isViolation ? `2026년 최저시급(${MW}원)보다 낮아요. 최저임금 위반 소지가 있어요.` : `2026년 최저시급(${MW}원) 이상으로 지급하고 있어요.`}
      </CalcNotice>
      <CalcResultCard
        title="최저임금 체크 (월급)"
        rows={[
          { label: "환산 시급", value: won(effectiveWage), primary: true },
          { label: "최저임금 기준 월급", value: won(MIN_WAGE_2026 * hours) },
          ...(isViolation ? [{ label: "한 달 부족한 금액", value: won((MIN_WAGE_2026 - effectiveWage) * hours), tone: "red" }] : []),
        ]}
      />
    </div>
  );
}

const CALC_TABS = [
  { key: "margin", label: "마진율·판매가", short: "마진·판매가", Icon: Tag, color: "#3D63DD", Comp: MarginCalc },
  { key: "breakeven", label: "손익분기점", short: "손익분기점", Icon: Target, color: "#E5674D", Comp: BreakEvenCalc },
  { key: "vat", label: "부가세 계산", short: "부가세", Icon: Receipt, color: "#2C9F6B", Comp: VatSplitCalc },
  { key: "loan", label: "대출이자", short: "대출이자", Icon: Landmark, color: "#7A46D6", Comp: LoanInterestCalc },
  { key: "insurance", label: "4대보험료", short: "4대보험", Icon: ShieldCheck, color: "#0E9AA7", Comp: InsuranceCalc },
  { key: "allowance", label: "주휴수당", short: "주휴수당", Icon: CalendarDays, color: "#D6478E", Comp: WeeklyAllowanceCalc },
  { key: "severance", label: "퇴직금", short: "퇴직금", Icon: Briefcase, color: "#B8862A", Comp: SeveranceCalc },
  { key: "cardfee", label: "카드수수료", short: "카드수수료", Icon: CreditCard, color: "#4F6FE0", Comp: CardFeeCalc },
  { key: "minwage", label: "최저임금 체크", short: "최저임금", Icon: BadgeCheck, color: "#C2410C", Comp: MinWageCheckCalc },
];
const CALC_TIPS = {
  margin: [
    "마진율은 '판매가 대비' 비율이에요. 원가 8,000원에 마진 30%면 판매가는 10,400원이 아니라 11,429원이에요.",
    "배달앱 판매라면 중개수수료(약 6~10%)와 배달비까지 원가에 넣어야 실제로 남는 돈이 보여요.",
  ],
  breakeven: [
    "손익분기점보다 적게 팔면 적자, 많이 팔면 흑자예요. 고정비를 줄이면 손익분기점이 바로 내려가요.",
    "사장님 본인 인건비(생활비)도 고정비에 넣어야 '실제로 버는' 기준을 알 수 있어요.",
  ],
  vat: [
    "일반과세자는 공급가액의 10%가 부가세예요. 간이과세자는 업종별 부가율이 적용돼서 계산이 달라요.",
    "카드 매출은 부가세가 포함된 금액으로 들어와요. 부가세는 내 돈이 아니니 따로 모아두세요.",
  ],
  loan: [
    "총 이자는 원금균등 < 원리금균등 < 만기일시 순으로 많아져요. 대신 원금균등은 초반에 갚는 돈이 커요.",
    "정책자금은 시중은행보다 금리가 낮은 편이에요. 금리·환율 화면에서 비교해보세요.",
  ],
  insurance: [
    "직원 월급 외에 사장님이 약 10%를 더 부담해요. 채용 전에 '실제 인건비'로 계산해보세요.",
    <span key="duru">
      <strong>두루누리 사회보험료 지원</strong> — 직원 10명 미만 사업장에서 월급 270만원 미만 신규 직원은 고용보험·국민연금 최대 80%를 지원받을 수 있어요.{" "}
      <a href="https://www.4insure.or.kr" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: "#8A6520" }}>
        4대사회보험정보연계센터
      </a>
      에서 신청하세요.
    </span>,
  ],
  allowance: [
    "주 15시간 이상 일하고 정해진 근무일을 다 채운 직원에게 주휴수당을 줘야 해요.",
    "주휴수당을 빼먹으면 최저임금 위반이 될 수 있어요. 최저임금 체크로도 같이 확인하세요.",
  ],
  severance: [
    "아르바이트도 1년 이상, 주 15시간 이상 일했다면 퇴직금 대상이에요.",
    "매달 퇴직금을 월급에 나눠 주는 건 원칙적으로 인정되지 않아요. 퇴직연금(IRP 등)을 활용하면 부담을 나눌 수 있어요.",
  ],
  cardfee: [
    <span key="crefia">
      영세·중소 가맹점은 우대 수수료율이 적용돼요. 내 가맹점 등급은{" "}
      <a href="https://gongsi.crefia.or.kr" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: "#8A6520" }}>
        여신금융협회 공시정보 포털
      </a>
      에서 확인하세요.
    </span>,
    "카드수수료 지원사업을 하는 지자체도 있어요. 지원금 목록에서 '고정비'를 찾아보세요.",
  ],
  minwage: [
    "2026년 최저시급은 10,320원, 주 40시간 기준 월 2,156,880원이에요.",
    "위반하면 3년 이하 징역 또는 2천만원 이하 벌금 대상이라 꼭 미리 확인하세요.",
  ],
};
const CALC_TAB_KEY = "calcTab";

function CalculatorToolkit({ onBack }) {
  const [tab, setTabState] = useState(() => {
    try {
      const saved = localStorage.getItem(CALC_TAB_KEY);
      return CALC_TABS.some((t) => t.key === saved) ? saved : "margin";
    } catch (e) {
      return "margin";
    }
  });
  const setTab = (k) => {
    setTabState(k);
    try {
      localStorage.setItem(CALC_TAB_KEY, k);
    } catch (e) {
      // 저장 안 돼도 괜찮아요
    }
  };
  const active = CALC_TABS.find((t) => t.key === tab);
  const Active = active.Comp;
  const tips = CALC_TIPS[tab] || [];
  const cardRef = useRef(null);

  return (
    <div>
      <HeroHeader icon={Calculator} color={BLUE} title="사장님 필수 계산기" subtitle="가격 정하기부터 인건비·대출까지 자주 쓰는 계산을 바로 해보세요" onBack={onBack} />

      {/* 계산기 고르기 */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
        {CALC_TABS.map((t) => {
          const on = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
              }}
              aria-label={t.label}
              className="flex flex-col items-center gap-1.5 py-3 rounded-[18px] transition-colors active:scale-[0.97]"
              style={on ? { background: `${t.color}14`, border: `1.5px solid ${t.color}66` } : { ...CARD }}
            >
              <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: on ? t.color : `${t.color}14` }}>
                <t.Icon size={18} color={on ? "white" : t.color} strokeWidth={2.2} />
              </span>
              <span className="text-[11.5px] font-semibold" style={{ color: on ? t.color : TEXT }}>{t.short}</span>
            </button>
          );
        })}
      </div>

      <div ref={cardRef} key={tab} className="rounded-[22px] p-4 scroll-mt-4" style={{ ...CARD, animation: "calcFadeIn 0.2s ease" }}>
        <style>{`@keyframes calcFadeIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${active.color}14` }}>
            <active.Icon size={16} color={active.color} strokeWidth={2.2} />
          </span>
          <p className="text-[16px] font-bold" style={{ color: TEXT }}>{active.label}</p>
        </div>
        <Active />
      </div>

      {tips.length > 0 && (
        <div className="relative overflow-hidden rounded-[20px] p-4 mt-3" style={{ background: "#FFFBF0" }}>
          <div className="absolute -right-6 -bottom-8 w-24 h-24 rounded-full" style={{ background: "rgba(217,166,46,0.08)" }} />
          <div className="relative flex items-center gap-1.5 mb-2.5">
            <Lightbulb size={14} color="#B8862A" />
            <p className="text-[13px] font-bold" style={{ color: "#8A6520" }}>알아두면 좋아요</p>
          </div>
          <ul className="relative space-y-2">
            {tips.map((t, i) => (
              <li key={i} className="text-[12.5px] leading-relaxed flex items-start gap-1.5 break-keep" style={{ color: "#6B5220" }}>
                <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ background: "#B8862A" }} />
                <span>{t}</span>
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

// 뉴스 상세 화면 — 핵심 요약을 보여주고, 원문은 인앱 브라우저로 열어요
// (기업마당 등 많은 사이트가 다른 앱 안에 끼워 보여주는 걸 막아서, 화면 안 미리보기는 쓰지 않아요)
function NewsDetailScreen({ news, allNews, onBack, onSelectNews }) {
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

      <div className="relative h-[200px] rounded-[24px] overflow-hidden mb-1.5" style={{ border: "1px solid #EEF0F6" }}>
        <NewsImage news={news} className="absolute inset-0 w-full h-full" />
      </div>
      {news.image && <p className="text-[10.5px] text-right mb-4" style={{ color: MUTED }}>사진 출처: {news.imageSource || news.source}</p>}
      {!news.image && <div className="mb-4" />}

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

      <p className="text-[13px] font-bold mb-2" style={{ color: TEXT }}>원문 기사</p>
      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-[20px] p-4 mb-6 flex items-center gap-3 active:scale-[0.99] transition-transform"
        style={CARD}
      >
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: style.bg }}>
          <Newspaper size={20} color={style.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-bold truncate" style={{ color: TEXT }}>{news.source}</p>
          <p className="text-[11.5px] truncate" style={{ color: MUTED }}>{domain}</p>
        </div>
        <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-[12.5px] font-bold shrink-0" style={BTN_PRIMARY}>
          원문 보기 <ExternalLink size={12} />
        </span>
      </a>

      {related.length > 0 && (
        <>
          <p className="text-[14px] font-bold mb-2.5" style={{ color: TEXT }}>같은 카테고리 다른 뉴스</p>
          <div className="space-y-2">
            {related.map((n) => (
              <button
                key={n.id}
                onClick={() => onSelectNews(n)}
                className="w-full text-left rounded-[20px] p-3 flex items-center justify-between gap-2"
                style={CARD}
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
  const [statusFilter, setStatusFilter] = useState("available");
  const [sortBy, setSortBy] = useState("deadline");
  const [newsCategory, setNewsCategory] = useState("전체");
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [rateAlertOn, setRateAlertOn] = useState(false); // 한국은행 기준금리 발표일 알림
  const [taxAlertOn, setTaxAlertOn] = useState(false); // 세금 신고·납부일 알림
  const [taxStaff, setTaxStaff] = useState(false); // 직원 관련 세금(원천세·4대보험)도 알릴지
  const [alertPlan, setAlertPlan] = useState("normal"); // 마감 며칠 전부터 알릴지
  const [alertHour, setAlertHour] = useState(9); // 몇 시에 알릴지
  const [scheduledAlerts, setScheduledAlerts] = useState([]); // MY 화면 미리보기용
  const [homeUpcoming, setHomeUpcoming] = useState(() => {
    try {
      return localStorage.getItem("homeUpcoming") === "mine" ? "mine" : "subsidy";
    } catch (e) {
      return "subsidy";
    }
  });
  const setHomeUpcomingSaved = (v) => {
    setHomeUpcoming(v);
    try {
      localStorage.setItem("homeUpcoming", v);
    } catch (e) {
      // 저장이 안 돼도 괜찮아요
    }
  };
  const [myEvents, setMyEvents] = useState([]); // 사장님이 직접 등록한 일정 (월급날·임대료 등)
  const [nickname, setNickname] = useState(""); // 처음 실행 때 입력한 이름
  const [onboardDone, setOnboardDone] = useState(false);
  const callName = callNameOf(nickname);
  // 좁은 자리(홈 타일·전환 버튼)에는 긴 이름 대신 "내"를 써요 (예: 김사장가게님 → 내 일정)
  const shortCall = callName.length <= 4 ? callName : "내";
  const [notifyIds, setNotifyIds] = useState(new Set());
  const [diagnosis, setDiagnosis] = useState(null); // { region, revenueBand, yearsBand } | null
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState({ region: null, revenueBand: null, yearsBand: null });

  // 화면을 옮길 때 스크롤 위치 관리: 새 화면은 맨 위에서 시작하고,
  // 하단 탭 화면(홈·즐겨찾기·뉴스·MY)으로 돌아오면 보던 위치를 이어서 보여줘요
  const scrollKey = screen.view === "home" ? `tab:${mainTab}:${homeScreen}` : `screen:${screen.view}`;
  const scrollKeyRef = useRef(scrollKey);
  const savedScrollRef = useRef({});
  useEffect(() => {
    const onScroll = () => {
      savedScrollRef.current[scrollKeyRef.current] = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useLayoutEffect(() => {
    if (scrollKeyRef.current === scrollKey) return;
    scrollKeyRef.current = scrollKey;
    const restore = scrollKey.startsWith("tab:") ? savedScrollRef.current[scrollKey] || 0 : 0;
    window.scrollTo(0, restore);
  }, [scrollKey]);

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

  // 날짜가 바뀐 뒤 앱으로 돌아오면 D-day·마감 여부·알림 예약을 새 날짜로 다시 계산해요
  const [dayKey, setDayKey] = useState(() => TODAY.getTime());
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && refreshToday()) setDayKey(TODAY.getTime());
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

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
          if (typeof data.rateAlertOn === "boolean") setRateAlertOn(data.rateAlertOn);
          if (typeof data.taxAlertOn === "boolean") setTaxAlertOn(data.taxAlertOn);
          if (typeof data.taxStaff === "boolean") setTaxStaff(data.taxStaff);
          if (ALERT_PLANS[data.alertPlan]) setAlertPlan(data.alertPlan);
          if (ALERT_HOURS.some((x) => x.h === data.alertHour)) setAlertHour(data.alertHour);
          if (Array.isArray(data.myEvents)) setMyEvents(data.myEvents);
          if (typeof data.nickname === "string") setNickname(data.nickname);
          if (data.onboardDone) setOnboardDone(true);
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
            rateAlertOn,
            taxAlertOn,
            taxStaff,
            alertPlan,
            alertHour,
            myEvents,
            nickname,
            onboardDone,
            region,
            diagnosis,
          }),
          false
        );
      } catch (e) {
        // 저장 실패해도 앱 사용에는 지장 없도록 조용히 넘어가요
      }
    })();
  }, [favorites, notifyIds, notifyEnabled, rateAlertOn, taxAlertOn, taxStaff, alertPlan, alertHour, myEvents, nickname, onboardDone, region, diagnosis, prefsLoaded]);

  // 실제 휴대폰 알림 예약: 설정이 바뀔 때마다 기존 예약을 모두 지우고 다시 예약해요
  useEffect(() => {
    if (!prefsLoaded) return;
    const list = buildAlertList({
      programs: notifyEnabled ? ALL_PROGRAMS.filter((p) => favorites.has(p.id) && notifyIds.has(p.id) && canNotify(p)) : [],
      taxOn: taxAlertOn,
      taxStaff,
      rateOn: rateAlertOn,
      plan: alertPlan,
      hour: alertHour,
      events: myEvents,
      name: callName,
    });
    setScheduledAlerts(list);
    if (!Capacitor.isNativePlatform()) return;
    (async () => {
      try {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length) {
          await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
        }
        if (!list.length) return;
        await LocalNotifications.schedule({
          notifications: list.map((n) => ({
            id: n.id,
            title: n.title,
            body: n.body,
            schedule: { at: n.at, allowWhileIdle: true },
            // 정확한 시각 알람은 별도 권한 화면이 떠서, 몇 분 오차가 있어도 되는 일반 알람으로 예약해요
            isExactNotification: false,
            smallIcon: "ic_stat_notify",
            iconColor: BLUE,
            extra: n.extra,
          })),
        });
      } catch (e) {
        // 알림 예약에 실패해도 앱 사용에는 지장 없도록 조용히 넘어가요
      }
    })();
  }, [notifyEnabled, rateAlertOn, taxAlertOn, taxStaff, alertPlan, alertHour, myEvents, callName, notifyIds, favorites, prefsLoaded, dayKey]);

  // 알림을 누르면 해당 지원금 상세 화면으로 바로 이동해요
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const handle = LocalNotifications.addListener("localNotificationActionPerformed", (action) => {
      const extra = action.notification?.extra || {};
      if (extra.screen === "exchange" || extra.screen === "taxSchedule") return setScreen({ view: extra.screen });
      const id = extra.programId;
      if (id != null && ALL_PROGRAMS.some((p) => p.id === id)) setScreen({ view: "detail", id });
    });
    return () => {
      handle.then((h) => h.remove());
    };
  }, []);

  // 전체 알림 스위치: 켤 때 휴대폰 알림 권한을 요청하고, 거부되면 다시 꺼요
  // 알림을 켤 때 휴대폰 알림 권한을 요청하고, 거부되면 켜지 않아요
  const ensureNotifyPermission = async () => {
    if (!Capacitor.isNativePlatform()) return true;
    try {
      let perm = await LocalNotifications.checkPermissions();
      if (perm.display !== "granted") perm = await LocalNotifications.requestPermissions();
      if (perm.display === "granted") return true;
      alert("알림 권한이 꺼져 있어요. 휴대폰 설정 → 애플리케이션 → 지원금알리미 → 알림에서 허용해 주세요.");
      return false;
    } catch (e) {
      return true;
    }
  };
  const makeToggle = (value, setter) => async () => {
    if (value) return setter(false);
    if (await ensureNotifyPermission()) setter(true);
  };
  const toggleNotifyEnabled = makeToggle(notifyEnabled, setNotifyEnabled);
  const toggleRateAlert = makeToggle(rateAlertOn, setRateAlertOn);
  const toggleTaxAlert = makeToggle(taxAlertOn, setTaxAlertOn);
  const saveEvent = async (ev) => {
    if (ev.alert && !(await ensureNotifyPermission())) ev = { ...ev, alert: false };
    setMyEvents((prev) => (prev.some((x) => x.id === ev.id) ? prev.map((x) => (x.id === ev.id ? ev : x)) : [...prev, ev]));
  };
  const deleteEvent = (id) => setMyEvents((prev) => prev.filter((x) => x.id !== id));

  const toggleFavoriteId = (id) => {
    const adding = !favorites.has(id);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // 새로 즐겨찾기하면 🔔 알림도 기본으로 켜줘요 (즐겨찾기 탭에서 개별로 끌 수 있어요)
    const program = ALL_PROGRAMS.find((p) => p.id === id);
    if (adding && program && canNotify(program)) setNotifyIds((prev) => new Set(prev).add(id));
  };
  const [pickerStep, setPickerStep] = useState("province");
  const [tempProvince, setTempProvince] = useState(null);

  // 지역 선택은 다른 화면처럼 전체 화면으로 열려요 (뒤로가기 = 원래 화면)
  const openPicker = () => {
    setPickerStep("province");
    setScreen({ view: "regionPicker" });
  };
  const closePicker = () => setScreen({ view: "home" });

  const selectProvince = (p) => {
    if (p === "전체" || p === "전국" || !DISTRICTS[p]) {
      setRegion(p);
      return;
    }
    setTempProvince(p);
    setPickerStep("district");
  };

  const selectDistrict = (d) => {
    setRegion(d === "전체" ? tempProvince : `${tempProvince} ${d}`);
  };

  const filtered = useMemo(() => {
    return ALL_PROGRAMS.filter((p) => {
      const baseRegion = region.split(" ")[0];
      const matchesRegion = region === "전체" || (baseRegion === "전국" ? isNational(p) : availableIn(p, baseRegion));
      const matchesQuery =
        query.trim() === "" ||
        p.name.includes(query) ||
        p.category.includes(query) ||
        (typeof p.target === "string" && p.target.includes(query));
      const matchesCategory = category === "전체" || p.category === category;
      const matchesFavorite = !showFavoritesOnly || favorites.has(p.id);
      const dday = getDday(p.deadline);
      const matchesStatus =
        (statusFilter === "urgent" && dday <= 7 && dday >= 0) ||
        (statusFilter === "closed" && dday < 0) ||
        (statusFilter === "available" && dday >= 0);
      return matchesRegion && matchesQuery && matchesCategory && matchesFavorite && matchesStatus;
    }).sort((a, b) =>
      sortBy === "amount"
        ? parseAmount(b.amountLabel) - parseAmount(a.amountLabel)
        : byDeadline(a, b)
    );
  }, [query, region, category, showFavoritesOnly, favorites, sortBy, statusFilter, dayKey]);

  // 안드로이드 뒤로가기 버튼: 열린 창 닫기 → 이전 화면 → 홈 탭 → 그래도 홈이면 앱 종료
  const backRef = useRef(null);
  backRef.current = () => {
    if (screen.view === "regionPicker" && pickerStep === "district") return setPickerStep("province");
    if (screen.view !== "home") return setScreen({ view: "home" });
    if (homeScreen !== "hub") return setHomeScreen("hub");
    if (mainTab !== "home") return setMainTab("home");
    CapApp.exitApp();
  };
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const handle = CapApp.addListener("backButton", () => backRef.current());
    return () => {
      handle.then((h) => h.remove());
    };
  }, []);

  // 입력창에 포커스(키보드 올라옴) 중에는 하단 탭바를 숨겨서 키보드 위로 떠오르지 않게 해요
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const isField = (el) => el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
    const onIn = (e) => isField(e.target) && setTyping(true);
    const onOut = () => setTimeout(() => setTyping(isField(document.activeElement)), 0);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  const urgentCount = ALL_PROGRAMS.filter((p) => getDday(p.deadline) <= 7 && getDday(p.deadline) >= 0).length;
  const availableCount = ALL_PROGRAMS.filter((p) => getDday(p.deadline) >= 0).length; // 마감 임박(7일 이내)도 신청 가능에 포함
  const closedCount = ALL_PROGRAMS.length - availableCount;
  const categories = ["전체", ...Array.from(new Set(ALL_PROGRAMS.map((p) => p.category)))];

  if (screen.view === "detail") {
    const program = ALL_PROGRAMS.find((p) => p.id === screen.id);
    return (
      <Shell>
        {program.detailed ? (
          <DetailedGuide program={program} onBack={() => setScreen({ view: "home" })} favorites={favorites} onToggleFavorite={toggleFavoriteId} />
        ) : (
          <SimpleDetail program={program} onBack={() => setScreen({ view: "home" })} favorites={favorites} onToggleFavorite={toggleFavoriteId} />
        )}
      </Shell>
    );
  }

  if (screen.view === "exchange") {
    return (
      <Shell>
        <RateAndExchangeScreen onBack={() => setScreen({ view: "home" })} onOpenCalculator={() => setScreen({ view: "calculator" })} rateAlertOn={rateAlertOn} onToggleRateAlert={toggleRateAlert} />
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

  // 처음 실행: 이름 입력 (저장된 설정을 다 불러온 뒤에만 보여줘요)
  if (prefsLoaded && !onboardDone) {
    return (
      <Shell>
        <NicknameScreen
          firstRun
          onSave={(n) => {
            setNickname(n);
            setOnboardDone(true);
          }}
          onSkip={() => setOnboardDone(true)}
        />
      </Shell>
    );
  }

  if (screen.view === "nickname") {
    return (
      <Shell>
        <NicknameScreen
          initial={nickname}
          onBack={() => setScreen({ view: "home" })}
          onSave={(n) => {
            setNickname(n);
            setScreen({ view: "home" });
          }}
        />
      </Shell>
    );
  }

  if (screen.view === "regionPicker") {
    const regionText = region === "전체" || region === "전국" ? "지역 선택 안 함 (모든 지원금)" : `${region} (+ 전국 지원금)`;
    return (
      <Shell>
        <HeroHeader
          icon={MapPin}
          color={BLUE}
          title={pickerStep === "province" ? "내 지역 선택" : `${tempProvince} 세부 지역`}
          subtitle={pickerStep === "province" ? "사업장이 있는 지역을 고르면, 그 지역 지원금과 전국 지원금을 함께 보여드려요." : "시·군·구를 고르거나, 도 전체로 볼 수 있어요."}
          onBack={() => (pickerStep === "district" ? setPickerStep("province") : closePicker())}
        />

        <div className="rounded-[18px] px-4 py-3 mb-4 flex items-center gap-2" style={{ background: BLUE_SOFT }}>
          <CheckCircle2 size={15} color={BLUE} className="shrink-0" />
          <p className="text-[13px] font-semibold flex-1 min-w-0 truncate" style={{ color: BLUE }}>현재 선택: {regionText}</p>
        </div>

        {pickerStep === "province" ? (
          <>
            <button
              onClick={() => selectProvince("전체")}
              className="w-full py-3.5 rounded-2xl mb-4 flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
              style={region === "전체" || region === "전국" ? CHIP_ON : { ...CARD, color: TEXT }}
            >
              <span className="text-[14px] font-bold">지역 선택 안 함</span>
              <span className="text-[11.5px]" style={{ color: region === "전체" || region === "전국" ? "rgba(255,255,255,0.85)" : MUTED }}>· 모든 지원금 보기</span>
            </button>
            <p className="text-[12px] font-bold mb-2 px-0.5" style={{ color: MUTED }}>시·도</p>
            <div className="grid grid-cols-4 gap-2">
              {REGIONS.filter((r) => r !== "전체" && r !== "전국").map((r) => {
                const on = region === r || region.startsWith(r + " ");
                return (
                  <button key={r} onClick={() => selectProvince(r)} className="py-3 rounded-xl text-[14px] font-semibold active:scale-[0.97] transition-transform" style={on ? CHIP_ON : { background: "#F5F6FA", color: TEXT }}>
                    {r}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => selectDistrict("전체")} className="w-full py-3 rounded-2xl text-[14px] font-bold mb-3" style={region === tempProvince ? CHIP_ON : { background: BLUE_SOFT, color: BLUE }}>
              {tempProvince} 전체
            </button>
            <div className="grid grid-cols-3 gap-2">
              {DISTRICTS[tempProvince].map((d) => {
                const on = region === `${tempProvince} ${d}`;
                return (
                  <button key={d} onClick={() => selectDistrict(d)} className="py-3 rounded-xl text-[13.5px] font-semibold active:scale-[0.97] transition-transform" style={on ? CHIP_ON : { background: "#F5F6FA", color: TEXT }}>
                    {d}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] mt-4" style={{ color: MUTED }}>* 2026년 기준 행정구역이에요.</p>
          </>
        )}

        <button onClick={closePicker} className="w-full py-4 mt-6 rounded-2xl text-[14.5px] font-bold" style={BTN_PRIMARY}>
          완료
        </button>
      </Shell>
    );
  }

  if (screen.view === "alertSettings") {
    return (
      <Shell>
        <HeroHeader icon={Bell} color="#E5674D" title="알림 설정" subtitle="받을 알림과 며칠 전·몇 시에 알릴지 정해요" onBack={() => setScreen({ view: "home" })} />
        <div className="rounded-[20px] overflow-hidden" style={CARD}>
          {[
            { key: "deadline", icon: Bell, color: "#E5674D", bg: "#FDEEE9", title: "지원금 마감 알림", sub: "즐겨찾기에서 🔔 켠 지원금", on: notifyEnabled, toggle: toggleNotifyEnabled },
            { key: "tax", icon: CalendarCheck, color: "#2C9F6B", bg: "#E7F7EF", title: "세금 신고·납부일 알림", sub: "부가세·종합소득세 등", on: taxAlertOn, toggle: toggleTaxAlert },
            { key: "rate", icon: Landmark, color: BLUE, bg: BLUE_SOFT, title: "금리 발표일 알림", sub: "한국은행 기준금리 발표 당일", on: rateAlertOn, toggle: toggleRateAlert },
          ].map((r, i) => (
            <div key={r.key} style={{ borderTop: i > 0 ? "1px solid #F1F2F6" : "none" }}>
              <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: r.bg }}>
                    <r.icon size={17} color={r.color} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: TEXT }}>{r.title}</p>
                    <p className="text-[12px]" style={{ color: MUTED }}>{r.sub}</p>
                  </div>
                </div>
                <Switch checked={r.on} onChange={r.toggle} />
              </div>
              {r.key === "tax" && taxAlertOn && (
                <button onClick={() => setTaxStaff(!taxStaff)} className="flex items-center gap-2 px-4 pb-3.5 -mt-1 ml-[52px] text-left">
                  <span className="w-[18px] h-[18px] rounded-md flex items-center justify-center shrink-0" style={taxStaff ? { background: GREEN } : { border: "1.5px solid #C9CEDA" }}>
                    {taxStaff && <Check size={12} color="white" strokeWidth={3} />}
                  </span>
                  <span className="text-[12px]" style={{ color: TEXT }}>직원이 있어요 (원천세·4대보험도 알림)</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {(notifyEnabled || taxAlertOn) && (
          <div className="rounded-[20px] p-4 mt-2.5" style={CARD}>
            <p className="text-[13px] font-bold mb-2" style={{ color: TEXT }}>마감 며칠 전부터 알릴까요?</p>
            <CalcModeSwitch value={alertPlan} onChange={setAlertPlan} options={Object.entries(ALERT_PLANS).map(([key, v]) => ({ key, label: v.label }))} />
            <p className="text-[11.5px] -mt-2 mb-3.5 px-1" style={{ color: MUTED }}>{ALERT_PLANS[alertPlan].desc}</p>
            <p className="text-[13px] font-bold mb-2" style={{ color: TEXT }}>몇 시에 알릴까요?</p>
            <CalcModeSwitch value={String(alertHour)} onChange={(v) => setAlertHour(Number(v))} options={ALERT_HOURS.map((x) => ({ key: String(x.h), label: x.label }))} />
          </div>
        )}

        {Capacitor.isNativePlatform() && (notifyEnabled || taxAlertOn || rateAlertOn) && (
          <div className="rounded-[20px] p-4 mt-2.5" style={{ background: "#F6F7FA" }}>
            <p className="text-[12.5px] font-bold" style={{ color: TEXT }}>예약된 알림 {scheduledAlerts.length}개</p>
            {scheduledAlerts.length > 0 ? (
              <div className="mt-2 space-y-1.5">
                {scheduledAlerts.slice(0, 3).map((n) => (
                  <div key={n.id} className="flex items-center gap-2 text-[11.5px]">
                    <span className="font-semibold tabular-nums shrink-0" style={{ color: BLUE }}>
                      {n.at.getMonth() + 1}/{n.at.getDate()} {String(n.at.getHours()).padStart(2, "0")}:{String(n.at.getMinutes()).padStart(2, "0")}
                    </span>
                    <span className="truncate" style={{ color: "#5E6577" }}>{n.title}</span>
                  </div>
                ))}
                {scheduledAlerts.length > 3 && <p className="text-[11px]" style={{ color: MUTED }}>외 {scheduledAlerts.length - 3}개</p>}
              </div>
            ) : (
              <p className="text-[11.5px] mt-1 leading-relaxed" style={{ color: MUTED }}>
                {notifyEnabled && !taxAlertOn && !rateAlertOn ? "즐겨찾기 탭에서 지원금의 🔔를 켜면 마감 알림이 예약돼요." : "지금 예약할 알림이 없어요."}
              </p>
            )}
          </div>
        )}
        <p className="text-[11px] mb-5 mt-2 px-1 leading-relaxed" style={{ color: MUTED }}>
          {Capacitor.isNativePlatform()
            ? "휴대폰 절전 상태에 따라 알림이 몇 분~1시간 늦게 올 수 있어요."
            : "알림은 지원금알리미 앱(안드로이드)에서만 받을 수 있어요."}
        </p>
      </Shell>
    );
  }

  if (screen.view === "taxSchedule") {
    return (
      <Shell>
        <TaxScheduleScreen
          onBack={() => setScreen({ view: "home" })}
          favorites={favorites}
          taxAlertOn={taxAlertOn}
          onToggleTaxAlert={toggleTaxAlert}
          planDesc={ALERT_PLANS[alertPlan].desc}
          myEvents={myEvents}
          onSaveEvent={saveEvent}
          onDeleteEvent={deleteEvent}
          onSelectProgram={(id) => setScreen({ view: "detail", id })}
          callName={callName}
          taxStaff={taxStaff}
          onToggleTaxStaff={() => setTaxStaff(!taxStaff)}
        />
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
            if (region === "전체" && answers.region) setRegion(answers.region);
            setStatusFilter("available");
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
          callName={callName}
          diagnosis={diagnosis}
          onBack={() => setScreen({ view: "home" })}
          onRedo={() => setScreen({ view: "diagnosis" })}
          onClear={() => {
            setDiagnosis(null);
            setStatusFilter("available");
            setScreen({ view: "home" });
          }}
          onViewAll={() => {
            setStatusFilter("available");
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
        className="relative overflow-hidden mb-3 pl-5 pr-4 pt-5 pb-5"
        style={{ background: "linear-gradient(135deg, #6AAEFE 0%, #4E86FA 45%, #3E72F6 100%)", borderRadius: 28 }}
      >
        {/* 배경 장식 원 */}
        <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="absolute -left-10 -bottom-16 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        {/* 확성기 + 알림 말풍선 그림 (오른쪽 아래) */}
        <div className="absolute right-0 top-0 bottom-0" style={{ aspectRatio: "340 / 350", maxWidth: "34%" }}>
          <img
            src={heroMegaImg}
            alt=""
            draggable={false}
            className="w-full h-full object-contain object-right-bottom pointer-events-none"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 72% 72% at 55% 50%, #000 60%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 72% 72% at 55% 50%, #000 60%, transparent 100%)",
            }}
          />
          {/* 그림 속 종 말풍선을 누르면 알림 설정(MY)으로 */}
          <button
            onClick={() => setMainTab("my")}
            aria-label="알림 설정"
            className="absolute z-10 rounded-full"
            style={{ right: "4%", top: "2%", width: "36%", aspectRatio: "1 / 1" }}
          />
        </div>

        <div className="relative z-10">
          <p className="text-[15px] font-semibold" style={{ color: "rgba(255,255,255,0.95)" }}>{callName}, 안녕하세요 👋</p>
          <h1 className="font-black mt-1 whitespace-nowrap" style={{ color: "white", fontSize: 21, lineHeight: 1.4, letterSpacing: "-0.03em" }}>
            소상공인 정책자금 알리미
          </h1>
        </div>
        {/* 안내용 표시 — 목록은 아래 '소상공인 지원금' 카드로 들어가요 */}
        <div
          className="relative z-10 mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full"
          style={{ background: "rgba(255,255,255,0.18)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#81F5BE" }} />
          <span className="text-[12px] font-semibold text-white" style={{ lineHeight: 1.5 }}>지금 신청할 수 있는 지원금 {ALL_PROGRAMS.filter((p) => !isExpired(p)).length}건</span>
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
        className="relative overflow-hidden w-full text-left rounded-[24px] py-3.5 pl-2 pr-3.5 mb-5 flex items-center justify-between active:scale-[0.99] transition-transform"
        style={{ background: "linear-gradient(120deg, #FFD54A 0%, #FFC21F 50%, #F2A30F 100%)", boxShadow: "0 8px 20px rgba(232,160,15,0.30)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-20%",
              width: "16%",
              height: "100%",
              background: "linear-gradient(75deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
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
        <div className="relative z-10 flex items-center gap-1.5 min-w-0">
          <img
            src={ctaCoinImg}
            alt=""
            draggable={false}
            className="w-[84px] shrink-0"
            style={{ filter: "drop-shadow(0 4px 8px rgba(150,90,0,0.35))" }}
          />
          <div className="min-w-0">
            <p className="text-[16px] font-extrabold" style={{ color: "#3E2A05" }}>
              {diagnosis ? "내 맞춤 지원금 결과 보기" : "1분 맞춤 진단 받기"}
            </p>
            <p className="text-[12px] mt-1 leading-snug break-keep" style={{ color: "#5C430F" }}>
              {diagnosis ? (
                `${diagnosis.region}${diagnosis.industry ? ` · ${diagLabel(DIAG_INDUSTRY, diagnosis.industry).split(" (")[0]}` : ""} 기준으로 골라둔 지원금이 있어요`
              ) : (
                `몇 가지만 답하면 ${callName} 상황에 맞는 지원금만 보여드려요!`
              )}
            </p>
          </div>
        </div>
        <span className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-2" style={{ background: "rgba(255,255,255,0.85)" }}>
          <ChevronRight size={18} color="#C47F00" strokeWidth={2.6} />
        </span>
      </button>


      {/* 다가오는 일정: 지원금 마감 / 사장님 일정 */}
      <div className="flex items-center justify-between mt-4 mb-2.5">
        <div className="flex items-center gap-1.5">
          <p className="text-[16px] font-bold" style={{ color: TEXT }}>다가오는 마감·일정</p>
          <Clock size={15} color="#F0567A" strokeWidth={2.4} />
        </div>
        <button
          onClick={() => (homeUpcoming === "subsidy" ? setHomeScreen("list") : setScreen({ view: "taxSchedule" }))}
          className="text-[11px] font-medium flex items-center gap-0.5"
          style={{ color: MUTED }}
        >
          전체보기 <ChevronRight size={12} />
        </button>
      </div>
      <div className="rounded-[22px] mb-6 px-3.5 pt-3 pb-1 bg-white" style={{ border: "1px solid #F0F1F6", boxShadow: "0 6px 20px rgba(40,60,120,0.06)" }}>
        <CalcModeSwitch value={homeUpcoming} onChange={setHomeUpcomingSaved} options={[{ key: "subsidy", label: "지원금 마감" }, { key: "mine", label: `${shortCall} 일정` }]} />
        {homeUpcoming === "subsidy" ? (
          <div className="-mt-3">
            <DeadlineSoonList key={dayKey} onSelect={(id) => setScreen({ view: "detail", id })} />
          </div>
        ) : (
          <HomeScheduleList key={dayKey} favorites={favorites} myEvents={myEvents} taxStaff={taxStaff} onOpen={() => setScreen({ view: "taxSchedule" })} />
        )}
      </div>

      {/* 많이 찾는 서비스 */}
      <p className="text-[16px] font-bold mb-2.5" style={{ color: TEXT }}>많이 찾는 서비스</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { key: "all", label: "소상공인\n지원금", bg: "#FDEEDC", img: tileAllImg, onClick: () => { setStatusFilter("available"); setHomeScreen("list"); } },
          { key: "center", label: "지역센터\n찾기", bg: "#FCEAF3", img: tileCenterImg, onClick: () => setScreen({ view: "centers" }) },
          { key: "exchange", label: "금리·환율\n정보", bg: "#E7F7EF", img: tileExchangeImg, onClick: () => setScreen({ view: "exchange" }) },
          { key: "news", label: "정책뉴스\n확인", bg: "#F1ECFC", img: tileNewsImg, onClick: () => setMainTab("news") },
        ].map((tile) => (
          <button
            key={tile.key}
            onClick={tile.onClick}
            aria-label={tile.label.replace("\n", " ")}
            className="relative overflow-hidden active:scale-[0.98] transition-transform"
            style={{ background: tile.bg, borderRadius: 30, aspectRatio: "525 / 672" }}
          >
            {/* 타일 이미지에 제목 글자까지 들어 있어요 */}
            <img src={tile.img} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* 자주 쓰는 도구 */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { key: "tax", label: shortCall === "내" ? "내 일정" : `${shortCall}\n일정`, bg: "#E7F7EF", img: toolTaxImg, onClick: () => setScreen({ view: "taxSchedule" }) },
          { key: "faq", label: "도움말\nQ&A", bg: "#F1ECFC", img: toolFaqImg, onClick: () => setScreen({ view: "faq" }) },
          { key: "docs", label: "서류·양식\n자료실", bg: "#FFF0E6", img: toolDocsImg, onClick: () => setScreen({ view: "documents" }) },
        ].map((tile) => (
          <button
            key={tile.key}
            onClick={tile.onClick}
            aria-label={tile.label.replace("\n", " ")}
            className="relative overflow-hidden rounded-[20px] active:scale-[0.97] transition-transform"
            style={{ background: tile.bg, aspectRatio: "298 / 305" }}
          >
            <img src={tile.img} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
            {/* 제목은 글자로 — 나중에 이름을 바꾸기 쉬워요 */}
            <span className="absolute left-[11%] right-[20%] bottom-[11%] text-left font-extrabold whitespace-pre-line" style={{ color: "#1A1F2C", fontSize: "clamp(13px, 4.1vw, 17px)", lineHeight: 1.42, letterSpacing: "-0.02em" }}>
              {tile.label}
            </span>
            <ChevronRight size={15} color="#6B7385" className="absolute right-[9%] bottom-[22%]" />
          </button>
        ))}
      </div>

      {/* 사장님 필수 계산기 툴킷 */}
      <button
        onClick={() => setScreen({ view: "calculator" })}
        className="w-full text-left rounded-[24px] pt-4 pl-4 pb-4 pr-3 mb-6 relative overflow-hidden active:scale-[0.99] transition-transform"
        style={{ background: "linear-gradient(135deg, #EAF1FE 0%, #E3EEFE 55%, #C9DCFE 100%)" }}
      >
        <img
          src={calcArtImg}
          alt=""
          draggable={false}
          className="absolute right-0 bottom-0 h-full"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 55% 55%, #000 62%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 70% 70% at 55% 55%, #000 62%, transparent 100%)",
          }}
        />
        <span
          className="relative z-10 inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
          style={{ background: "linear-gradient(90deg, #94BDFD, #6DA6FC)" }}
        >
          부가세, 대출이자 즉시 계산
        </span>
        <p className="relative z-10 text-[19px] font-extrabold mt-1.5 mb-3" style={{ color: TEXT }}>사장님 필수 계산기 툴킷</p>
        <div className="relative z-10 flex flex-wrap gap-1.5 max-w-[68%]">
          {[
            { label: "마진율·판매가", Icon: BarChart3 },
            { label: "부가세 쪼개기", Icon: Calculator },
            { label: "손익분기점", Icon: Target },
            { label: "대출이자", Icon: Coins },
            { label: "4대보험료", Icon: ShieldCheck },
            { label: "퇴직금", Icon: Briefcase },
            { label: "최저임금 체크", Icon: CheckCircle2 },
          ].map(({ label, Icon }) => (
            <span
              key={label}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: "rgba(255,255,255,0.7)", color: "#4F6FE0", boxShadow: "0 1px 3px rgba(61,99,221,0.08)" }}
            >
              <Icon size={11} strokeWidth={2.4} />
              {label}
            </span>
          ))}
        </div>
      </button>

      {/* 안내사항 */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-1 h-4 rounded-full" style={{ background: "#7298FE" }} />
        <p className="text-[15px] font-bold" style={{ color: TEXT }}>안내사항</p>
      </div>
      {/* 누르면 정부 지원사업 통합 공식 사이트(기업마당)로 이동해요 */}
      <a
        href="https://www.bizinfo.go.kr"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="안전하고 정확한 정보 확인 안내 — 기업마당 공식 사이트 열기"
        className="block relative overflow-hidden rounded-[20px] active:scale-[0.99] transition-transform"
        style={{ background: "#EEF2FE", aspectRatio: "953 / 188" }}
      >
        <img src={noticeImg} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
      </a>
      <div className="flex items-start gap-2.5 px-1 mt-3.5">
        <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#E5EEFE" }}>
          <Lightbulb size={15} color="#5B7FE8" />
        </span>
        <p className="text-[11.5px] leading-relaxed" style={{ color: MUTED }}>
          이 앱은 정부·지자체·공공기관의 공식 앱이 아니며, 어떤 기관도 대표하거나 대행하지 않아요. 소상공인시장진흥공단·기업마당·각 지자체 등이 공개한 정보를 모아 안내하는 민간 정보 서비스예요.
        </p>
      </div>
        </>
      ) : (
        <>
      <HeroHeader icon={List} color={BLUE} title="지원금 목록" subtitle="조건에 맞는 지원금을 검색·필터링해서 찾아보세요" onBack={() => setHomeScreen("hub")} />

      {/* Status filter */}
      <div className="flex gap-1.5 mb-4">
        {[
          { key: "available", label: "신청가능", count: availableCount },
          { key: "urgent", label: "마감임박", count: urgentCount },
          { key: "closed", label: "접수마감", count: closedCount },
        ].map((s) => {
          const active = statusFilter === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={active ? CHIP_ON : CHIP_OFF}
            >
              {s.label} <span style={{ opacity: 0.75 }}>({s.count})</span>
            </button>
          );
        })}
      </div>

      {/* Search + region */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: INPUT_BG }}>
          <Search size={16} color={MUTED} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·대상·카테고리로 검색"
            className="flex-1 min-w-0 outline-none text-sm bg-transparent"
            style={{ color: TEXT }}
          />
          {query && <button onClick={() => setQuery("")}><X size={14} color={MUTED} /></button>}
        </div>
        <button
          onClick={openPicker}
          className="flex items-center gap-1 px-3 py-2.5 rounded-xl shrink-0"
          style={{ background: INPUT_BG }}
        >
          <MapPin size={15} color={TEXT} />
          <span className="text-[13px] font-medium" style={{ color: TEXT }}>{region}</span>
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-1.5 overflow-x-auto pt-1 pb-3 -mt-1 mb-2 -mx-5 px-5">
        {categories.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap shrink-0"
              style={active ? CHIP_ON : CHIP_OFF}
            >
              {c}
            </button>
          );
        })}
        <span data-scroll-end aria-hidden="true" className="shrink-0 w-6" />
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
          style={showFavoritesOnly ? { background: "#FDEDED", color: RED } : CHIP_OFF}
        >
          <Heart size={12} fill={showFavoritesOnly ? RED : "none"} color={showFavoritesOnly ? RED : MUTED} />
          즐겨찾기 {favorites.size > 0 && `(${favorites.size})`}
        </button>
      </div>
      {statusFilter === "closed" && <ClosedNotice />}
      <p className="text-xs mb-2.5" style={{ color: MUTED }}>총 {filtered.length}건</p>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-14 text-sm" style={{ color: MUTED }}>
            조건에 맞는 지원금이 없어요.
          </div>
        )}
        {filtered.map((p) => (
            <ProgramRow
              key={p.id}
              p={p}
              onClick={() => setScreen({ view: "detail", id: p.id })}
              actions={
                <button onClick={(e) => { e.stopPropagation(); toggleFavoriteId(p.id); }} className="shrink-0 -m-1 p-1" aria-label="즐겨찾기">
                  <Heart size={17} fill={favorites.has(p.id) ? RED : "none"} color={favorites.has(p.id) ? RED : "#C7CBD6"} />
                </button>
              }
            />
        ))}
      </div>

        </>
      )}
      </>
      )}

      {mainTab === "favorites" && (
        <>
          <h1 className="text-[19px] font-bold mb-1" style={{ color: TEXT }}>즐겨찾기</h1>
          {favorites.size > 0 && (
            <p className="text-[11.5px] mb-4" style={{ color: MUTED }}>
              <Bell size={11} className="inline -mt-0.5 mr-0.5" /> 종 아이콘을 눌러 마감 알림을 켜고 끌 수 있어요 (알림 시점은 MY에서 설정)
              {!notifyEnabled && " · MY 탭에서 '지원금 마감 알림'을 먼저 켜주세요"}
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
              {ALL_PROGRAMS.filter((p) => favorites.has(p.id)).map((p) => (
                  <ProgramRow
                    key={p.id}
                    p={p}
                    onClick={() => setScreen({ view: "detail", id: p.id })}
                    actions={
                      <>
                        {canNotify(p) && (
                          <button onClick={(e) => { e.stopPropagation(); toggleNotifyId(p.id); }} className="shrink-0 -m-1 p-1" aria-label="마감 알림">
                            <Bell size={17} fill={notifyIds.has(p.id) ? GOLD : "none"} color={notifyIds.has(p.id) ? GOLD : "#C7CBD6"} />
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); toggleFavoriteId(p.id); }} className="shrink-0 -m-1 p-1 ml-1" aria-label="즐겨찾기 해제">
                          <Heart size={17} fill={RED} color={RED} />
                        </button>
                      </>
                    }
                  />
              ))}
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

            <div className="flex gap-1.5 overflow-x-auto pt-1 pb-3 -mt-1 mb-2 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
              {NEWS_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewsCategory(c)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[12.5px] font-semibold"
                  style={
                    newsCategory === c
                      ? CHIP_ON
                      : CHIP_OFF
                  }
                >
                  {c}
                  <span className="ml-1 opacity-70">{c === "전체" ? NEWS.length : NEWS.filter((n) => n.category === c).length}</span>
                </button>
              ))}
              <span data-scroll-end aria-hidden="true" className="shrink-0 w-6" />
            </div>

            {!featured && (
              <p className="text-[12.5px] text-center py-10" style={{ color: MUTED }}>이 카테고리엔 아직 뉴스가 없어요</p>
            )}

            {/* 주요 소식: 큰 그림 + 제목 카드 */}
            {featured && (() => {
              const fStyle = NEWS_CATEGORY_STYLE[featured.category] || { bg: "#F2F3F7", color: MUTED };
              return (
                <button
                  onClick={() => setScreen({ view: "newsDetail", id: featured.id })}
                  className="block w-full text-left rounded-[24px] overflow-hidden mb-5 active:scale-[0.99] transition-transform"
                  style={CARD}
                >
                  <div className="relative h-[180px] overflow-hidden">
                    <NewsImage news={featured} className="absolute inset-0 w-full h-full" />
                    {featured.image && <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 45%)" }} />}
                    <div className="absolute left-4 bottom-4 flex items-center gap-1.5">
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #FF7A9C, #F0567A)", boxShadow: "0 4px 10px rgba(240,86,122,0.3)" }}
                      >
                        <Zap size={10} fill="white" /> 주요 소식
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "white", color: fStyle.color }}>{featured.category}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.85)", color: "#5E6577" }}>{featured.date}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[17px] font-extrabold leading-snug break-keep" style={{ color: TEXT }}>{featured.title}</p>
                    <p className="text-[12.5px] leading-relaxed mt-1.5 line-clamp-2" style={{ color: MUTED }}>{featured.summary}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[11.5px] font-semibold flex items-center gap-1.5" style={{ color: "#5E6577" }}>
                        {featured.source}
                        <span className="flex items-center gap-0.5 font-normal" style={{ color: MUTED }}>
                          · <Clock size={10} /> {featured.readTime}
                        </span>
                      </span>
                      <span className="text-[11.5px] font-bold flex items-center gap-0.5 px-3 py-1.5 rounded-full" style={BTN_PRIMARY}>
                        자세히 보기 <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })()}

            {rest.length > 0 && (
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1 h-4 rounded-full" style={{ background: "#7A46D6" }} />
                <p className="text-[15px] font-bold" style={{ color: TEXT }}>최신 소식</p>
              </div>
            )}
            <div className="space-y-2.5">
              {rest.map((n) => {
                const style = NEWS_CATEGORY_STYLE[n.category] || { bg: "#F2F3F7", color: MUTED };
                return (
                  <button
                    key={n.id}
                    onClick={() => setScreen({ view: "newsDetail", id: n.id })}
                    className="w-full text-left rounded-[20px] p-3.5 flex items-center gap-3 active:scale-[0.99] transition-transform"
                    style={CARD}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-full mb-1.5" style={{ background: style.bg, color: style.color }}>{n.category}</span>
                      <p className="text-[14px] font-bold leading-snug line-clamp-2 break-keep" style={{ color: TEXT }}>{n.title}</p>
                      <p className="text-[11px] mt-1.5 flex items-center gap-1 truncate" style={{ color: MUTED }}>
                        <span className="truncate">{n.source}</span>
                        <span className="shrink-0">· {n.date}</span>
                        <span className="shrink-0 flex items-center gap-0.5">· <Clock size={10} /> {n.readTime}</span>
                      </p>
                    </div>
                    <NewsImage news={n} className="w-[88px] h-[88px] rounded-2xl shrink-0" />
                  </button>
                );
              })}
            </div>

            <a
              href="https://www.korea.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1 py-3.5 mt-4 rounded-2xl text-[12.5px] font-bold"
              style={{ ...CARD, color: "#7A46D6" }}
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
              className="navArrowBtn w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center" aria-label="뒤로가기"
            >
              <ChevronLeft size={20} color={TEXT} />
            </button>
            <h1 className="text-[19px] font-bold" style={{ color: TEXT }}>MY</h1>
          </div>

          <p className="text-[12px] font-bold mb-2 px-1" style={{ color: MUTED }}>내 정보</p>
          <button onClick={() => setScreen({ view: "nickname" })} className="w-full text-left rounded-[20px] p-4 mb-3 flex items-center justify-between gap-3" style={CARD}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#FFF3E0" }}>
                <User size={17} color={MY_ACCENT} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: TEXT }}>내 이름</p>
                <p className="text-[12px] truncate" style={{ color: MUTED }}>{nickname ? `${callName}으로 불러드려요` : "아직 설정 전이에요 · 지금은 '사장님'으로 불러요"}</p>
              </div>
            </div>
            <ChevronRight size={16} color="#C3C8D4" className="shrink-0" />
          </button>
          <button onClick={openPicker} className="w-full text-left rounded-[20px] p-4 mb-3 flex items-center justify-between gap-3" style={CARD}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: BLUE_SOFT }}>
                <MapPin size={17} color={BLUE} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: TEXT }}>내 지역</p>
                <p className="text-[12px] truncate" style={{ color: MUTED }}>
                  {region === "전체" || region === "전국" ? "아직 설정 전이에요 · 눌러서 정해 주세요" : `${region} · 지원금 목록이 이 지역 기준으로 열려요`}
                </p>
              </div>
            </div>
            <ChevronRight size={16} color="#C3C8D4" className="shrink-0" />
          </button>
          <button
            onClick={() => setScreen({ view: "diagnosis" })}
            className="w-full text-left rounded-[20px] p-4 mb-3 flex items-center justify-between gap-3"
            style={CARD}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#FCEAC7" }}>
                <MoneyBagArt className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: TEXT }}>맞춤 진단</p>
                <p className="text-[12px] truncate" style={{ color: MUTED }}>
                  {diagnosis ? `${diagnosis.region} · 진단 완료 (다시 진단하기)` : "아직 진단 전이에요 · 1분이면 끝나요"}
                </p>
              </div>
            </div>
            <ChevronRight size={16} color={MUTED} className="shrink-0" />
          </button>
          <p className="text-[12px] font-bold mb-2 px-1 mt-5" style={{ color: MUTED }}>알림</p>
          <button onClick={() => setScreen({ view: "alertSettings" })} className="w-full text-left rounded-[20px] p-4 mb-5 flex items-center justify-between gap-3" style={CARD}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#FDEEE9" }}>
                <Bell size={17} color="#E5674D" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: TEXT }}>알림 설정</p>
                <p className="text-[12px] truncate" style={{ color: MUTED }}>
                  {(() => {
                    const n = [notifyEnabled, taxAlertOn, rateAlertOn].filter(Boolean).length;
                    if (!n) return "꺼져 있어요 · 마감·세금·금리 발표일 알림";
                    return `${n}개 켜짐 · ${ALERT_PLANS[alertPlan].label} · ${ALERT_HOURS.find((x) => x.h === alertHour).label}${Capacitor.isNativePlatform() ? ` · 예약 ${scheduledAlerts.length}개` : ""}`;
                  })()}
                </p>
              </div>
            </div>
            <ChevronRight size={16} color="#C3C8D4" className="shrink-0" />
          </button>

          <p className="text-[12px] font-bold mb-2 px-1 mt-4" style={{ color: MUTED }}>약관·정보</p>
          <div className="rounded-[20px] overflow-hidden mb-3" style={CARD}>
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

          <p className="text-[11.5px] text-center mt-8" style={{ color: MUTED }}>지원금알리미 v1.0</p>
          <p className="text-[11px] text-center mt-1 leading-relaxed" style={{ color: MUTED }}>정부·공공기관의 공식 앱이 아닌 민간 정보 서비스예요</p>
        </>
      )}

      {/* Bottom tab bar */}
      {screen.view !== "detail" && (
        <>
          <div style={{ height: 100 }} />
          {/* 하단 바 뒤를 흰 배경으로 채워서, 스크롤된 내용이 바 주변으로 비치거나 가려 보이지 않게 해요 */}
          <div
            className="fixed bottom-0 inset-x-0 flex justify-center px-4 pt-3 pb-3"
            style={{ zIndex: 50, display: typing ? "none" : undefined, background: "linear-gradient(to bottom, rgba(255,255,255,0) 0, #fff 14px)" }}
          >
            <div className="w-full max-w-md md:max-w-xl">
              {/* 하단 탭바 — 앱 전체 파란 톤에 맞춘 흰 바, 선택된 탭은 파란 아이콘 + 연한 파란 배경 */}
              <div
                className="flex rounded-[24px] px-1.5 py-1.5"
                style={{ background: "rgba(255,255,255,0.96)", border: "1px solid #EEF0F6", boxShadow: "0 8px 28px rgba(40,60,120,0.12)" }}
              >
                {[
                  { key: "home", label: "홈", icon: Home, active: mainTab === "home" && homeScreen === "hub", go: () => { setMainTab("home"); setHomeScreen("hub"); } },
                  { key: "list", label: "지원금", icon: List, active: mainTab === "home" && homeScreen === "list", go: () => { setMainTab("home"); setStatusFilter("available"); setHomeScreen("list"); } },
                  { key: "favorites", label: "즐겨찾기", icon: Heart, badge: favorites.size, active: mainTab === "favorites", go: () => setMainTab("favorites") },
                  { key: "news", label: "뉴스", icon: Newspaper, active: mainTab === "news", go: () => setMainTab("news") },
                  { key: "my", label: "MY", icon: User, active: mainTab === "my", go: () => setMainTab("my") },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={t.go}
                    aria-label={t.label}
                    className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-[18px] transition-colors"
                    style={t.active ? { background: BLUE_SOFT } : {}}
                  >
                    <span className="relative">
                      <t.icon
                        size={20}
                        color={t.active ? BLUE : "#9AA1B2"}
                        strokeWidth={t.active ? 2.3 : 1.8}
                        fill={t.key === "favorites" && t.active ? BLUE : "none"}
                      />
                      {t.badge > 0 && (
                        <span
                          className="absolute -top-2 -right-3.5 min-w-[16px] h-4 px-1 rounded-full text-[9.5px] font-bold text-white flex items-center justify-center tabular-nums"
                          style={{ background: RED, boxShadow: "0 0 0 2px white" }}
                        >
                          {t.badge > 99 ? "99+" : t.badge}
                        </span>
                      )}
                    </span>
                    <span className="text-[10.5px]" style={{ color: t.active ? BLUE : "#9AA1B2", fontWeight: t.active ? 700 : 500 }}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </Shell>
  );
}

// 개인정보처리방침 — 1인 개발, 로그인/회원가입 없는 서비스 기준
// 웹 버전(public/privacy.html)과 내용·이메일·시행일을 맞춰 둘 것
function PrivacyPolicyScreen({ onBack }) {
  const CONTACT_EMAIL = "heatpipe777@gmail.com";
  const EFFECTIVE_DATE = "2026-10-04";
  const sections = [
    {
      title: "1. 수집하는 개인정보 항목",
      body:
        "이 앱은 회원가입·로그인 기능이 없어요. 이름, 전화번호, 이메일 등 개인을 식별할 수 있는 정보를 서버로 전송받거나 저장하지 않아요.",
    },
    {
      title: "2. 기기에 저장되는 정보",
      body:
        "직접 입력한 이름(호칭), 즐겨찾기한 지원금 목록, 내 일정, 알림 설정, 마지막으로 선택한 지역 정보는 사용하시는 기기(브라우저)의 로컬 저장소에만 저장돼요. 이 정보는 외부 서버로 전송되지 않고, 앱을 삭제하거나 브라우저 저장공간을 초기화하면 함께 사라져요.",
    },
    {
      title: "3. 외부 공개 데이터 호출",
      body:
        "환율 정보 표시를 위해 공개 환율 API(open.er-api.com)를, 지도 표시를 위해 OpenStreetMap을, 뉴스 대표 사진 표시를 위해 각 기사 원문 사이트를 호출해요. 이 요청에는 개인을 식별할 수 있는 정보가 포함되지 않아요.",
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
  const EFFECTIVE_DATE = "2026-10-04";
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
      <div className="w-full max-w-md md:max-w-xl min-h-screen bg-white px-5 pt-7 pb-10 relative">{children}</div>
    </div>
  );
}
