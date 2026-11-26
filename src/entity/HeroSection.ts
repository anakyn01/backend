import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from "typeorm";

export type HeroVisualType = "art" | "image";

export interface HeroSlideData {
  id: string;
  prefixLabel: string;
  typingText: string;
  what: string;
  who: string;
  title: string;
  desc: string;
  bgColor: string;
  visualType: HeroVisualType;
  artIndex: number; // 0 ~ 11 (기존 renderGeometricArt 인덱스)
  imageUrl: string;
  sortOrder: number;
}

@Entity()
export class HeroSection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", default: 16000 })
  intervalMs!: number;

  @Column({ type: "simple-json" })
  slides!: HeroSlideData[];

  @UpdateDateColumn()
  updatedAt!: Date;
}