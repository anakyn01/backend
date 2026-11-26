import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from "typeorm";

export type SolutionAnimKey =
  | "isoCube"
  | "neonFrames"
  | "pulseRing"
  | "radarScan"
  | "orbitNodes"
  | "waveFlow"
  | "quantumGrid";

export interface SolutionSlotItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  animKey: SolutionAnimKey;
  linkUrl: string;
  sortOrder: number;
}

@Entity()
export class SolutionSection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "simple-json" })
  solutions!: SolutionSlotItem[];

  @UpdateDateColumn()
  updatedAt!: Date;
}