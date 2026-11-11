import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("visitor_logs")
export class VisitorLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  ip!: string; // 방문자 IP 주소

  @Column({ type: "varchar", nullable: true })
  userAgent!: string; // 브라우저 및 기기 정보

  @Column({ type: "varchar", nullable: true })
  path!: string; // 방문 페이지 경로

  @CreateDateColumn()
  createdAt!: Date;
}