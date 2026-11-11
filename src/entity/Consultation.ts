import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("consultations")
export class Consultation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" }) // 💡 타입을 직접 지정
  name!: string;

  @Column({ type: "varchar", nullable: true }) // 💡 타입을 직접 지정
  position!: string;

  @Column({ type: "varchar" })
  phone!: string;

  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "varchar", default: "미처리" })
  status!: "미처리" | "처리중" | "처리완료";

  @CreateDateColumn()
  createdAt!: Date;
}