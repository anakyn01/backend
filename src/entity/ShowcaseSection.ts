import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from "typeorm";

export type ShowcaseVisualType = "animation" | "image";

export type ShowcaseAnimKey =
  | "barChart"
  | "pulseRing"
  | "radarScan"
  | "orbitNodes"
  | "isoCube"
  | "waveBars"
  | "neonFrames";

export interface ShowcaseSlideItem {
  id: string;
  prefixText: string;
  title: string;
  description: string;
  visualType: ShowcaseVisualType;
  animKey: ShowcaseAnimKey;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
}

@Entity()
export class ShowcaseSection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "simple-json" })
  slides!: ShowcaseSlideItem[];

  @UpdateDateColumn()
  updatedAt!: Date;
}