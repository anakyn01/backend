import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("revenue_records")
export class RevenueRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  projectName!: string; // 프로젝트명 또는 클라이언트

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  revenue!: number; // 매출액 (수익)

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  expense!: number; // 지출 (비용)

  @Column({ type: "varchar", default: "완료" })
  status!: string; // 상태 (진행중, 완료 등)

  @CreateDateColumn()
  createdAt!: Date;
}