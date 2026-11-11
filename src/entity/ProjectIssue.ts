import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("project_issues")
export class ProjectIssue {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  projectTitle!: string; // 프로젝트명

  @Column({ type: "varchar" })
  clientName!: string; // 클라이언트 / 담당자

  @Column({ type: "text" })
  description!: string; // 발생 내용 및 이슈 상세

  @Column({ type: "varchar", default: "접수" })
  status!: "접수" | "진행중" | "해결완료"; // 처리 상태

  @Column({ type: "varchar", default: "일반" })
  priority!: "긴급" | "중요" | "일반"; // 우선순위

  @CreateDateColumn()
  createdAt!: Date;
}