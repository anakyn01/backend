import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from "typeorm";

export type BusinessVisualType = "image" | "animation";
export type BusinessAnimationKey =
  | "pulse"
  | "radar"
  | "cube"
  | "orbit"
  | "wave"
  | "grid";

export interface BusinessCardData {
  id: string;
  title: string;
  description: string;
  visualType: BusinessVisualType;
  animationKey: BusinessAnimationKey;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
}

@Entity()
export class BusinessSection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 80, default: "HBK AGENCY" })
  eyebrow!: string;

  @Column({ type: "varchar", length: 120, default: "BUSINESS" })
  title!: string;

  @Column({
    type: "varchar",
    length: 255,
    default: "축적된 IT 기술과 노하우를 바탕으로 최상의 서비스를 제공하는 기업",
  })
  subtitle!: string;

  @Column({ type: "varchar", length: 80, default: "More Core Platforms +" })
  ctaLabel!: string;

  @Column({ type: "varchar", length: 255, default: "#step-5" })
  ctaLink!: string;

  @Column({ type: "simple-json" })
  cards!: BusinessCardData[];

  @UpdateDateColumn()
  updatedAt!: Date;
}