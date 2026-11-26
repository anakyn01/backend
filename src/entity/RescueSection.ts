import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from "typeorm";

export type RescueIconKey = "userMinus" | "ticket" | "message" | "shield";

export interface RescueCardItem {
  id: string;
  roleTitle: string;
  quote: string;
  iconKey: RescueIconKey;
  highlight: boolean;
  sortOrder: number;
}

@Entity()
export class RescueSection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 80, default: "02 / PROJECT RESCUE" })
  eyebrow!: string;

  @Column({ type: "varchar", length: 60, default: "RESCUE" })
  mainTitle!: string;

  @Column({
    type: "varchar",
    length: 140,
    default: "외주 개발 실패로 속앓이하던 사장님들이 마지막에 찾는 곳",
  })
  headline!: string;

  @Column({
    type: "text",
    default:
      '"개발자가 연락 두절됐어요", "오픈 날 서버가 터졌어요", "기획서가 없다고 추가금만 요구해요." HBK는 주니어에게 하청을 주지 않습니다. 15년 이상 경력의 시니어 아키텍트가 직접 비즈니스 본질을 파악하고, 엉망이 된 코드의 심폐소생부터 매출을 만드는 자동화 ERP까지 정공법으로 완성합니다.',
  })
  overallReview!: string;

  @Column({ type: "varchar", length: 80, default: "More Success Cases +" })
  ctaLabel!: string;

  @Column({ type: "varchar", length: 255, default: "" })
  ctaLink!: string;

  @Column({ type: "simple-json" })
  cards!: RescueCardItem[];

  @UpdateDateColumn()
  updatedAt!: Date;
}