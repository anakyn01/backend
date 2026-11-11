import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { DataSource } from "typeorm";
import { ChatMessage } from "./entity/ChatMessage";
import { Consultation } from "./entity/Consultation";
import { VisitorLog } from "./entity/VisitorLog";
import { RevenueRecord } from "./entity/RevenueRecord";
import { ProjectIssue } from "./entity/ProjectIssue";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities:[ChatMessage, Consultation, VisitorLog, RevenueRecord, ProjectIssue],
});

const app = express();
app.use(cors());
app.use(express.json());

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