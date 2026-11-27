import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { ChatMessage } from "./entity/ChatMessage";
import { Consultation } from "./entity/Consultation";
import { VisitorLog } from "./entity/VisitorLog";
import { RevenueRecord } from "./entity/RevenueRecord";
import { ProjectIssue } from "./entity/ProjectIssue";
import path from "path";
import fs from "fs";
import multer from "multer";
import { Portfolio } from "./entity/Portfolio";
import { BusinessSection, BusinessCardData } from "./entity/BusinessSection";
import { SolutionSection, SolutionSlotItem } from "./entity/SolutionSection";
import { RescueSection, RescueCardItem } from "./entity/RescueSection";
import { ShowcaseSection, ShowcaseSlideItem } from "./entity/ShowcaseSection";
import { HeroSection, HeroSlideData } from "./entity/HeroSection";


export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [
    User,
    ChatMessage,
    Consultation,
    VisitorLog,
    RevenueRecord,
    ProjectIssue,
    Portfolio,
    BusinessSection,
    HeroSection, // ✅ 여기에 추가!
  ],
});

const app = express();
app.use(cors());
app.use(express.json());

// 업로드 폴더 생성 및 정적 파일 제공
const uploadDir = path.join(process.cwd(), "uploads", "portfolios");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    const uniqueName = `pf_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("이미지 파일(jpg, png, webp, gif, svg)만 업로드 가능합니다."));
    }
  },
});

const DEFAULT_BUSINESS_CARDS: BusinessCardData[] = [
  {
    id: "biz-1",
    title: "System Integration",
    description: "기업 환경에 최적화된 시스템 통합 및 기간계 구축",
    visualType: "animation",
    animationKey: "pulse",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 1,
  },
  {
    id: "biz-2",
    title: "IT Outsourcing",
    description: "안정적인 운영과 민첩한 개발 인력·프로젝트 아웃소싱",
    visualType: "animation",
    animationKey: "wave",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 2,
  },
  {
    id: "biz-3",
    title: "Consulting",
    description: "비즈니스 목표에 맞춘 IT 아키텍처 및 디지털 전환 컨설팅",
    visualType: "animation",
    animationKey: "cube",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 3,
  },
  {
    id: "biz-4",
    title: "Agile Architecture",
    description: "빠른 확장과 유지보수를 지원하는 유연한 클라우드·웹 아키텍처",
    visualType: "animation",
    animationKey: "orbit",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 4,
  },
  {
    id: "biz-5",
    title: "Solution & Specialization",
    description: "산업별 특화 솔루션 및 맞춤형 플랫폼 개발",
    visualType: "animation",
    animationKey: "radar",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 5,
  },
  {
    id: "biz-6",
    title: "Mobile & Embedded SW",
    description: "iOS·Android 앱 및 디바이스 연동 임베디드 소프트웨어",
    visualType: "animation",
    animationKey: "grid",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 6,
  },
  {
    id: "biz-7",
    title: "SAP-ERP",
    description: "재무·회계·물류·생산 프로세스 연계 ERP 구축 및 고도화",
    visualType: "animation",
    animationKey: "cube",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 7,
  },
];

async function getOrCreateBusinessSection() {
  const repo = AppDataSource.getRepository(BusinessSection);
  let section = await repo.findOne({ where: {}, order: { id: "ASC" } });
  if (!section) {
    section = repo.create({
      eyebrow: "HBK AGENCY",
      title: "BUSINESS",
      subtitle: "축적된 IT 기술과 노하우를 바탕으로 최상의 서비스를 제공하는 기업",
      ctaLabel: "More Core Platforms +",
      ctaLink: "#step-5",
      cards: DEFAULT_BUSINESS_CARDS,
    });
    await repo.save(section);
  }
  return section;
}

const DEFAULT_SOLUTIONS: SolutionSlotItem[] = [
  {
    id: "sol-1",
    badge: "SOLUTION 01",
    title: "AI AGENT",
    description:
      "차세대 IT기술 발전동향에 맞추어 LangChain과 LangGraph 기반 자율형 멀티 에이전트 시스템을 구축합니다.\n변화하는 환경과 모니터링 시나리오에 맞춰 스스로 분석하고 업무를 자동화하는 차세대 솔루션입니다.",
    animKey: "isoCube",
    linkUrl: "",
    sortOrder: 1,
  },
  {
    id: "sol-2",
    badge: "SOLUTION 02",
    title: "지능형 ERP",
    description:
      "급변하는 국내 경영환경 하에 기업의 목표 달성을 위한 강력한 예측 기반 에코시스템입니다.\n단순 성과 측정 수단이 아닌, 머신러닝 분석을 통해 공정 및 프로세스 향상에 역량을 집중할 수 있는 Key 솔루션입니다.",
    animKey: "neonFrames",
    linkUrl: "",
    sortOrder: 2,
  },
];

async function ensureSolutionSection() {
  const repo = AppDataSource.getRepository(SolutionSection);
  let row = await repo.findOne({ where: {}, order: { id: "ASC" } });
  if (!row) {
    row = repo.create({
      solutions: DEFAULT_SOLUTIONS,
    });
    await repo.save(row);
  }
  return row;
}

// 1. 솔루션 섹션 조회
app.get("/api/solution-section", async (_req, res) => {
  try {
    const row = await ensureSolutionSection();
    const sorted = [...(row.solutions || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    res.json({
      section: {
        ...row,
        solutions: sorted,
      },
    });
  } catch (err) {
    console.error("❌ SOLUTION 섹션 조회 실패:", err);
    res.status(500).json({ error: "Failed to fetch solution section" });
  }
});

// 2. 솔루션 문구 & 7종 애니메이션 선택 저장
app.put("/api/solution-section", async (req, res) => {
  try {
    const { solutions } = req.body;
    const repo = AppDataSource.getRepository(SolutionSection);
    const row = await ensureSolutionSection();

    if (Array.isArray(solutions) && solutions.length > 0) {
      row.solutions = solutions.map((item: any, idx: number) => ({
        id: item.id || `sol_${idx + 1}`,
        badge: String(item.badge || `SOLUTION 0${idx + 1}`).trim(),
        title: String(item.title || "").trim(),
        description: String(item.description || ""),
        animKey: item.animKey || "isoCube",
        linkUrl: String(item.linkUrl || "").trim(),
        sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : idx + 1,
      }));
    }

    await repo.save(row);
    res.json({ success: true, section: row });
  } catch (err) {
    console.error("❌ SOLUTION 섹션 저장 실패:", err);
    res.status(500).json({ success: false, message: "Failed to save solution section" });
  }
});

// 1. BUSINESS 섹션 조회
app.get("/api/business-section", async (_req, res) => {
  try {
    const section = await getOrCreateBusinessSection();
    const sortedCards = [...(section.cards || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    res.json({
      section: {
        ...section,
        cards: sortedCards,
      },
    });
  } catch (error) {
    console.error("❌ BUSINESS 섹션 조회 실패:", error);
    res.status(500).json({ error: "Failed to fetch business section" });
  }
});

// 2. BUSINESS 섹션 문구 및 카드 전체 저장/수정
app.put("/api/business-section", async (req, res) => {
  try {
    const { eyebrow, title, subtitle, ctaLabel, ctaLink, cards } = req.body;
    const repo = AppDataSource.getRepository(BusinessSection);
    const section = await getOrCreateBusinessSection();

    if (eyebrow !== undefined) section.eyebrow = String(eyebrow).trim();
    if (title !== undefined) section.title = String(title).trim();
    if (subtitle !== undefined) section.subtitle = String(subtitle).trim();
    if (ctaLabel !== undefined) section.ctaLabel = String(ctaLabel).trim();
    if (ctaLink !== undefined) section.ctaLink = String(ctaLink).trim();

    if (Array.isArray(cards)) {
      section.cards = cards.map((c: any, idx: number) => ({
        id: c.id || `biz_${Date.now()}_${idx}`,
        title: String(c.title || "").trim(),
        description: String(c.description || "").trim(),
        visualType: c.visualType === "image" ? "image" : "animation",
        animationKey: c.animationKey || "pulse",
        imageUrl: String(c.imageUrl || "").trim(),
        linkUrl: String(c.linkUrl || "").trim(),
        sortOrder: Number.isFinite(Number(c.sortOrder)) ? Number(c.sortOrder) : idx + 1,
      }));
    }

    await repo.save(section);
    res.json({ success: true, section });
  } catch (error) {
    console.error("❌ BUSINESS 섹션 저장 실패:", error);
    res.status(500).json({ success: false, message: "Failed to save business section" });
  }
});

// 3. BUSINESS 카드 이미지 업로드 전용 API
app.post("/api/business-section/upload", upload.single("imageFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "업로드할 이미지 파일이 없습니다." });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/portfolios/${req.file.filename}`;
    res.status(201).json({ success: true, imageUrl });
  } catch (error: any) {
    console.error("❌ BUSINESS 카드 이미지 업로드 실패:", error);
    res.status(500).json({ success: false, message: error.message || "Upload failed" });
  }
});


const DEFAULT_RESCUE_CARDS: RescueCardItem[] = [
  {
    id: "res-1",
    roleTitle: "펜션 사장님",
    quote:
      '"외주 맡긴 개발자가 갑자기 잠수 탔습니다. 오픈 코앞인데 예약 데이터가 다 날아갔어요."',
    iconKey: "userMinus",
    highlight: false,
    sortOrder: 1,
  },
  {
    id: "res-2",
    roleTitle: "커머스 대표님",
    quote:
      '"기획서 없다고 추가금만 계속 요구하고, 코드는 온통 스파게티라 수정도 안 되네요."',
    iconKey: "ticket",
    highlight: false,
    sortOrder: 2,
  },
  {
    id: "res-3",
    roleTitle: "스타트업 대표",
    quote:
      '"거기 주니어 하청 주는 데 말고 HBK 가보세요. 15년 경력 시니어 아키텍트가 직접 봐줍니다."',
    iconKey: "message",
    highlight: false,
    sortOrder: 3,
  },
  {
    id: "res-4",
    roleTitle: "HBK 아키텍트",
    quote:
      '"주니어 하청 없이 시니어 아키텍트가 직접 투입됩니다. 무너진 코드 심폐소생부터 완벽하게 정상화해 드립니다."',
    iconKey: "shield",
    highlight: true,
    sortOrder: 4,
  },
];

async function ensureRescueSection() {
  const repo = AppDataSource.getRepository(RescueSection);
  let row = await repo.findOne({ where: {}, order: { id: "ASC" } });
  if (!row) {
    row = repo.create({
      eyebrow: "02 / PROJECT RESCUE",
      mainTitle: "RESCUE",
      headline: "외주 개발 실패로 속앓이하던 사장님들이 마지막에 찾는 곳",
      overallReview:
        '"개발자가 연락 두절됐어요", "오픈 날 서버가 터졌어요", "기획서가 없다고 추가금만 요구해요." HBK는 주니어에게 하청을 주지 않습니다. 15년 이상 경력의 시니어 아키텍트가 직접 비즈니스 본질을 파악하고, 엉망이 된 코드의 심폐소생부터 매출을 만드는 자동화 ERP까지 정공법으로 완성합니다.',
      ctaLabel: "More Success Cases +",
      ctaLink: "",
      cards: DEFAULT_RESCUE_CARDS,
    });
    await repo.save(row);
  }
  return row;
}

// 1. RESCUE 섹션(총평 + 카드 목록) 조회
app.get("/api/rescue-section", async (_req, res) => {
  try {
    const row = await ensureRescueSection();
    const sortedCards = [...(row.cards || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    res.json({
      section: {
        ...row,
        cards: sortedCards,
      },
    });
  } catch (err) {
    console.error("❌ RESCUE 섹션 조회 실패:", err);
    res.status(500).json({ error: "Failed to fetch rescue section" });
  }
});

// 2. RESCUE 총평 및 카드 목록 저장
app.put("/api/rescue-section", async (req, res) => {
  try {
    const { eyebrow, mainTitle, headline, overallReview, ctaLabel, ctaLink, cards } = req.body;
    const repo = AppDataSource.getRepository(RescueSection);
    const row = await ensureRescueSection();

    if (eyebrow !== undefined) row.eyebrow = String(eyebrow).trim();
    if (mainTitle !== undefined) row.mainTitle = String(mainTitle).trim();
    if (headline !== undefined) row.headline = String(headline).trim();
    if (overallReview !== undefined) row.overallReview = String(overallReview);
    if (ctaLabel !== undefined) row.ctaLabel = String(ctaLabel).trim();
    if (ctaLink !== undefined) row.ctaLink = String(ctaLink).trim();

    if (Array.isArray(cards)) {
      row.cards = cards.map((c: any, idx: number) => ({
        id: c.id || `res_${Date.now()}_${idx}`,
        roleTitle: String(c.roleTitle || "").trim(),
        quote: String(c.quote || "").trim(),
        iconKey: c.iconKey || "userMinus",
        highlight: Boolean(c.highlight),
        sortOrder: Number.isFinite(Number(c.sortOrder)) ? Number(c.sortOrder) : idx + 1,
      }));
    }

    await repo.save(row);
    res.json({ success: true, section: row });
  } catch (err) {
    console.error("❌ RESCUE 섹션 저장 실패:", err);
    res.status(500).json({ success: false, message: "Failed to save rescue section" });
  }
});


const DEFAULT_SHOWCASE_SLIDES: ShowcaseSlideItem[] = [
  {
    id: "sc-1",
    prefixText: "HBK는",
    title: "실시간 매출·전환율 분석 엔터프라이즈 대시보드",
    description:
      "흩어져 있는 DB 데이터를 초단위로 집계하여 경영진이 한눈에 의사결정할 수 있는 BI 시스템",
    visualType: "animation",
    animKey: "barChart",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 1,
  },
  {
    id: "sc-2",
    prefixText: "HBK는",
    title: "LangGraph 기반 자율형 멀티 에이전트 오케스트레이션",
    description:
      "복잡한 업무 파이프라인을 상태 기반으로 제어하고 실시간 로그와 도구 호출을 추적하는 AI 아키텍처",
    visualType: "animation",
    animKey: "orbitNodes",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 2,
  },
  {
    id: "sc-3",
    prefixText: "HBK는",
    title: "무너진 외주 프로젝트 긴급 진단 및 심폐소생",
    description:
      "스파게티 코드 리팩토링, 서버 안정화, 누락된 비즈니스 로직 복구까지 단기간에 정상화",
    visualType: "animation",
    animKey: "pulseRing",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 3,
  },
];

async function ensureShowcaseSection() {
  const repo = AppDataSource.getRepository(ShowcaseSection);
  let row = await repo.findOne({ where: {}, order: { id: "ASC" } });
  if (!row) {
    row = repo.create({
      slides: DEFAULT_SHOWCASE_SLIDES,
    });
    await repo.save(row);
  }
  return row;
}

// 1. 쇼케이스 슬라이드 조회
app.get("/api/showcase-section", async (_req, res) => {
  try {
    const row = await ensureShowcaseSection();
    const sorted = [...(row.slides || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    res.json({
      section: {
        ...row,
        slides: sorted,
      },
    });
  } catch (err) {
    console.error("❌ SHOWCASE 섹션 조회 실패:", err);
    res.status(500).json({ error: "Failed to fetch showcase section" });
  }
});

// 2. 쇼케이스 슬라이드 문구 & 애니메이션/이미지 저장
app.put("/api/showcase-section", async (req, res) => {
  try {
    const { slides } = req.body;
    const repo = AppDataSource.getRepository(ShowcaseSection);
    const row = await ensureShowcaseSection();

    if (Array.isArray(slides)) {
      row.slides = slides.map((s: any, idx: number) => ({
        id: s.id || `sc_${Date.now()}_${idx}`,
        prefixText: String(s.prefixText ?? "HBK는").trim(),
        title: String(s.title || "").trim(),
        description: String(s.description || "").trim(),
        visualType: s.visualType === "image" ? "image" : "animation",
        animKey: s.animKey || "barChart",
        imageUrl: String(s.imageUrl || "").trim(),
        linkUrl: String(s.linkUrl || "").trim(),
        sortOrder: Number.isFinite(Number(s.sortOrder)) ? Number(s.sortOrder) : idx + 1,
      }));
    }

    await repo.save(row);
    res.json({ success: true, section: row });
  } catch (err) {
    console.error("❌ SHOWCASE 섹션 저장 실패:", err);
    res.status(500).json({ success: false, message: "Failed to save showcase section" });
  }
});

// 3. 쇼케이스 이미지 업로드 (기존 multer upload 활용)
app.post("/api/showcase-section/upload", upload.single("imageFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "업로드할 이미지 파일이 없습니다." });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/portfolios/${req.file.filename}`;
    res.status(201).json({ success: true, imageUrl });
  } catch (error: any) {
    console.error("❌ SHOWCASE 이미지 업로드 실패:", error);
    res.status(500).json({ success: false, message: error.message || "Upload failed" });
  }
});


// 1. 포트폴리오 목록 조회
app.get("/api/portfolios", async (_req, res) => {
  try {
    const repo = AppDataSource.getRepository(Portfolio);
    const list = await repo.find({
      order: { sortOrder: "ASC", createdAt: "DESC" },
    });
    res.json({ list });
  } catch (error) {
    console.error("❌ 포트폴리오 조회 실패:", error);
    res.status(500).json({ error: "Failed to fetch portfolios" });
  }
});

// 2. 포트폴리오 등록 (파일 업로드 또는 imageUrl 직접 입력 지원)
app.post("/api/portfolios", upload.single("imageFile"), async (req, res) => {
  try {
    const { title, description, linkUrl, tag, imageUrl, sortOrder } = req.body;

    if (!title?.trim() || !linkUrl?.trim()) {
      return res.status(400).json({ success: false, message: "제목과 링크 URL은 필수입니다." });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const finalImageUrl = req.file
      ? `${baseUrl}/uploads/portfolios/${req.file.filename}`
      : (imageUrl || "").trim();

    if (!finalImageUrl) {
      return res.status(400).json({ success: false, message: "메인 이미지 파일 또는 이미지 URL을 입력해 주세요." });
    }

    const repo = AppDataSource.getRepository(Portfolio);
    const item = repo.create({
      title: title.trim(),
      description: (description || "").trim(),
      imageUrl: finalImageUrl,
      linkUrl: linkUrl.trim(),
      tag: (tag || "").trim(),
      sortOrder: Number(sortOrder) || 0,
    });

    await repo.save(item);
    res.status(201).json({ success: true, item });
  } catch (error: any) {
    console.error("❌ 포트폴리오 등록 실패:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create portfolio" });
  }
});

// 3. 포트폴리오 수정
app.put("/api/portfolios/:id", upload.single("imageFile"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(Portfolio);
    const existing = await repo.findOneBy({ id });

    if (!existing) {
      return res.status(404).json({ success: false, message: "해당 포트폴리오를 찾을 수 없습니다." });
    }

    const { title, description, linkUrl, tag, imageUrl, sortOrder } = req.body;
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    existing.title = title?.trim() ?? existing.title;
    existing.description = description !== undefined ? description.trim() : existing.description;
    existing.linkUrl = linkUrl?.trim() ?? existing.linkUrl;
    existing.tag = tag !== undefined ? tag.trim() : existing.tag;
    if (sortOrder !== undefined) existing.sortOrder = Number(sortOrder) || 0;

    if (req.file) {
      existing.imageUrl = `${baseUrl}/uploads/portfolios/${req.file.filename}`;
    } else if (imageUrl !== undefined && imageUrl.trim()) {
      existing.imageUrl = imageUrl.trim();
    }

    await repo.save(existing);
    res.json({ success: true, item: existing });
  } catch (error: any) {
    console.error("❌ 포트폴리오 수정 실패:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update portfolio" });
  }
});

// 4. 포트폴리오 삭제
app.delete("/api/portfolios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(Portfolio);
    const existing = await repo.findOneBy({ id });

    if (!existing) {
      return res.status(404).json({ success: false, message: "해당 포트폴리오를 찾을 수 없습니다." });
    }

    // 로컬 uploads 파일이었다면 함께 정리
    if (existing.imageUrl.includes("/uploads/portfolios/")) {
      const filename = existing.imageUrl.split("/uploads/portfolios/")[1];
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await repo.remove(existing);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ 포트폴리오 삭제 실패:", error);
    res.status(500).json({ success: false, message: "Failed to delete portfolio" });
  }
});


const DEFAULT_HERO_SLIDES: HeroSlideData[] = [
  {
    id: "hero-1",
    prefixLabel: "HBK는",
    typingText: "고객을 존중하는 애자일 방식을 선호합니다.",
    what: "고트래픽 플랫폼",
    who: "성장하는 기업",
    title: "실시간 트래픽과 확장을 견디는 아키텍처",
    desc: "병목 없는 API·DB 구조와 자동화 파이프라인으로 서비스 성장 속도에 맞춰 안정적으로 스케일합니다.",
    bgColor: "#0c0c10",
    visualType: "art",
    artIndex: 0,
    imageUrl: "",
    sortOrder: 1,
  },
  {
    id: "hero-2",
    prefixLabel: "HBK는",
    typingText: "무너진 프로젝트도 정공법으로 되살립니다.",
    what: "긴급 시스템 복구",
    who: "외주 실패 기업",
    title: "시니어 아키텍트 직접 투입 코드 심폐소생",
    desc: "중단된 개발과 스파게티 코드를 빠르게 진단·정리하여 오픈과 운영 정상화까지 책임집니다.",
    bgColor: "#0c0c10",
    visualType: "art",
    artIndex: 1,
    imageUrl: "",
    sortOrder: 2,
  },
];

async function ensureHeroSection() {
  const repo = AppDataSource.getRepository(HeroSection);
  let row = await repo.findOne({ where: {}, order: { id: "ASC" } });
  if (!row) {
    row = repo.create({
      intervalMs: 16000,
      slides: DEFAULT_HERO_SLIDES,
    });
    await repo.save(row);
  }
  return row;
}

// 1. 히어로 섹션 조회
app.get("/api/hero-section", async (_req, res) => {
  try {
    const row = await ensureHeroSection();
    const sorted = [...(row.slides || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    res.json({
      section: {
        ...row,
        slides: sorted,
      },
    });
  } catch (err) {
    console.error("❌ HERO 섹션 조회 실패:", err);
    res.status(500).json({ error: "Failed to fetch hero section" });
  }
});

// 2. 히어로 섹션 슬라이드/문구/애니메이션 저장
app.put("/api/hero-section", async (req, res) => {
  try {
    const { intervalMs, slides } = req.body;
    const repo = AppDataSource.getRepository(HeroSection);
    const row = await ensureHeroSection();

    if (intervalMs !== undefined) {
      row.intervalMs = Math.max(3000, Number(intervalMs) || 16000);
    }

    if (Array.isArray(slides)) {
      row.slides = slides.map((item: any, idx: number) => ({
        id: item.id || `hero_${Date.now()}_${idx}`,
        prefixLabel: String(item.prefixLabel ?? "HBK는").trim(),
        typingText: String(item.typingText ?? "").trim(),
        what: String(item.what ?? "").trim(),
        who: String(item.who ?? "").trim(),
        title: String(item.title ?? "").trim(),
        desc: String(item.desc ?? "").trim(),
        bgColor: String(item.bgColor || "#0c0c10").trim(),
        visualType: item.visualType === "image" ? "image" : "art",
        artIndex: Number.isFinite(Number(item.artIndex)) ? Number(item.artIndex) : idx % 12,
        imageUrl: String(item.imageUrl ?? "").trim(),
        sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : idx + 1,
      }));
    }

    await repo.save(row);
    res.json({ success: true, section: row });
  } catch (err) {
    console.error("❌ HERO 섹션 저장 실패:", err);
    res.status(500).json({ success: false, message: "Failed to save hero section" });
  }
});

// 3. 히어로 배경/비주얼 이미지 업로드 (기존 multer upload 활용)
app.post("/api/hero-section/upload", upload.single("imageFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "업로드할 이미지 파일이 없습니다." });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/portfolios/${req.file.filename}`;
    res.status(201).json({ success: true, imageUrl });
  } catch (error: any) {
    console.error("❌ HERO 이미지 업로드 실패:", error);
    res.status(500).json({ success: false, message: error.message || "Upload failed" });
  }
});

// 1. 프로젝트 발생건 목록 조회 API (페이징 포함)
app.get("/api/issues", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const repo = AppDataSource.getRepository(ProjectIssue);
    const [list, total] = await repo.findAndCount({
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    res.json({
      list,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ 프로젝트 발생건 조회 실패:", error);
    res.status(500).json({ error: "Failed to fetch project issues" });
  }
});

// 1. 회원가입 API
app.post("/api/auth/signup", async (req: any, res: any) => {
  try {
    const { lastName, firstName, email, password, phone, zipCode, address, detailAddress } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    // 이메일 중복 확인
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "이미 가입된 이메일입니다." });
    }

    // 유저 생성 및 저장
    const newUser = userRepository.create({
      lastName,
      firstName,
      email,
      password, // (참고) 실무에서는 bcrypt.hash 등 암호화 필수
      phone,
      zipCode,
      address,
      detailAddress,
    });

    await userRepository.save(newUser);

    return res.status(201).json({ success: true, message: "회원가입이 완료되었습니다." });
  } catch (error) {
    console.error("회원가입 에러:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
});

// 2. 로그인 API
app.post("/api/auth/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    return res.status(200).json({ 
      success: true, 
      message: "로그인 성공", 
      user: { id: user.id, email: user.email, name: `${user.lastName}${user.firstName}` } 
    });
  } catch (error) {
    console.error("로그인 에러:", error);
    return res.status(500).json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
});

// 2. 프로젝트 발생건 등록 API
app.post("/api/issues", async (req, res) => {
  try {
    const { projectTitle, clientName, description, priority } = req.body;
    const repo = AppDataSource.getRepository(ProjectIssue);
    
    const issue = repo.create({
      projectTitle,
      clientName,
      description,
      priority: priority || "일반",
      status: "접수"
    });
    await repo.save(issue);
    res.status(201).json({ success: true, issue });
  } catch (error) {
    console.error("❌ 프로젝트 발생건 등록 실패:", error);
    res.status(500).json({ error: "Failed to save project issue" });
  }
});

// 3. 프로젝트 발생건 상태 변경 API
app.patch("/api/issues/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const repo = AppDataSource.getRepository(ProjectIssue);
    
    await repo.update(id, { status });
    res.json({ success: true });
  } catch (error) {
    console.error("❌ 상태 변경 실패:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// 1. 매출/손익 데이터 목록 조회 및 요약 API
app.get("/api/revenues", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(RevenueRecord);
    const list = await repo.find({ order: { createdAt: "DESC" } });

    // 총 매출, 총 지출, 순이익 계산
    const totalRevenue = list.reduce((acc, cur) => acc + Number(cur.revenue), 0);
    const totalExpense = list.reduce((acc, cur) => acc + Number(cur.expense), 0);
    const netProfit = totalRevenue - totalExpense;

    res.json({
      list,
      summary: {
        totalRevenue,
        totalExpense,
        netProfit,
        breakEvenPoint: 15000000 // 예시 고정 목표 BEP (또는 계산식 적용 가능)
      }
    });
  } catch (error) {
    console.error("❌ 매출 데이터 조회 실패:", error);
    res.status(500).json({ error: "Failed to fetch revenue records" });
  }
});

// 2. 매출/손익 항목 추가 API
app.post("/api/revenues", async (req, res) => {
  try {
    const { projectName, revenue, expense, status } = req.body;
    const repo = AppDataSource.getRepository(RevenueRecord);
    
    const record = repo.create({
      projectName,
      revenue: Number(revenue) || 0,
      expense: Number(expense) || 0,
      status: status || "완료"
    });
    await repo.save(record);
    res.status(201).json({ success: true, record });
  } catch (error) {
    console.error("❌ 매출 데이터 저장 실패:", error);
    res.status(500).json({ error: "Failed to save revenue record" });
  }
});

// 1. 방문자 기록 저장 API (프론트엔드 진입 시 호출)
app.post("/api/visitors", async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const { path } = req.body;

    const repo = AppDataSource.getRepository(VisitorLog);
    const log = repo.create({
      ip: Array.isArray(ip) ? ip[0] : ip,
      userAgent,
      path: path || '/'
    });
    await repo.save(log);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("❌ 방문자 로그 저장 실패:", error);
    res.status(500).json({ error: "Failed to save visitor log" });
  }
});

// 2. 방문자 통계 조회 API (관리자 페이지용, 페이징 포함)
app.get("/api/visitors", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const skip = (page - 1) * limit;

    const repo = AppDataSource.getRepository(VisitorLog);
    const [list, total] = await repo.findAndCount({
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    // 오늘 방문자 수 및 총 방문자 수 계산
    const totalVisits = total;
    
    res.json({
      list,
      totalVisits,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ 방문자 통계 조회 실패:", error);
    res.status(500).json({ error: "Failed to fetch visitor stats" });
  }
});

// 💡 1. 상담 신청 등록 API (프론트엔드 ContactModal에서 호출)
app.post("/api/consultations", async (req, res) => {
  try {
    const { name, position, phone, email, content } = req.body;
    const repo = AppDataSource.getRepository(Consultation);
    const consultation = repo.create({
      name,
      position,
      phone,
      email,
      content,
      status: "미처리"
    });
    await repo.save(consultation);
    res.status(201).json({ success: true, consultation });
  } catch (error) {
    console.error("❌ 상담 신청 저장 실패:", error);
    res.status(500).json({ error: "Failed to save consultation" });
  }
});

// 💡 2. 상담 목록 조회 API (관리자 게시판 페이징용)
app.get("/api/consultations", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const repo = AppDataSource.getRepository(Consultation);
    const [list, total] = await repo.findAndCount({
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    res.json({
      list,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ 상담 목록 조회 실패:", error);
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
});

// 💡 3. 상담 상태 변경 API (미처리 -> 처리중 -> 처리완료)
app.patch("/api/consultations/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const repo = AppDataSource.getRepository(Consultation);
    
    await repo.update(id, { status });
    res.json({ success: true });
  } catch (error) {
    console.error("❌ 상담 상태 변경 실패:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// 💡 4. 특정 방의 이전 대화 내역 조회 API
app.get("/api/messages/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const messageRepo = AppDataSource.getRepository(ChatMessage);
    const messages = await messageRepo.find({
      where: { roomId },
      order: { createdAt: "ASC" },
    });
    res.json(messages);
  } catch (error) {
    console.error("❌ 대화 내역 조회 실패:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// 💡 5. 모든 방(고객) 목록 조회 API
app.get("/api/rooms", async (req, res) => {
  try {
    const messageRepo = AppDataSource.getRepository(ChatMessage);
    const messages = await messageRepo.find({
      order: { createdAt: "DESC" },
    });

    const roomMap = new Map();
    messages.forEach((msg) => {
      if (!roomMap.has(msg.roomId)) {
        roomMap.set(msg.roomId, {
          id: msg.roomId,
          clientName: msg.sender.startsWith("고객") ? msg.sender : `고객 (${msg.roomId.slice(-5)})`,
          projectType: '실시간 웹 위젯 상담',
          lastMessage: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: 0,
          status: 'active',
        });
      }
    });

    res.json(Array.from(roomMap.values()));
  } catch (error) {
    console.error("❌ 방 목록 조회 실패:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.io 실시간 이벤트 처리
io.on("connection", (socket) => {
  console.log(`⚡ 사용자 접속: ${socket.id}`);

  socket.on("join_room", (room_id: string) => {
    socket.join(room_id);
    console.log(`사용자 ${socket.id} 가 ${room_id} 방에 입장했습니다.`);
  });

  socket.on("send_message", async (data: { room_id: string; sender: string; message: string; clientName?: string }) => {
    try {
      const messageRepo = AppDataSource.getRepository(ChatMessage);

      const chatMessage = messageRepo.create({
        roomId: data.room_id,
        sender: data.sender,
        message: data.message,
      });
      await messageRepo.save(chatMessage);

      io.to(data.room_id).emit("receive_message", {
        room_id: data.room_id,
        sender: data.sender,
        message: data.message,
        createdAt: chatMessage.createdAt || new Date(),
        clientName: data.clientName
      });
      console.log(`[메시지 저장 & 전송 완료] ${data.sender}: ${data.message}`);
      
    } catch (error) {
      console.error("❌ 메시지 처리 중 에러 발생:", error);
      io.to(data.room_id).emit("receive_message", {
        room_id: data.room_id,
        sender: data.sender,
        message: data.message,
        createdAt: new Date()
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 사용자 연결 해제: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ 로컬 SQLite DB 연결 성공 !");
    httpServer.listen(PORT, () => {
      console.log(`🚀 실시간 채팅 서버 구동 완료 포트: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB 연결 실패:", error);
  });